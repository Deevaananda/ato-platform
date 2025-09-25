-- Database schema for Adaptive Timetabling Optimizer
-- This file contains the SQL schema for PostgreSQL/MySQL

-- Departments table
CREATE TABLE departments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    head VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    credits INT NOT NULL,
    semester INT NOT NULL,
    year INT NOT NULL,
    type ENUM('core', 'elective', 'lab', 'project') NOT NULL,
    description TEXT,
    prerequisites JSON,
    max_students INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Instructors table
CREATE TABLE instructors (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    designation ENUM('professor', 'associate_professor', 'assistant_professor', 'lecturer') NOT NULL,
    specializations JSON,
    max_hours_per_week INT DEFAULT 20,
    preferred_time_slots JSON,
    unavailable_slots JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Rooms table
CREATE TABLE rooms (
    id VARCHAR(36) PRIMARY KEY,
    number VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    building VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    type ENUM('classroom', 'lab', 'auditorium', 'seminar_hall') NOT NULL,
    facilities JSON,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Time slots table
CREATE TABLE time_slots (
    id VARCHAR(36) PRIMARY KEY,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INT NOT NULL,
    period INT NOT NULL
);

-- Classes table
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    instructor_id VARCHAR(36) NOT NULL,
    room_id VARCHAR(36),
    time_slot_id VARCHAR(36),
    section VARCHAR(10) NOT NULL,
    enrolled_students INT DEFAULT 0,
    max_students INT NOT NULL,
    semester INT NOT NULL,
    year INT NOT NULL,
    is_scheduled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE SET NULL
);

-- Schedules table
CREATE TABLE schedules (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    year INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    optimization_score DECIMAL(5,2),
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Scheduled classes table (junction table for schedule and classes)
CREATE TABLE scheduled_classes (
    id VARCHAR(36) PRIMARY KEY,
    schedule_id VARCHAR(36) NOT NULL,
    class_id VARCHAR(36) NOT NULL,
    course_id VARCHAR(36) NOT NULL,
    instructor_id VARCHAR(36) NOT NULL,
    room_id VARCHAR(36) NOT NULL,
    time_slot_id VARCHAR(36) NOT NULL,
    section VARCHAR(10) NOT NULL,
    enrolled_students INT DEFAULT 0,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE CASCADE,
    UNIQUE KEY unique_schedule_class (schedule_id, class_id)
);

-- Constraints table
CREATE TABLE constraints (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority ENUM('hard', 'soft') NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.00,
    parameters JSON,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optimization results table
CREATE TABLE optimization_results (
    id VARCHAR(36) PRIMARY KEY,
    schedule_id VARCHAR(36) NOT NULL,
    algorithm ENUM('genetic', 'simulated_annealing', 'constraint_satisfaction', 'hybrid') NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    violations JSON,
    execution_time INT NOT NULL,
    iterations INT NOT NULL,
    parameters JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

-- Timetable preferences table
CREATE TABLE timetable_preferences (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    working_days JSON NOT NULL,
    working_hours JSON NOT NULL,
    lunch_break JSON NOT NULL,
    max_consecutive_hours INT DEFAULT 4,
    preferred_rooms JSON,
    avoid_time_slots JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_preferences (user_id)
);

-- Academic calendar table
CREATE TABLE academic_calendar (
    id VARCHAR(36) PRIMARY KEY,
    year INT NOT NULL,
    semester INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    holidays JSON,
    exam_periods JSON,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_year_semester (year, semester)
);

-- Indexes for better performance
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_courses_semester_year ON courses(semester, year);
CREATE INDEX idx_instructors_department ON instructors(department_id);
CREATE INDEX idx_classes_course ON classes(course_id);
CREATE INDEX idx_classes_instructor ON classes(instructor_id);
CREATE INDEX idx_classes_room ON classes(room_id);
CREATE INDEX idx_classes_time_slot ON classes(time_slot_id);
CREATE INDEX idx_classes_semester_year ON classes(semester, year);
CREATE INDEX idx_scheduled_classes_schedule ON scheduled_classes(schedule_id);
CREATE INDEX idx_scheduled_classes_time_room ON scheduled_classes(time_slot_id, room_id);
CREATE INDEX idx_optimization_results_schedule ON optimization_results(schedule_id);
CREATE INDEX idx_time_slots_day_time ON time_slots(day_of_week, start_time);
