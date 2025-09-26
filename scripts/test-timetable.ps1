$env:PORT = "3005"
$proc = $null

Write-Output "Starting Next.js dev server on port $($env:PORT)..."

try {
    $npmPath = (Get-Command npm.cmd -ErrorAction Stop).Source
    $proc = Start-Process -FilePath $npmPath -ArgumentList "run","dev" -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 8

    $baseUrl = "http://localhost:$($env:PORT)"

    Write-Output "Fetching departments..."
    $departmentsResponse = Invoke-RestMethod -Uri "$baseUrl/api/departments" -Method GET
    if (-not $departmentsResponse -or -not $departmentsResponse.data -or $departmentsResponse.data.Count -eq 0) {
        Write-Output "No departments returned from API."
        exit 1
    }

    $preferredDepartment = $departmentsResponse.data | Where-Object { $_.code -eq "CSE" } | Select-Object -First 1
    if ($preferredDepartment) {
        $departmentId = $preferredDepartment.id
    } else {
        $departmentId = $departmentsResponse.data[0].id
    }
    $semesterValue = "1"

    $payload = @{
        department = $departmentId
        semester = $semesterValue
        batchSize = 30
        subjects = @()
        optimizationGoals = @("maximize_utilization", "minimize_conflicts")
        maxIterations = 20
        timeLimit = 60
    } | ConvertTo-Json -Depth 5

    Write-Output "Requesting timetable generation..."
    $generationResponse = Invoke-RestMethod -Uri "$baseUrl/api/timetables/generate" -Method POST -Body $payload -ContentType "application/json"
    $generationResponse | ConvertTo-Json -Depth 5 | Write-Output
}
catch {
    if ($_.Exception.Response) {
        $responseStream = $_.Exception.Response.GetResponseStream()
        if ($responseStream) {
            $reader = New-Object System.IO.StreamReader($responseStream)
            $body = $reader.ReadToEnd()
            $reader.Close()
            Write-Output "Test failed ($($_.Exception.Response.StatusCode)): $body"
        } else {
            Write-Output "Test failed: $($_.Exception.Message)"
        }
    } else {
        Write-Output "Test failed: $($_.Exception.Message)"
    }
}
finally {
    if ($proc -and -not $proc.HasExited) {
        $proc | Stop-Process
        Write-Output "Stopped dev server."
    }
}
