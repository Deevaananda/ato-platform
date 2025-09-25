/**
 * NEP 2020 Compliance Features
 * Implements Choice-Based Credit System (CBCS), Multidisciplinary Education,
 * and Flexible Learning Paths
 */

// Enhanced types for NEP 2020 compliance

export interface CBCSCourse {
  id: string
  code: string
  name: string
  departmentId: string
  credits: number
  semester: number
  year: number
  type: CBCSCourseType
  category: CBCSCourseCategory
  description?: string
  prerequisites?: string[]
  corequisites?: string[]
  maxStudents?: number
  learningOutcomes: string[]
  assessmentMethods: AssessmentMethod[]
  skillsAcquired: string[]
  industryRelevance: string[]
  interdisciplinaryTopics?: string[]
  isMultidisciplinary: boolean
  offeredByDepartments?: string[] // For multidisciplinary courses
  createdAt: Date
  updatedAt: Date
}

export interface FlexibleLearningPath {
  id: string
  studentId: string
  name: string
  description: string
  targetDegree: string
  primaryDiscipline: string
  secondaryDisciplines: string[]
  minorSpecializations: string[]
  totalCreditsRequired: number
  completedCredits: number
  plannedCourses: PlannedCourse[]
  flexibilityOptions: FlexibilityOption[]
  createdAt: Date
  updatedAt: Date
}

export interface PlannedCourse {
  courseId: string
  semester: number
  year: number
  isElected: boolean
  alternativeCourses?: string[]
  registrationPriority: number
}

export interface FlexibilityOption {
  type: FlexibilityType
  description: string
  courses: string[]
  creditRequirement: number
  isCompleted: boolean
}

export interface MultidisciplinaryProgram {
  id: string
  name: string
  description: string
  participatingDepartments: string[]
  coordinatingDepartment: string
  degreeType: DegreeType
  totalCredits: number
  coreCourses: string[]
  electivePools: ElectivePool[]
  internshipRequirement?: InternshipRequirement
  projectRequirement?: ProjectRequirement
  createdAt: Date
  updatedAt: Date
}

export interface ElectivePool {
  id: string
  name: string
  description: string
  minCredits: number
  maxCredits: number
  availableCourses: string[]
  crossDisciplinary: boolean
  departments: string[]
}

export interface InternshipRequirement {
  minDuration: number // in weeks
  creditValue: number
  approvedOrganizations?: string[]
  learningObjectives: string[]
}

export interface ProjectRequirement {
  type: ProjectType
  minDuration: number // in weeks
  creditValue: number
  supervisionRequirements: string[]
  deliverables: string[]
}

export interface AssessmentMethod {
  type: AssessmentType
  weightage: number
  description: string
  schedule?: AssessmentSchedule[]
}

export interface AssessmentSchedule {
  week: number
  description: string
  maxMarks: number
}

export interface Student {
  id: string
  enrollmentNumber: string
  name: string
  email: string
  program: string
  admissionYear: number
  currentSemester: number
  primaryDiscipline: string
  minorDisciplines: string[]
  learningPath?: string
  totalCredits: number
  cgpa: number
  preferences: StudentPreference[]
  createdAt: Date
  updatedAt: Date
}

export interface StudentPreference {
  category: PreferenceCategory
  value: string
  priority: number
  semester?: number
}

export interface NEPSchedulingConstraint {
  id: string
  name: string
  type: 'hard' | 'soft'
  category: NEPConstraintCategory
  priority: number
  description: string
  parameters: NEPConstraintParameters
  applicablePrograms: string[]
  isActive: boolean
}

export interface NEPConstraintParameters {
  multidisciplinaryBalance?: boolean
  flexibilityQuota?: number
  internshipScheduling?: boolean
  projectTimeAllocation?: number
  crossDepartmentalCoordination?: boolean
  studentChoiceWeightage?: number
}

// Enums
export enum CBCSCourseType {
  FOUNDATION = 'foundation',
  CORE = 'core',
  ELECTIVE = 'elective',
  PROJECT = 'project',
  INTERNSHIP = 'internship',
  RESEARCH = 'research',
  SKILL_ENHANCEMENT = 'skill_enhancement',
  VALUE_ADDED = 'value_added'
}

export enum CBCSCourseCategory {
  MAJOR = 'major',
  MINOR = 'minor',
  FOUNDATION = 'foundation',
  MULTIDISCIPLINARY = 'multidisciplinary',
  SKILL_BASED = 'skill_based',
  VALUE_EDUCATION = 'value_education',
  LANGUAGE = 'language',
  ENVIRONMENTAL = 'environmental'
}

export enum AssessmentType {
  CONTINUOUS = 'continuous',
  MID_SEMESTER = 'mid_semester',
  END_SEMESTER = 'end_semester',
  PROJECT = 'project',
  PRACTICAL = 'practical',
  PRESENTATION = 'presentation',
  ASSIGNMENT = 'assignment',
  QUIZ = 'quiz'
}

export enum FlexibilityType {
  COURSE_SUBSTITUTION = 'course_substitution',
  CREDIT_TRANSFER = 'credit_transfer',
  INTERDISCIPLINARY_MINOR = 'interdisciplinary_minor',
  SKILL_CERTIFICATION = 'skill_certification',
  INDUSTRY_INTERNSHIP = 'industry_internship',
  RESEARCH_PROJECT = 'research_project'
}

export enum DegreeType {
  UNDERGRADUATE = 'undergraduate',
  POSTGRADUATE = 'postgraduate',
  DIPLOMA = 'diploma',
  CERTIFICATE = 'certificate',
  INTEGRATED = 'integrated'
}

export enum ProjectType {
  CAPSTONE = 'capstone',
  RESEARCH = 'research',
  INDUSTRY_SPONSORED = 'industry_sponsored',
  SOCIAL_IMPACT = 'social_impact',
  ENTREPRENEURSHIP = 'entrepreneurship'
}

export enum PreferenceCategory {
  TIME_SLOT = 'time_slot',
  INSTRUCTOR = 'instructor',
  COURSE_TYPE = 'course_type',
  LEARNING_MODE = 'learning_mode',
  DISCIPLINE_FOCUS = 'discipline_focus'
}

export enum NEPConstraintCategory {
  MULTIDISCIPLINARY = 'multidisciplinary',
  FLEXIBILITY = 'flexibility',
  CHOICE_BASED = 'choice_based',
  HOLISTIC = 'holistic',
  SKILL_DEVELOPMENT = 'skill_development',
  VALUE_EDUCATION = 'value_education'
}