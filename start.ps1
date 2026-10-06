$root = "D:\Download\Projects\WBSL Bridge"

$backendScript  = Join-Path $env:TEMP "wbsl-backend.ps1"
$frontendScript = Join-Path $env:TEMP "wbsl-frontend.ps1"
$aiScript       = Join-Path $env:TEMP "wbsl-ai.ps1"
$backendPort    = 8200

$backendListeners = @(
    Get-NetTCPConnection -State Listen -LocalPort $backendPort -ErrorAction SilentlyContinue
)
$backendAlreadyRunning = $false
foreach ($listener in $backendListeners) {
    $listenerProcess = Get-CimInstance Win32_Process `
        -Filter "ProcessId = $($listener.OwningProcess)" -ErrorAction Stop

    if ($listenerProcess.CommandLine -match 'backend\.main:app') {
        $backendAlreadyRunning = $true
        continue
    }

    throw "Port $backendPort is already in use by $($listenerProcess.Name) (PID $($listenerProcess.ProcessId)). Close that process before starting WBSL Bridge."
}

# Backend
@"
Set-Location '$root'
& 'tests\.venv\Scripts\python.exe' -m uvicorn backend.main:app --reload --port $backendPort
"@ | Set-Content -Path $backendScript -Encoding UTF8

# Frontend
@"
Set-Location '$root\frontend'
`$env:Path = 'C:\Program Files\nodejs;' + `$env:Path
npm run dev
"@ | Set-Content -Path $frontendScript -Encoding UTF8

# AI Server
@"
Set-Location '$root'

`$kobold = Join-Path (Get-Location) 'models\llm\koboldcpp.exe'
`$model = Join-Path (Get-Location) 'models\llm\gemma-4-E4B-it-Q4_K_M.gguf'

`$args = @(
    '--model', `$model
    '--jinja'
    '--jinjathink', 'false'
    '--threads', '8'
)

& `$kobold @args
"@ | Set-Content -Path $aiScript -Encoding UTF8

# Windows Terminal
$wtArgs = @("-w", "0")
$tabs = [System.Collections.Generic.List[object]]::new()

if ($backendAlreadyRunning) {
    Write-Host "Backend is already listening on port $backendPort; reusing it."
} else {
    $tabs.Add(@{ Title = "Backend"; Directory = $root; Script = $backendScript })
}
$tabs.Add(@{ Title = "AI Server"; Directory = $root; Script = $aiScript })
$tabs.Add(@{ Title = "Frontend"; Directory = "$root\frontend"; Script = $frontendScript })

for ($i = 0; $i -lt $tabs.Count; $i++) {
    if ($i -gt 0) {
        $wtArgs += ";"
    }

    $tab = $tabs[$i]
    $wtArgs += @(
        "new-tab", "--title", $tab.Title,
        "-d", $tab.Directory,
        "powershell", "-NoExit", "-File", $tab.Script
    )
}

& wt.exe @wtArgs