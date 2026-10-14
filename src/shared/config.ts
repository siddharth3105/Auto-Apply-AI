import type { AutomationConfig } from './types';

export const DEFAULT_CONFIG: AutomationConfig = {
  enabled: false,
  dailyLimit: 20,
  hourlyLimit: 3,
  minMatchScore: 70,
  reviewBeforeSubmit: false,
  optimalHours: [9, 17], // 9 AM to 5 PM
  
  sources: {
    LinkedIn: { enabled: true, priority: 10, maxPerDay: 10 },
    Indeed: { enabled: true, priority: 10, maxPerDay: 10 },
    ZipRecruiter: { enabled: true, priority: 8 },
    RemoteOK: { enabled: true, priority: 7 },
    Arbeitnow: { enabled: true, priority: 7 },
    TheMuse: { enabled: true, priority: 6 },
    WeWorkRemotely: { enabled: true, priority: 6 },
    AngelList: { enabled: true, priority: 5 },
  },
  
  preferences: {
    roles: [],
    locations: ['Remote'],
    jobTypes: ['full-time', 'contract'],
    workArrangements: ['remote', 'hybrid'],
    experienceLevels: ['mid', 'senior'],
    mustHaveSkills: [],
    niceToHaveSkills: [],
  },
  
  antiDetection: {
    randomDelays: true,
    minDelay: 5, // seconds
    maxDelay: 15, // seconds
    humanLikeBehavior: true,
    rotateUserAgent: false,
    respectRobotsTxt: true,
  },
};

export const AI_CONFIG = {
  gemini: {
    model: 'gemini-1.5-flash',
    maxTokens: 2048,
    temperature: 0.7,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
  openai: {
    model: 'gpt-4-turbo-preview',
    maxTokens: 4096,
    temperature: 0.7,
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
  anthropic: {
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4096,
    temperature: 0.7,
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
};

export const JOB_SOURCES = {
  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs',
    hasEasyApply: true,
    searchParams: 'f_AL=true', // Easy Apply filter
  },
  indeed: {
    name: 'Indeed',
    url: 'https://www.indeed.com/jobs',
    hasEasyApply: true,
    searchParams: 'iafilter=1', // Easy Apply filter
  },
  ziprecruiter: {
    name: 'ZipRecruiter',
    url: 'https://www.ziprecruiter.com/jobs',
    hasEasyApply: true,
  },
  remoteok: {
    name: 'RemoteOK',
    url: 'https://remoteok.com/api',
    apiAvailable: true,
  },
  arbeitnow: {
    name: 'Arbeitnow',
    url: 'https://www.arbeitnow.com/api/job-board-api',
    apiAvailable: true,
  },
  themuse: {
    name: 'The Muse',
    url: 'https://www.themuse.com/api/public/jobs',
    apiAvailable: true,
  },
  weworkremotely: {
    name: 'We Work Remotely',
    url: 'https://weworkremotely.com/remote-jobs',
  },
  angellist: {
    name: 'AngelList',
    url: 'https://angel.co/jobs',
  },
};

export const FORM_FIELD_MAPPINGS = {
  // Personal info
  firstName: ['first_name', 'firstname', 'fname', 'given_name', 'forename'],
  lastName: ['last_name', 'lastname', 'lname', 'surname', 'family_name'],
  fullName: ['full_name', 'fullname', 'name', 'your_name', 'applicant_name'],
  email: ['email', 'email_address', 'e-mail', 'mail', 'contact_email'],
  phone: ['phone', 'phone_number', 'mobile', 'telephone', 'contact_number', 'cell'],
  location: ['location', 'city', 'address', 'current_location', 'where_located'],
  
  // Professional info
  currentCompany: ['current_company', 'employer', 'current_employer', 'company'],
  currentTitle: ['current_title', 'current_role', 'current_position', 'job_title'],
  yearsExperience: ['years_experience', 'experience', 'years_of_experience', 'total_experience'],
  
  // Job-specific
  expectedSalary: ['expected_salary', 'salary_expectation', 'desired_salary', 'salary_requirement'],
  startDate: ['start_date', 'available_from', 'availability', 'when_can_start'],
  visaSponsorship: ['visa', 'visa_sponsorship', 'require_visa', 'need_sponsorship'],
  authorized: ['authorized', 'work_authorization', 'authorized_to_work'],
  
  // Links
  linkedin: ['linkedin', 'linkedin_url', 'linkedin_profile', 'linkedin_link'],
  portfolio: ['portfolio', 'portfolio_url', 'website', 'personal_website'],
  github: ['github', 'github_url', 'github_profile', 'github_link'],
  
  // Documents
  resume: ['resume', 'cv', 'resume_upload', 'attach_resume'],
  coverLetter: ['cover_letter', 'coverletter', 'letter', 'cover'],
  
  // Questions (common)
  whyCompany: ['why_company', 'why_work_here', 'why_interested', 'why_us'],
  whyRole: ['why_role', 'why_position', 'why_this_job'],
  strength: ['strength', 'greatest_strength', 'your_strength', 'best_quality'],
  weakness: ['weakness', 'greatest_weakness', 'areas_improvement'],
  achievement: ['achievement', 'greatest_achievement', 'accomplishment'],
};

export const COMMON_QUESTIONS = [
  'Why do you want to work at {company}?',
  'Why are you interested in this role?',
  'What is your greatest strength?',
  'What is your greatest weakness?',
  'Tell us about a challenging project you worked on.',
  'Where do you see yourself in 5 years?',
  'Why should we hire you?',
  'Describe your ideal work environment.',
  'How do you handle stress and pressure?',
  'What motivates you?',
];

export const RATE_LIMITS = {
  gemini: {
    requestsPerMinute: 15,
    requestsPerDay: 1500,
  },
  openai: {
    requestsPerMinute: 60,
    requestsPerDay: 10000,
  },
  linkedin: {
    applicationsPerDay: 50, // LinkedIn limit
    requestsPerHour: 20,
  },
  indeed: {
    applicationsPerDay: 100, // Indeed limit
    requestsPerHour: 30,
  },
};
