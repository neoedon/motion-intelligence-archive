param(
    [string]$Date = (Get-Date -Format "yyyy-MM-dd"),
    [string]$Remote = "github"
)

$ErrorActionPreference = "Stop"
$SiteRoot = Split-Path $PSScriptRoot -Parent
$WorkspaceRoot = Split-Path $SiteRoot -Parent
$ArchiveDay = Join-Path $WorkspaceRoot "archive\$Date"
$SyncScript = Join-Path $WorkspaceRoot "scripts\sync_site.py"

$required = @(
    (Join-Path $ArchiveDay "reports\manifest.json"),
    (Join-Path $ArchiveDay "audio\summary.json"),
    (Join-Path $ArchiveDay "contact_sheets")
)

foreach ($path in $required) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Daily archive is incomplete: $path"
    }
}

Push-Location $SiteRoot
try {
    $dirty = & git status --porcelain
    if ($LASTEXITCODE -ne 0) { throw "Git status failed." }
    if ($dirty) {
        throw "Site workspace has uncommitted changes; refusing to overwrite them."
    }

    & git fetch $Remote main
    if ($LASTEXITCODE -ne 0) { throw "Git remote fetch failed." }

    & git merge --ff-only "$Remote/main"
    if ($LASTEXITCODE -ne 0) {
        throw "Local and remote site history diverged; manual reconciliation is required."
    }
}
finally {
    Pop-Location
}

Push-Location $WorkspaceRoot
try {
    & python $SyncScript --date $Date
    if ($LASTEXITCODE -ne 0) { throw "Site sync failed." }
}
finally {
    Pop-Location
}

Push-Location $SiteRoot
try {
    & npm.cmd run test:pages
    if ($LASTEXITCODE -ne 0) { throw "GitHub Pages validation failed." }

    & git add -- "app/site-data.json" "public/site-data.json" "public/data/$Date.json" "public/media/$Date"
    & git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        & git commit -m "Add motion archive for $Date"
        if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }
    }

    & git push $Remote main
    if ($LASTEXITCODE -ne 0) { throw "GitHub push failed." }
}
finally {
    Pop-Location
}
