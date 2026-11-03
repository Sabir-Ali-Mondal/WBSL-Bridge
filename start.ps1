$root = $PSScriptRoot
$python = Join-Path $root ".venv\Scripts\python.exe"
$requirements = Join-Path $root "requirements.txt"
$envFile = Join-Path $root ".env"
$backendScript  = Join-Path $env:TEMP "wbsl-backend.ps1"
$frontendScript = Join-Path $env:TEMP "wbsl-frontend.ps1"
$aiScript       = Join-Path $env:TEMP "wbsl-ai.ps1"
$backendPort    = 8200

if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
    throw "Python environment missing. Run: py -3.11 -m venv .venv; .\.venv\Scripts\python.exe -m pip install -r requirements.txt"
}
if (-not (Test-Path -LiteralPath $requirements -PathType Leaf)) {
    throw "requirements.txt not found: $requirements"
}
if (-not (Test-Path -LiteralPath $envFile -PathType Leaf)) {
    throw ".env file not found at project root. Create it from the template."
}

$envVars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) { $envVars[$parts[0].Trim()] = $parts[1].Trim() }
    }
}
foreach ($name in $envVars.Keys) {
    [Environment]::SetEnvironmentVariable($name, $envVars[$name], "Process")
}

$aiMode = $envVars["AI_MODE"]
if (-not $aiMode) { throw "AI_MODE not set in .env." }
if ($aiMode -ne "online" -and $aiMode -ne "offline") { throw "Invalid AI_MODE '$aiMode'." }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " WBSL BRIDGE - STARTUP" -ForegroundColor Cyan
Write-Host " AI Mode: $aiMode" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

$backendListeners = @(Get-NetTCPConnection -State Listen -LocalPort $backendPort -ErrorAction SilentlyContinue)
$backendAlreadyRunning = $false
foreach ($listener in $backendListeners) {
    $listenerProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)" -ErrorAction Stop
    if ($listenerProcess.CommandLine -match 'backend\.main:app') { $backendAlreadyRunning = $true; continue }
    throw "Port $backendPort in use by $($listenerProcess.Name) (PID $($listenerProcess.ProcessId))."
}

if ($aiMode -eq "offline") {
    $offlineModel = $envVars["AI_OFFLINE_MODEL_NAME"]
    if (-not $offlineModel) { throw "AI_OFFLINE_MODEL_NAME not set in .env" }
    $modelPath = Join-Path $root "models\llm\$offlineModel"
    if (-not (Test-Path -LiteralPath $modelPath -PathType Leaf)) {
        Write-Host "WARNING: Offline model not found at $modelPath" -ForegroundColor Yellow
    }
    $aiScriptContent = @'
Set-Location '__ROOT__'
$kobold = Join-Path (Get-Location) 'models\llm\koboldcpp.exe'
$model = '__MODEL_PATH__'
$args = @('--model', $model, '--port', '5001', '--jinja', '--jinjathink', 'false', '--threads', '8', '--contextsize', '4096')
Write-Host "Starting KoboldCpp (offline) with: __MODEL_NAME__" -ForegroundColor Green
& $kobold @args
'@
    $aiScriptContent = $aiScriptContent.Replace('__ROOT__', $root).Replace('__MODEL_PATH__', $modelPath).Replace('__MODEL_NAME__', $offlineModel)
    Set-Content -Path $aiScript -Value $aiScriptContent -Encoding UTF8
} else {
    $onlineModel = $envVars["AI_ONLINE_MODEL_NAME"]
    $aiScriptContent = @'
Set-Location '__ROOT__'
Write-Host "Online mode - using OpenRouter API" -ForegroundColor Green
Write-Host "Model: __MODEL_NAME__" -ForegroundColor Yellow
Write-Host "No local AI server needed. Press Ctrl+C to close."
while ($true) { Start-Sleep -Seconds 60 }
'@
    $aiScriptContent = $aiScriptContent.Replace('__ROOT__', $root).Replace('__MODEL_NAME__', $onlineModel)
    Set-Content -Path $aiScript -Value $aiScriptContent -Encoding UTF8
}

$backendScriptContent = @'
Set-Location '__ROOT__'
& '__PYTHON__' -m uvicorn backend.main:app --reload --port __BACKEND_PORT__
'@
$backendScriptContent = $backendScriptContent.Replace('__ROOT__', $root).Replace('__PYTHON__', $python).Replace('__BACKEND_PORT__', [string]$backendPort)
Set-Content -Path $backendScript -Value $backendScriptContent -Encoding UTF8

$frontendScriptContent = @'
Set-Location '__FRONTEND__'
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
npm run dev
'@
$frontendScriptContent = $frontendScriptContent.Replace('__FRONTEND__', (Join-Path $root 'frontend'))
Set-Content -Path $frontendScript -Value $frontendScriptContent -Encoding UTF8

$wtArgs = @("-w", "0")
$tabs = [System.Collections.Generic.List[object]]::new()

if ($backendAlreadyRunning) {
    Write-Host "Backend already listening on port $backendPort; reusing it." -ForegroundColor Green
} else {
    $tabs.Add(@{ Title = "Backend"; Directory = $root; Script = $backendScript })
}
$tabs.Add(@{ Title = "AI Server ($aiMode)"; Directory = $root; Script = $aiScript })
$tabs.Add(@{ Title = "Frontend"; Directory = "$root\frontend"; Script = $frontendScript })

for ($i = 0; $i -lt $tabs.Count; $i++) {
    if ($i -gt 0) { $wtArgs += ";" }
    $tab = $tabs[$i]
    $wtArgs += @("new-tab", "--title", $tab.Title, "-d", $tab.Directory, "powershell", "-NoExit", "-File", $tab.Script)
}
& wt.exe @wtArgs
