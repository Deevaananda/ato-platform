# Converting Markdown Documentation to ODF Format

## Option 1: Using Pandoc (Recommended)

### Install Pandoc
1. **Windows**: Download from [pandoc.org](https://pandoc.org/installing.html)
2. **Alternative**: Use Chocolatey: `choco install pandoc`

### Convert to ODF
Run these commands in PowerShell from your project directory:

```powershell
# Convert Technical Documentation
pandoc "ATO_Platform_Technical_Documentation.md" -o "ATO_Platform_Technical_Documentation.odt" --from markdown --to odt

# Convert User Manual
pandoc "ATO_Platform_User_Manual.md" -o "ATO_Platform_User_Manual.odt" --from markdown --to odt

# Convert Installation Guide
pandoc "INSTALLATION_GUIDE.md" -o "INSTALLATION_GUIDE.odt" --from markdown --to odt
```

### Advanced Conversion with Styling
```powershell
# With custom reference document for styling
pandoc "ATO_Platform_Technical_Documentation.md" -o "ATO_Platform_Technical_Documentation.odt" --reference-doc="reference.odt" --toc --number-sections

# Multiple files to single document
pandoc "ATO_Platform_Technical_Documentation.md" "ATO_Platform_User_Manual.md" "INSTALLATION_GUIDE.md" -o "Complete_ATO_Documentation.odt" --toc --number-sections
```

## Option 2: Using LibreOffice Writer

### Method 1: Direct Import
1. Open LibreOffice Writer
2. File → Open
3. Select your `.md` file
4. Choose "Markdown" as file type
5. File → Export as PDF or Save As → ODF Text Document (.odt)

### Method 2: Copy-Paste with Formatting
1. Open the `.md` file in VS Code or any markdown viewer
2. Copy the rendered content
3. Paste into LibreOffice Writer
4. Format as needed
5. Save as `.odt`

## Option 3: Online Converters

### Recommended Online Tools
1. **CloudConvert**: [cloudconvert.com](https://cloudconvert.com/md-to-odt)
2. **Pandoc Try**: [pandoc.org/try](https://pandoc.org/try/)
3. **OnlineConvert**: [onlineconvert.com](https://document.onlineconvert.com/convert-to-odt)

### Steps
1. Upload your `.md` file
2. Select output format as `.odt`
3. Convert and download

## Option 4: VS Code Extension

### Install Markdown to PDF Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Markdown PDF"
4. Install the extension
5. Open your `.md` file
6. Press Ctrl+Shift+P
7. Type "Markdown PDF: Export"
8. Choose PDF format

Then convert PDF to ODF using LibreOffice:
1. Open the PDF in LibreOffice Writer
2. File → Export as → ODF Text Document

## Quick PowerShell Script

Save this as `convert-to-odf.ps1`:

```powershell
# Check if pandoc is installed
if (!(Get-Command pandoc -ErrorAction SilentlyContinue)) {
    Write-Host "Pandoc not found. Please install pandoc first." -ForegroundColor Red
    Write-Host "Download from: https://pandoc.org/installing.html" -ForegroundColor Yellow
    exit 1
}

# Convert all markdown files to ODF
$markdownFiles = Get-ChildItem -Filter "*.md" -Exclude "README.md"

foreach ($file in $markdownFiles) {
    $outputFile = $file.BaseName + ".odt"
    Write-Host "Converting $($file.Name) to $outputFile..." -ForegroundColor Green
    
    pandoc $file.Name -o $outputFile --from markdown --to odt --toc --number-sections
    
    if (Test-Path $outputFile) {
        Write-Host "✓ Successfully created $outputFile" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create $outputFile" -ForegroundColor Red
    }
}

Write-Host "`nConversion complete! Check the generated .odt files." -ForegroundColor Cyan
```

Run with: `powershell -ExecutionPolicy Bypass .\convert-to-odf.ps1`

## Document Structure for ODF

The generated ODF documents will include:

### Technical Documentation
- Title page with project information
- Table of contents (auto-generated)
- Numbered sections and subsections
- Code blocks with syntax highlighting
- Tables for API documentation
- Proper heading hierarchy

### User Manual
- User-friendly formatting
- Step-by-step instructions
- Screenshots (if added to markdown)
- Troubleshooting sections
- Quick reference guides

### Installation Guide
- Code blocks for terminal commands
- System requirements tables
- Directory structure diagrams
- Configuration examples

## Tips for Better ODF Output

### 1. Improve Markdown Structure
- Use proper heading levels (#, ##, ###)
- Add table of contents markers
- Include metadata at the top

### 2. Add Metadata to Markdown
```yaml
---
title: "ATO Platform Technical Documentation"
author: "Development Team"
date: "September 26, 2025"
subject: "Automatic Timetable Organization System"
keywords: "timetable, optimization, university, scheduling"
---
```

### 3. Custom Styling
Create a reference document in LibreOffice:
1. Open LibreOffice Writer
2. Set desired fonts, colors, margins
3. Save as `reference.odt`
4. Use with pandoc: `--reference-doc=reference.odt`

## Final Output Files

After conversion, you'll have:
- `ATO_Platform_Technical_Documentation.odt` (Complete technical specs)
- `ATO_Platform_User_Manual.odt` (End-user guide)
- `INSTALLATION_GUIDE.odt` (Setup instructions)
- `Complete_ATO_Documentation.odt` (All-in-one document)

These ODF files can be opened in:
- LibreOffice Writer
- Apache OpenOffice Writer
- Microsoft Word (with some compatibility)
- Google Docs (import feature)

Choose the conversion method that works best for your environment!