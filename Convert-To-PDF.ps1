# PowerShell Script to Convert Project Report to PDF
Write-Host "=== ATO Platform Project Report - PDF Conversion ===" -ForegroundColor Cyan
Write-Host ""

# Display conversion methods
Write-Host "Available Conversion Methods:" -ForegroundColor Green
Write-Host "1. VS Code Extension (Easiest)"
Write-Host "2. Online Converters (No installation)"
Write-Host "3. NPM markdown-pdf (If Node.js installed)"
Write-Host "4. Manual copy-paste to Word/Google Docs"
Write-Host ""

# Method 1: VS Code Extension
Write-Host "Method 1: VS Code Extension (Recommended)" -ForegroundColor Yellow
Write-Host "- Install 'Markdown PDF' extension in VS Code"
Write-Host "- Open ATO_Platform_Project_Report.md"  
Write-Host "- Press Ctrl+Shift+P"
Write-Host "- Type 'Markdown PDF: Export (pdf)'"
Write-Host "- Wait for conversion (may take 1-2 minutes)"
Write-Host ""

# Method 2: Online Converters
Write-Host "Method 2: Online Converters" -ForegroundColor Yellow
Write-Host "- CloudConvert: https://cloudconvert.com/md-to-pdf"
Write-Host "- Markdown to PDF: https://md-to-pdf.fly.dev/"
Write-Host "- Upload your .md file and download PDF"
Write-Host ""

# Try NPM method if available
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Method 3: NPM markdown-pdf (Available)" -ForegroundColor Green
    $choice = Read-Host "Install and use markdown-pdf? (y/n)"
    
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        Write-Host "Installing markdown-pdf..." -ForegroundColor Cyan
        npm install -g markdown-pdf
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Converting to PDF..." -ForegroundColor Cyan
            markdown-pdf "ATO_Platform_Project_Report.md"
            
            if (Test-Path "ATO_Platform_Project_Report.pdf") {
                Write-Host "SUCCESS: PDF created!" -ForegroundColor Green
                $openFile = Read-Host "Open PDF now? (y/n)"
                if ($openFile -eq 'y') {
                    Start-Process "ATO_Platform_Project_Report.pdf"
                }
            }
        }
    }
} else {
    Write-Host "Method 3: NPM not available" -ForegroundColor Red
}

Write-Host ""
Write-Host "Report Summary:" -ForegroundColor Cyan
Write-Host "- Executive Summary and Business Impact"
Write-Host "- Technical Architecture and Implementation" 
Write-Host "- Feature Documentation (45+ features)"
Write-Host "- Performance Analysis and Benchmarks"
Write-Host "- Security Implementation Details"
Write-Host "- Deployment and Infrastructure Guide"
Write-Host "- Cost-Benefit Analysis and ROI"
Write-Host "- Future Roadmap and Recommendations"
Write-Host ""
Write-Host "Expected PDF: 30-40 pages, professional business format"

Read-Host "Press Enter to exit..."