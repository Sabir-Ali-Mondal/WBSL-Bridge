$root = "D:\Download\Projects\WBSL Bridge"

$backendScript  = Join-Path $env:TEMP "wbsl-backend.ps1"
$frontendScript = Join-Path $env:TEMP "wbsl-frontend.ps1"
$aiScript       = Join-Path $env:TEMP "wbsl-ai.ps1"

# Backend
@"
Set-Location '$root'
& 'tests\.venv\Scripts\python.exe' -m uvicorn backend.main:app --reload --port 8000
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
$wtArgs = @(
    "-w", "0",
    "new-tab", "--title", "Backend",
        "-d", $root,
        "powershell", "-NoExit", "-File", $backendScript,
    ";",
    "new-tab", "--title", "AI Server",
        "-d", $root,
        "powershell", "-NoExit", "-File", $aiScript,
    ";",
    "new-tab", "--title", "Frontend",
        "-d", "$root\frontend",
        "powershell", "-NoExit", "-File", $frontendScript
)

& wt.exe @wtArgs