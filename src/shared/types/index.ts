// Core types for the Auto-Apply AI system

export interface Resume {
  id: string;
  fileName: string;
  rawText: string;
  parsed: ParsedResume;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedResume {
  personal: PersonalInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages?: Language[];
  projects?: Project[];
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface Experience {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Language {
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Basic';
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

// Job-related types
export interface Job {
  id: string;
  source: JobSource;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  tags: string[];
  url: string;
  applyUrl?: string;
  postedAt: Date;
  expiresAt?: Date;
  jobType: JobType;
  workArrangement: WorkArrangement;
  experienceLevel: ExperienceLevel;
  hasEasyApply: boolean;
  easyApplyPlatform?: 'linkedin' | 'indeed' | 'ziprecruiter';
  metadata: JobMetadata;
  score?: number;
  analysis?: JobAnalysis;
  state: JobState;
}

export type JobSource =
  | 'LinkedIn'
  | 'Indeed'
  | 'ZipRecruiter'
  | 'RemoteOK'
  | 'Arbeitnow'
  | 'TheMuse'
  | 'WeWorkRemotely'
  | 'AngelList'
  | 'Glassdoor'
  | 'Monster';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
export type WorkArrangement = 'remote' | 'hybrid' | 'onsite';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type JobState = 'new' | 'scored' | 'queued' | 'applying' | 'applied' | 'skipped' | 'error';

export interface JobMetadata {
  remote: boolean;
  visa_sponsorship?: boolean;
  company_size?: string;
  industry?: string;
  benefits?: string[];
  [key: string]: any;
}

export interface JobAnalysis {
  score: number; // 0-100
  strengths: string[];
  gaps: string[];
  recommendation: string;
  keywordMatches: string[];
  missingKeywords: string[];
  estimatedFit: 'excellent' | 'good' | 'fair' | 'poor';
}

// Application types
export interface Application {
  id: string;
  jobId: string;
  job: Job;
  resume: Resume;
  status: ApplicationStatus;
  appliedAt: Date;
  lastUpdated: Date;
  materials: ApplicationMaterials;
  timeline: ApplicationEvent[];
  notes?: string;
  interviewDate?: Date;
  offerDetails?: OfferDetails;
}

export type ApplicationStatus =
  | 'Package Ready'
  | 'Queued'
  | 'Applying'
  | 'Applied'
  | 'Viewed'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn'
  | 'Accepted';

export interface ApplicationMaterials {
  coverLetter: string;
  customAnswers: Record<string, string>;
  resumeVersion?: string;
  additionalDocuments?: Document[];
}

export interface ApplicationEvent {
  type: 'created' | 'applied' | 'viewed' | 'contacted' | 'interview_scheduled' | 'interview_completed' | 'offer' | 'rejected';
  timestamp: Date;
  details?: string;
  automated: boolean;
}

export interface OfferDetails {
  salary: number;
  equity?: string;
  bonus?: string;
  benefits: string[];
  startDate?: Date;
  deadline?: Date;
}

export interface Document {
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

// Automation types
export interface AutomationConfig {
  enabled: boolean;
  dailyLimit: number;
  hourlyLimit: number;
  minMatchScore: number;
  reviewBeforeSubmit: boolean;
  optimalHours: [number, number]; // [start, end] in 24h format
  sources: Partial<Record<JobSource, SourceConfig>>;
  preferences: JobPreferences;
  antiDetection: AntiDetectionConfig;
}

export interface SourceConfig {
  enabled: boolean;
  priority: number; // 1-10, higher = more priority
  maxPerDay?: number;
}

export interface JobPreferences {
  roles: string[];
  locations: string[];
  salaryMin?: number;
  salaryMax?: number;
  jobTypes: JobType[];
  workArrangements: WorkArrangement[];
  experienceLevels: ExperienceLevel[];
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  companyTypes?: string[];
  companySizes?: string[];
  industries?: string[];
  excludeCompanies?: string[];
}

export interface AntiDetectionConfig {
  randomDelays: boolean;
  minDelay: number; // seconds
  maxDelay: number; // seconds
  humanLikeBehavior: boolean;
  rotateUserAgent: boolean;
  respectRobotsTxt: boolean;
}

// Form automation types
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  value?: any;
  options?: string[];
}

export interface DetectedForm {
  platform: string;
  formType: 'easy-apply' | 'standard' | 'custom';
  fields: FormField[];
  submitButton?: string;
  complexity: number; // 1-10
  confidence: number; // 0-1
}

export interface FormFillResult {
  success: boolean;
  filledFields: number;
  totalFields: number;
  errors: FormError[];
  timestamp: Date;
}

export interface FormError {
  field: string;
  error: string;
  critical: boolean;
}

// AI Service types
export interface AIProvider {
  name: 'gemini' | 'openai' | 'anthropic';
  apiKey: string;
  model: string;
  available: boolean;
}

export interface AIRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  context?: string;
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: string;
  model: string;
}

// Analytics types
export interface Analytics {
  totalApplications: number;
  applicationsToday: number;
  applicationsThisWeek: number;
  applicationsThisMonth: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  averageMatchScore: number;
  topSources: Array<{ source: JobSource; count: number }>;
  topCompanies: Array<{ company: string; count: number }>;
  statusDistribution: Partial<Record<ApplicationStatus, number>>;
  timeToResponse: number; // days
  bestApplicationTimes: Array<{ hour: number; successRate: number }>;
}

// Settings and state
export interface AppState {
  resume: Resume | null;
  jobs: Job[];
  applications: Application[];
  config: AutomationConfig;
  analytics: Analytics;
  isRunning: boolean;
  lastSync: Date | null;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  advanced: AdvancedSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
  onInterview: boolean;
  onOffer: boolean;
  onRejection: boolean;
  dailySummary: boolean;
}

export interface PrivacySettings {
  saveDataLocally: boolean;
  syncToCloud: boolean;
  anonymizeData: boolean;
  shareAnalytics: boolean;
}

export interface AdvancedSettings {
  debug: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  apiTimeout: number;
  retryAttempts: number;
  cacheEnabled: boolean;
  cacheDuration: number; // hours
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  timestamp: Date;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

// Queue types
export interface JobQueue {
  id: string;
  jobs: QueuedJob[];
  processing: boolean;
  currentIndex: number;
  completedToday: number;
  errors: QueueError[];
}

export interface QueuedJob {
  job: Job;
  priority: number;
  addedAt: Date;
  scheduledFor?: Date;
  attempts: number;
  maxAttempts: number;
}

export interface QueueError {
  jobId: string;
  error: string;
  timestamp: Date;
  recoverable: boolean;
}
