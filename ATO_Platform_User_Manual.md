# ATO Platform - User Manual
# Quick Start Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Dashboard Overview](#dashboard-overview)
5. [Resource Management](#resource-management)
6. [Timetable Generation](#timetable-generation)
7. [Reports and Analytics](#reports-and-analytics)
8. [Troubleshooting](#troubleshooting)

## Introduction

The ATO Platform (Automatic Timetable Organization System) is a web-based solution designed to automate university timetable creation using advanced genetic algorithms.

### Key Benefits
- Automated timetable generation
- Conflict-free scheduling
- Optimal resource utilization
- Real-time progress tracking
- Comprehensive reporting

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Screen resolution: 1024x768 minimum

### Accessing the System
1. Open your web browser
2. Navigate to the ATO Platform URL
3. Enter your login credentials
4. Click "Login"

### Demo Credentials
**Administrator:**
- Email: `admin@example.com`
- Password: `admin123`

**Faculty:**
- Email: `faculty@example.com`
- Password: `faculty123`

## User Roles

### Administrator
- Full system access
- Manage all resources (departments, courses, instructors, rooms)
- Generate timetables for any department
- View all reports and analytics
- System configuration

### Faculty
- View own department data
- Access assigned courses and schedules
- Generate reports for own department
- Limited editing permissions

### Coordinator
- Read-only access to timetables
- Basic reporting capabilities
- Schedule viewing and printing

## Dashboard Overview

The dashboard provides a quick overview of system status:

### Key Metrics Cards
- **Total Departments**: Number of academic departments
- **Total Courses**: Number of courses in system
- **Total Instructors**: Number of faculty members
- **Total Rooms**: Number of available classrooms
- **System Utilization**: Overall resource usage percentage

### Quick Actions
- Generate New Timetable
- View Recent Timetables
- Add New Resource
- View Conflict Reports

## Resource Management

### Managing Departments

**Adding a Department:**
1. Click "Resources" in the sidebar
2. Select "Departments" tab
3. Click "Add New Department"
4. Fill in the form:
   - Department Name
   - Department Code (e.g., CSE, ECE)
   - Head of Department
   - Description
5. Click "Add Department"

**Editing a Department:**
1. Find the department in the list
2. Click the "Edit" button
3. Modify the information
4. Click "Update Department"

### Managing Courses

**Adding a Course:**
1. Navigate to Resources → Courses
2. Click "Add New Course"
3. Complete the course form:
   - Course Code (e.g., CSE101)
   - Course Name
   - Department
   - Credits (1-6)
   - Semester (1-8)
   - Year (1-4)
   - Course Type (Core/Elective/Open)
   - Maximum Students
   - Prerequisites (if any)
4. Save the course

### Managing Instructors

**Adding an Instructor:**
1. Go to Resources → Instructors
2. Click "Add New Instructor"
3. Enter instructor details:
   - Employee ID
   - Full Name
   - Email Address
   - Department
   - Designation (Professor/Associate Professor/Assistant Professor)
   - Specializations
   - Maximum Hours per Week
4. Save the instructor profile

### Managing Rooms

**Adding a Room:**
1. Navigate to Resources → Rooms
2. Click "Add New Room"
3. Enter room information:
   - Room Number
   - Room Name
   - Building
   - Capacity
   - Room Type (Classroom/Lab/Auditorium)
   - Available Facilities
4. Save the room

## Timetable Generation

### Basic Generation Process

**Step 1: Configuration**
1. Go to Timetables → Generator
2. Select target department from dropdown
3. Choose semester (1-8)
4. Set batch size (number of students)

**Step 2: Optimization Goals**
Select your optimization objectives:
- ✅ Maximize Room Utilization
- ✅ Minimize Conflicts
- ✅ Balance Faculty Workload
- ✅ Respect Preferences

**Step 3: Algorithm Settings**
- Max Iterations: 50 (default) - 200 (maximum)
- Time Limit: 180 seconds (default)

**Step 4: Generate**
1. Click "Generate Timetable Options"
2. Monitor progress bar
3. Wait for completion (typically 2-5 minutes)

### Reviewing Generated Options

The system provides multiple optimized solutions:

**Solution Metrics:**
- **Overall Score**: 0-100% quality rating
- **Status**: Optimal/Good/Acceptable/Infeasible
- **Conflicts**: Number of scheduling conflicts
- **Utilization**: Room usage percentage
- **Faculty Load**: Instructor workload percentage

**Selecting a Solution:**
1. Review each generated option
2. Click "View Details" for more information
3. Click "Select This Option" to choose
4. Confirm your selection

### Understanding Solution Status

- **🟢 Optimal (85-100%)**: Excellent solution, ready to use
- **🔵 Good (70-84%)**: Very usable solution with minor issues
- **🟡 Acceptable (55-69%)**: Usable but may need adjustments
- **🔴 Infeasible (0-54%)**: Too many conflicts, needs resource review

## Reports and Analytics

### Performance Dashboard

Access comprehensive analytics:
1. Navigate to Reports → Performance Dashboard
2. View key metrics:
   - Resource utilization trends
   - Conflict analysis
   - Faculty workload distribution
   - Room occupancy rates

### Infeasibility Analyzer

When timetable generation fails:
1. Go to Reports → Infeasibility Analyzer
2. Click "Run Analysis"
3. Review detected issues:
   - Room conflicts
   - Instructor conflicts
   - Capacity violations
   - Resource shortages
4. Follow suggested solutions

### Generating Reports

**Export Options:**
1. Navigate to desired report section
2. Set filters (date range, department, etc.)
3. Choose format (PDF/CSV)
4. Click "Generate Report"
5. Download when ready

## Troubleshooting

### Common Issues

**Problem: Login Failed**
- Solution: Check credentials, ensure caps lock is off
- Contact: Administrator for password reset

**Problem: No Timetable Generated**
- Solution: Check resource availability (rooms, instructors)
- Verify course assignments and constraints
- Increase time limit or iterations

**Problem: All Solutions Show Conflicts**
- Solution: Review resource constraints
- Add more rooms or instructors
- Adjust course requirements
- Use Infeasibility Analyzer

**Problem: System Running Slowly**
- Solution: Close other browser tabs
- Check internet connection
- Clear browser cache
- Try different browser

### Getting Help

**Documentation:**
- User Manual (this document)
- Technical Documentation
- API Documentation

**Support Channels:**
- Internal IT Support
- System Administrator
- Training Materials
- FAQ Section

### Error Messages

**"Insufficient Resources"**
- Meaning: Not enough rooms or instructors for courses
- Action: Add resources or reduce course load

**"Generation Timeout"**
- Meaning: Algorithm took too long to find solution
- Action: Increase time limit or reduce complexity

**"Authentication Failed"**
- Meaning: Login credentials incorrect or expired
- Action: Re-enter credentials or contact admin

## Best Practices

### Data Management
- Keep resource information up to date
- Regularly review and update constraints
- Maintain accurate contact information
- Back up important configurations

### Timetable Generation
- Start with basic optimization goals
- Gradually add complexity as needed
- Review solutions carefully before selection
- Save successful configurations for reuse

### System Usage
- Log out when finished
- Use appropriate user role permissions
- Report issues promptly
- Follow institutional data policies

---

**Document Version**: 1.0
**Last Updated**: September 26, 2025
**Support Contact**: System Administrator

For additional help, consult the Technical Documentation or contact your system administrator.