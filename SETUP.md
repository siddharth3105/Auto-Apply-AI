# Setup Guide - AutoApply AI

## Prerequisites

- Node.js 18+ and npm
- A modern browser (Chrome recommended for extension)
- Free Gemini API key (get at aistudio.google.com)

## Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/siddharth3105/Auto-Apply-AI.git
cd Auto-Apply-AI

# Install dependencies
npm install
```

### 2. Get Free Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the key (starts with `AIzaSy...`)

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your key
# VITE_GEMINI_API_KEY=your_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173

## Usage Guide

### Step 1: Upload Your Resume

1. Go to **Setup** page
2. Either:
   - **Paste** your resume text directly, OR
   - **Upload** a PDF/DOCX file
3. System will automatically parse and extract:
   - Personal information
   - Work experience
   - Education
   - Skills
   - Certifications

### Step 2: Configure Preferences

Set your job search criteria:

- **Target Role:** e.g., "Software Engineer", "Data Analyst"
- **Location:** e.g., "Remote", "New York", "London"
- **Salary Range:** Min and max expected salary
- **Job Type:** Full-time, Contract, etc.
- **Work Arrangement:** Remote, Hybrid, Onsite
- **Minimum Match Score:** Only apply to jobs above this % (default 70%)

### Step 3: Start the Agent

Click **"Start Agent"** button

The system will now:

1. ✅ Search 8+ job boards automatically
2. ✅ Score each job against your resume using AI
3. ✅ Generate tailored cover letters for high matches
4. ✅ Create application packages
5. ✅ (Optional) Auto-apply to Easy Apply jobs

### Step 4: Review & Apply

**Dashboard** shows:
- Total jobs found
- Applications ready
- Interviews scheduled
- Success metrics

**Job Matches** page:
- View all discovered jobs
- See AI match scores
- Filter by score/source
- Generate application packages

**Applications** page:
- Track all submissions
- Update status as you hear back
- View interview dates
- Export to Excel

## Chrome Extension Setup (For Full Automation)

### Build the Extension

```bash
npm run build:extension
```

### Install in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `dist-extension` folder
5. Extension icon appears in toolbar

### Configure Extension

1. Click extension icon
2. Go to **Options**
3. Upload your resume
4. Set preferences
5. Enter Gemini API key
6. Click **"Activate Auto-Apply"**

### How It Works

When you browse job sites (LinkedIn, Indeed, etc.):

1. Extension detects job application pages
2. Shows **"Auto Apply"** button on the page
3. Click button → form fills automatically
4. Review (if enabled) → Submit
5. Application logged in tracker

**Batch Mode:**
- Extension popup → "Apply to Queue"
- Applies to all queued jobs automatically
- Runs in background (you can do other things)
- Respects rate limits (max 20/day)

## Configuration Options

### Automation Settings

Edit `src/shared/config.ts`:

```typescript
export const DEFAULT_CONFIG = {
  // Rate limiting
  dailyLimit: 20,        // Max applications per day
  hourlyLimit: 3,        // Max per hour
  minMatchScore: 70,     // Minimum AI match %
  
  // Behavior
  reviewBeforeSubmit: false,  // Auto-submit without review
  optimalHours: [9, 17],      // Apply 9am-5pm only
  
  // Anti-detection
  randomDelays: true,    // Random waits between actions
  minDelay: 5,          // Minimum seconds
  maxDelay: 15,         // Maximum seconds
};
```

### Job Sources Priority

```typescript
sources: {
  LinkedIn: { enabled: true, priority: 10 },  // Highest
  Indeed: { enabled: true, priority: 10 },
  RemoteOK: { enabled: true, priority: 7 },
  // ... more
}
```

### AI Provider Configuration

```typescript
// Use OpenAI instead of Gemini
const aiService = new OpenAIService(OPENAI_API_KEY);

// Or Anthropic Claude
const aiService = new ClaudeService(ANTHROPIC_API_KEY);
```

## Troubleshooting

### "No API key" Error

**Solution:** Make sure `.env` file exists with:
```
VITE_GEMINI_API_KEY=AIzaSy...your_actual_key
```

### Jobs Not Loading

**Causes:**
- CORS proxy issues
- Rate limiting
- Network problems

**Solutions:**
1. Check browser console for errors
2. Try different CORS proxy (edit in `jobFetcher.ts`)
3. Wait a few minutes and retry

### Extension Not Working

**Checklist:**
1. Extension loaded in `chrome://extensions/`?
2. Developer mode enabled?
3. Extension icon visible in toolbar?
4. Clicked "Activate Auto-Apply" in options?

**Reset Extension:**
```bash
# Rebuild
npm run build:extension

# In Chrome:
# Remove extension → Reload unpacked
```

### AI Scoring Errors

**Rate Limit Hit:**
- Gemini free tier: 15 requests/min, 1500/day
- Wait 60 seconds and retry
- Consider adding OpenAI as fallback

**Invalid Response:**
- AI returns non-JSON sometimes
- System will retry automatically
- Check error logs in console

### Form Not Auto-Filling

**Possible Reasons:**
1. Form structure not recognized
2. Site blocks automation
3. Field names changed

**Debug:**
```javascript
// Enable debug mode in extension
chrome.storage.local.set({ debug: true });

// Check console logs on job page
```

## Best Practices

### Resume Quality
- ✅ Use keywords from target jobs
- ✅ Quantify achievements (numbers, %)
- ✅ Keep formatting simple (for parsing)
- ✅ Update regularly

### Application Strategy
- ✅ Start with 70% match threshold
- ✅ Review a few applications manually first
- ✅ Adjust preferences based on results
- ✅ Don't apply to >5 jobs at same company

### Privacy & Safety
- ✅ Review cover letters before enabling auto-submit
- ✅ Use unique email for job search
- ✅ Export data regularly (backup)
- ✅ Don't share API keys

### Success Tips
- ✅ Focus on quality matches (>75%)
- ✅ Customize resume for each role type
- ✅ Follow up on applications after 1 week
- ✅ Track your metrics to optimize

## Advanced Setup

### Self-Host Backend

```bash
# Deploy to your own server
npm run build
# Upload to your VPS/cloud

# Set environment variables
export GEMINI_API_KEY=your_key
export DATABASE_URL=postgresql://...
```

### Database Setup (Optional)

```bash
# Using Supabase
# 1. Create project at supabase.com
# 2. Get connection details
# 3. Add to .env:

VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Email Monitoring

```bash
# Gmail API setup
# 1. Enable Gmail API in Google Console
# 2. Get credentials
# 3. Add to .env:

VITE_GMAIL_CLIENT_ID=xxx
VITE_GMAIL_CLIENT_SECRET=xxx
```

## Getting Help

- **Documentation:** See other .md files in repo
- **Issues:** https://github.com/siddharth3105/Auto-Apply-AI/issues
- **Discussions:** https://github.com/siddharth3105/Auto-Apply-AI/discussions

## Next Steps

1. ✅ Complete setup above
2. ✅ Upload your resume
3. ✅ Start with 5-10 test applications
4. ✅ Review results and adjust
5. ✅ Enable full automation
6. ✅ Track your success!

Good luck with your job search! 🚀
