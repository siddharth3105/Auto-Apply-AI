import type { AIRequest, AIResponse, JobAnalysis, Job, ParsedResume } from '../types';
import { AI_CONFIG } from '../config';

export class GeminiService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.model = AI_CONFIG.gemini.model;
    this.baseUrl = `${AI_CONFIG.gemini.endpoint}/${this.model}:generateContent`;
  }

  async generateContent(request: AIRequest): Promise<AIResponse> {
    const url = `${this.baseUrl}?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: request.prompt }] }],
        generationConfig: {
          maxOutputTokens: request.maxTokens || AI_CONFIG.gemini.maxTokens,
          temperature: request.temperature || AI_CONFIG.gemini.temperature,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || `Gemini API error: ${response.status}`
      );
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    
    return {
      content,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
      provider: 'gemini',
      model: this.model,
    };
  }

  async scoreJob(job: Job, resume: ParsedResume): Promise<JobAnalysis> {
    const prompt = `You are an expert ATS recruiter. Score how well this resume matches this job.

RESUME:
Name: ${resume.personal.name}
Skills: ${resume.skills.join(', ')}
Experience: ${resume.experience.map(e => `${e.title} at ${e.company} (${e.startDate} - ${e.endDate})`).join('; ')}
Education: ${resume.education.map(e => `${e.degree} in ${e.field} from ${e.institution}`).join('; ')}

JOB:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Description: ${job.description.slice(0, 1000)}
Requirements: ${job.requirements.join(', ')}
Skills: ${job.tags.join(', ')}

Return ONLY valid JSON, no markdown, no explanation:
{
  "score": <integer 30-97, be realistic>,
  "strengths": ["specific matching point 1", "specific matching point 2", "specific matching point 3"],
  "gaps": ["gap 1", "gap 2"],
  "recommendation": "one honest sentence about fit",
  "keywordMatches": ["matched keyword 1", "matched keyword 2"],
  "missingKeywords": ["missing keyword 1", "missing keyword 2"],
  "estimatedFit": "excellent|good|fair|poor"
}`;

    const response = await this.generateContent({ prompt, maxTokens: 600 });
    return this.parseJSON(response.content);
  }

  async generateCoverLetter(
    job: Job,
    resume: ParsedResume,
    analysis: JobAnalysis
  ): Promise<string> {
    const prompt = `Create a professional cover letter for this job application.

CANDIDATE:
Name: ${resume.personal.name}
Current/Recent Role: ${resume.experience[0]?.title} at ${resume.experience[0]?.company}
Key Skills: ${resume.skills.slice(0, 10).join(', ')}
Top Achievements: ${resume.experience[0]?.achievements?.slice(0, 2).join('; ')}

JOB:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Description: ${job.description.slice(0, 800)}

MATCH ANALYSIS:
Score: ${analysis.score}%
Strengths: ${analysis.strengths.join('; ')}

REQUIREMENTS:
1. 3 paragraphs, 250-300 words total
2. Professional and warm tone
3. DO NOT start with "I am writing to express my interest"
4. Reference specific details from ${job.company} and this exact role
5. Connect real experience from resume to job requirements
6. Mention 2-3 key achievements with numbers/results
7. End with confident call to action
8. Use first person, active voice

Return ONLY the cover letter text, no JSON, no markdown formatting:`;

    const response = await this.generateContent({ prompt, maxTokens: 800 });
    return response.content.trim();
  }

  async generateAnswers(
    job: Job,
    resume: ParsedResume,
    questions: string[]
  ): Promise<Record<string, string>> {
    const prompt = `Answer these application questions for the candidate.

CANDIDATE:
Name: ${resume.personal.name}
Summary: ${resume.summary || 'Experienced professional'}
Experience: ${resume.experience.slice(0, 2).map(e => `${e.title} at ${e.company}: ${e.description}`).join('\n')}

JOB:
${job.title} at ${job.company}

QUESTIONS:
${questions.map((q, i) => `${i + 1}. ${q.replace('{company}', job.company)}`).join('\n')}

REQUIREMENTS:
- Each answer 50-100 words
- Specific examples with numbers/results
- Connect to job requirements
- Professional and authentic tone

Return ONLY valid JSON:
{
  "answer1": "response to question 1",
  "answer2": "response to question 2",
  ...
}`;

    const response = await this.generateContent({ prompt, maxTokens: 1500 });
    return this.parseJSON(response.content);
  }

  async extractResumeData(resumeText: string): Promise<ParsedResume> {
    const prompt = `Extract structured data from this resume. Be thorough and accurate.

RESUME TEXT:
${resumeText}

Return ONLY valid JSON with this exact structure:
{
  "personal": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, State/Country",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "website.com"
  },
  "summary": "Professional summary paragraph",
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, State",
      "startDate": "2020-01",
      "endDate": "2023-12 or Present",
      "description": "Role description",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "endDate": "2020-05",
      "gpa": "3.8"
    }
  ],
  "skills": ["Skill1", "Skill2", "Skill3"],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "2023-01"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "What it does",
      "technologies": ["Tech1", "Tech2"],
      "url": "github.com/project"
    }
  ]
}`;

    const response = await this.generateContent({ prompt, maxTokens: 2048 });
    return this.parseJSON(response.content);
  }

  private parseJSON(jsonString: string): any {
    // Remove markdown code blocks if present
    let cleaned = jsonString
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```\s*$/m, '')
      .trim();
    
    // Try to find JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Failed to parse AI response as JSON: ${error}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.generateContent({
        prompt: 'Reply with just "OK"',
        maxTokens: 10,
      });
      return response.content.includes('OK');
    } catch {
      return false;
    }
  }
}
