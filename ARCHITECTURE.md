# AutoApply AI - System Architecture

## Overview

AutoApply AI is a fully automated job application system that uses AI to find, match, and apply to jobs on behalf of users. The system operates in two modes: a web application for manual control and monitoring, and a Chrome extension for automated form filling and submission.

## System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INPUT (One Time)                     │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐     │
│  │   Resume    │  │  Job Role    │  │  Preferences  │     │
│  │  (PDF/Text) │  │  (Engineer)  │  │  (Remote, $)  │     │
│  └─────────────┘  └──────────────┘  └───────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │    RESUME PARSER (AI)          │
         │  Extract structured data       │
         │  - Personal info               │
         │  - Experience                  │
         │  - Skills                      │
         │  - Education                   │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │   JOB DISCOVERY ENGINE         │
         │  Multi-source aggregation      │
         │  - LinkedIn (API)              │
         │  - Indeed (Scraping)           │
         │  - RemoteOK (API)              │
         │  - Arbeitnow (API)             │
         │  - The Muse (API)              │
         │  - 5+ more sources             │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │   AI MATCHING ENGINE           │
         │  Score each job (0-100)        │
         │  - Skill overlap               │
         │  - Experience match            │
         │  - Location fit                │
         │  - Salary alignment            │
         │  Output: Jobs >70% match       │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │   CONTENT GENERATOR (AI)       │
         │  For each qualified job:       │
         │  - Tailored cover letter       │
         │  - Answer common questions     │
         │  - Company research            │
         │  - Keywords to add             │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │   APPLICATION QUEUE            │
         │  Prioritize and schedule       │
         │  - High match first            │
         │  - Easy Apply priority         │
         │  - Rate limiting (20/day)      │
         │  - Business hours only         │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │   FORM AUTOMATION              │
         │  Detect and fill forms         │
         │  - LinkedIn Easy Apply         │
         │  - Indeed Easy Apply           │
         │  - Generic forms               │
         │  - Upload resume               │
         │  - Paste cover letter          │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │   SUBMISSION                   │
         │  Submit application            │
         │  - Anti-detection delays       │
         │  - Human-like behavior         │
         │  - Error handling              │
         │  - Retry logic                 │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │   TRACKING & MONITORING        │
         │  Post-application              │
         │  - Log submission              │
         │  - Monitor email for replies   │
         │  - Update status               │
         │  - Send notifications          │
         │  - Analytics                   │
         └───────────────────────────────┘
```

## Core Components

### 1. Resume Parser
**Technology:** AI (Gemini/GPT-4)  
**Input:** Raw resume text (PDF extracted or pasted)  
**Output:** Structured JSON

```typescript
interface ParsedResume {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
}
```

### 2. Job Discovery Engine
**Technology:** API clients + Web scraping  
**Frequency:** Continuous (every 6 hours)  
**Sources:**
- **API-based:** RemoteOK, Arbeitnow, The Muse (direct JSON)
- **Scraping:** LinkedIn, Indeed, ZipRecruiter (requires proxy)
- **Rate limits:** Respect per-source limits

**Deduplication:** Hash by (title + company + location)

### 3. AI Matching Engine
**Technology:** Gemini (free tier)  
**Algorithm:**
```
Score = (
  skill_overlap * 0.40 +
  experience_match * 0.30 +
  education_fit * 0.15 +
  location_match * 0.10 +
  other_factors * 0.05
) * 100
```

**Threshold:** Only process jobs with score ≥ 70%

### 4. Content Generator
**Technology:** AI with specialized prompts  
**Outputs:**
- **Cover Letter:** 250-300 words, company-specific
- **Question Answers:** 50-100 words each
- **Resume Keywords:** 5-10 missing keywords to add

**Caching:** Store generated content to avoid regeneration

### 5. Application Queue
**Technology:** In-memory queue + IndexedDB persistence  
**Logic:**
```typescript
interface QueueItem {
  job: Job;
  priority: number; // calculated
  scheduledTime: Date;
  attempts: number;
}

// Priority calculation
priority = (
  job.score * 0.50 +
  (hasEasyApply ? 30 : 0) +
  (isRecent ? 20 : 0)
)
```

**Rate Limiting:**
- Max 20 applications/day
- Max 3 applications/hour
- Only during business hours (9am-5pm local)
- Random delays: 5-15 minutes between apps

### 6. Form Automation
**Technology:** Chrome Extension (Content Scripts)  

**Detection Strategy:**
```javascript
// Detect form type
if (url.includes('linkedin.com/jobs/apply')) {
  return 'linkedin-easy-apply';
} else if (url.includes('indeed.com/apply')) {
  return 'indeed-easy-apply';
} else {
  return detectGenericForm();
}
```

**Field Mapping:**
```javascript
const fieldMap = {
  firstName: findField(['first_name', 'fname', 'given_name']),
  email: findField(['email', 'e-mail', 'contact_email']),
  // ... 100+ mappings
};
```

**Fill Algorithm:**
1. Detect all input fields
2. Classify each field (text, email, select, file, etc.)
3. Map to resume data
4. Fill with human-like typing (100-300ms per char)
5. Validate before submit
6. Screenshot for records

### 7. Anti-Detection System

**Human-like Behavior:**
- Random mouse movements
- Occasional "mistakes" + corrections
- Variable typing speed (50-200 WPM)
- Scroll behavior
- Read time simulation (2-5 sec per section)

**Network:**
- Rotate user agents
- Respect robots.txt
- Random delays between requests
- Session cookies management

**Application Pattern:**
- Never apply to >5 jobs at same company/week
- Vary application times (not always 9am)
- Skip some days randomly
- Different cover letter variations

## Data Flow

### User Setup (One-time)
```
User uploads resume
  → AI parses into structured data
  → Store in IndexedDB
  → User sets preferences
  → System activated
```

### Automated Job Discovery
```
Cron job (every 6 hours)
  → Fetch from all sources (parallel)
  → Deduplicate jobs
  → Store in local DB
  → Notify user of new matches
```

### Application Process
```
Job enters queue
  → Wait for scheduled time
  → Open job page in new tab
  → Detect form type
  → Fill form fields
  → Upload resume
  → Paste cover letter
  → [Optional] User reviews
  → Submit
  → Log application
  → Close tab
  → Wait (random delay)
  → Next job
```

### Response Monitoring
```
Email monitoring (optional)
  → Classify email type
    - Rejection → Update status
    - Interview → Alert user + update
    - Request info → Alert user
  → Store in timeline
  → Push notification
```

## Technology Stack

### Frontend (Web App)
- **React 18** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Server state
- **IndexedDB (idb)** - Local storage

### Backend (Serverless)
- **Vercel Functions** - API endpoints
- **Node.js** - Runtime
- **BullMQ + Redis** - Job queue
- **Cheerio** - HTML parsing

### Chrome Extension
- **Manifest V3** - Latest standard
- **Content Scripts** - Form automation
- **Background Service Worker** - Queue management
- **Storage API** - Settings sync

### AI Services
- **Google Gemini** - Primary (free tier)
- **OpenAI GPT-4** - Fallback
- **Anthropic Claude** - Alternative

### Database (Optional)
- **Supabase** - PostgreSQL + Auth + Storage
- **Alternative:** IndexedDB only (local-first)

## Security & Privacy

### Data Storage
- Resume data: **Local only** (IndexedDB)
- API keys: **Encrypted** in browser storage
- Application history: **Local first**, optional cloud sync
- Logs: **Anonymized**, no PII in analytics

### API Key Management
```typescript
// Never expose keys in client code
const ENCRYPTION_KEY = await generateKey();
const encryptedKey = await encrypt(apiKey, ENCRYPTION_KEY);
localStorage.setItem('ai_key', encryptedKey);
```

### GDPR Compliance
- User can export all data (JSON)
- User can delete all data
- No tracking without consent
- Clear privacy policy

## Performance Optimizations

### Caching Strategy
- Job listings: 6 hours
- AI responses: 24 hours
- Form mappings: 7 days
- Company data: 30 days

### Lazy Loading
- Load extension scripts only on job sites
- Fetch AI responses on-demand
- Paginate job lists (virtual scrolling)

### Bundle Size
- Code splitting by route
- Tree-shaking unused code
- Lazy load heavy dependencies
- Target: <500KB initial load

## Error Handling

### Graceful Degradation
```typescript
try {
  result = await applyToJob(job);
} catch (error) {
  if (isRecoverable(error)) {
    // Retry with exponential backoff
    await retry(applyToJob, job, { maxAttempts: 3 });
  } else {
    // Log error, skip job, notify user
    logError(error);
    skipJob(job);
    notifyUser(`Failed to apply to ${job.company}`);
  }
}
```

### Monitoring
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- User feedback loop
- Crash reports

## Deployment

### Web App
```bash
npm run build
vercel deploy --prod
```

### Chrome Extension
```bash
npm run build:extension
# Upload to Chrome Web Store
```

### CI/CD
- GitHub Actions
- Auto-deploy on merge to main
- Run tests before deploy
- Semantic versioning

## Scalability

### Current Capacity
- Users: 10,000 concurrent
- Applications: 200,000/day
- AI requests: Within free tiers

### Bottlenecks
1. **AI rate limits** - Solution: Multiple API keys, fallbacks
2. **Job source rate limits** - Solution: Caching, CDN
3. **Browser automation detection** - Solution: Anti-detection measures

### Future Scaling
- Multi-region deployment
- CDN for static assets
- Database read replicas
- Queue workers (horizontal scaling)

## Monitoring & Analytics

### User Metrics
- Applications submitted
- Response rate
- Interview rate
- Time saved

### System Metrics
- API success rate
- Form detection accuracy
- Submission success rate
- Error rates

### Business Metrics
- User retention
- Feature usage
- Conversion funnel
- Support tickets

## Future Enhancements

### Phase 2
- Mobile app (React Native)
- Email integration (Gmail API)
- Calendar integration (interview scheduling)
- Multiple resume support

### Phase 3
- Resume optimization suggestions
- Interview prep (AI-generated questions)
- Salary negotiation assistant
- Referral network

### Phase 4
- Team collaboration
- Career path recommendations
- Skill gap analysis
- Job market insights
