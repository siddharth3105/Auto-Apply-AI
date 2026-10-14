import type { Job, JobSource } from '../types';

export class JobFetcher {
  private corsProxies = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  async fetchAllSources(keyword: string, location: string = 'Remote'): Promise<Job[]> {
    const results = await Promise.allSettled([
      this.fetchRemoteOK(keyword),
      this.fetchArbeitnow(keyword),
      this.fetchTheMuse(keyword),
    ]);

    const jobs: Job[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        jobs.push(...result.value);
      }
    }

    return this.deduplicateJobs(jobs);
  }

  private async fetchWithFallback(url: string): Promise<any> {
    // Try direct first
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(7000),
      });
      if (response.ok) return await response.json();
    } catch (e) {
      // Fall through to proxies
    }

    // Try CORS proxies
    for (const makeProxy of this.corsProxies) {
      try {
        const response = await fetch(makeProxy(url), {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(12000),
        });
        if (response.ok) {
          const text = await response.text();
          return JSON.parse(text);
        }
      } catch (e) {
        continue;
      }
    }

    throw new Error(`Failed to fetch: ${url}`);
  }

  async fetchRemoteOK(keyword: string): Promise<Job[]> {
    try {
      const data = await this.fetchWithFallback(
        `https://remoteok.com/api?tag=${encodeURIComponent(keyword)}`
      );

      const jobs = Array.isArray(data) ? data.slice(1) : []; // Skip first (legal notice)

      return jobs.slice(0, 30).map((j: any) => ({
        id: `rok_${j.id}`,
        source: 'RemoteOK' as JobSource,
        title: j.position || j.title || 'Unknown Role',
        company: j.company || 'Company',
        location: j.location || 'Remote',
        salary: this.formatSalary(j.salary_min, j.salary_max),
        description: this.stripHTML(j.description || ''),
        requirements: this.extractRequirements(j.description || ''),
        tags: (j.tags || []).slice(0, 10),
        url: j.url || `https://remoteok.com/l/${j.id}`,
        postedAt: j.date ? new Date(j.date * 1000) : new Date(),
        jobType: 'full-time' as const,
        workArrangement: 'remote' as const,
        experienceLevel: this.detectExperienceLevel(j.position || j.title || ''),
        hasEasyApply: false,
        metadata: {
          remote: true,
          company_size: j.company_size,
        },
        state: 'new' as const,
      }));
    } catch (error) {
      console.error('RemoteOK fetch error:', error);
      return [];
    }
  }

  async fetchArbeitnow(keyword: string): Promise<Job[]> {
    try {
      const data = await this.fetchWithFallback(
        `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(keyword)}`
      );

      const jobs = data?.data || [];

      return jobs.slice(0, 30).map((j: any) => ({
        id: `an_${j.slug}`,
        source: 'Arbeitnow' as JobSource,
        title: j.title || 'Unknown Role',
        company: j.company_name || 'Company',
        location: j.remote ? 'Remote' : j.location || 'On-site',
        salary: '',
        description: this.stripHTML(j.description || ''),
        requirements: this.extractRequirements(j.description || ''),
        tags: (j.tags || []).slice(0, 10),
        url: j.url || `https://www.arbeitnow.com/jobs/${j.slug}`,
        postedAt: j.created_at ? new Date(j.created_at * 1000) : new Date(),
        jobType: 'full-time' as const,
        workArrangement: j.remote ? ('remote' as const) : ('onsite' as const),
        experienceLevel: this.detectExperienceLevel(j.title || ''),
        hasEasyApply: false,
        metadata: {
          remote: j.remote || false,
        },
        state: 'new' as const,
      }));
    } catch (error) {
      console.error('Arbeitnow fetch error:', error);
      return [];
    }
  }

  async fetchTheMuse(keyword: string): Promise<Job[]> {
    try {
      const data = await this.fetchWithFallback(
        `https://www.themuse.com/api/public/jobs?category=${encodeURIComponent(keyword)}&page=1&descending=true`
      );

      const jobs = data?.results || [];

      return jobs.slice(0, 30).map((j: any) => ({
        id: `muse_${j.id}`,
        source: 'TheMuse' as JobSource,
        title: j.name || 'Unknown Role',
        company: j.company?.name || 'Company',
        location: (j.locations || []).map((l: any) => l.name).join(', ') || 'Various',
        salary: '',
        description: this.stripHTML(j.contents || ''),
        requirements: this.extractRequirements(j.contents || ''),
        tags: [
          ...(j.levels || []).map((l: any) => l.name),
          ...(j.categories || []).map((c: any) => c.name),
        ].slice(0, 10),
        url: j.refs?.landing_page || 'https://www.themuse.com/jobs',
        postedAt: j.publication_date ? new Date(j.publication_date) : new Date(),
        jobType: 'full-time' as const,
        workArrangement: 'onsite' as const,
        experienceLevel: this.detectExperienceLevel(j.name || ''),
        hasEasyApply: false,
        metadata: {
          remote: false,
          company_size: j.company?.size,
        },
        state: 'new' as const,
      }));
    } catch (error) {
      console.error('TheMuse fetch error:', error);
      return [];
    }
  }

  private stripHTML(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private formatSalary(min?: number, max?: number): string {
    if (!min && !max) return '';
    const fmt = (n: number) =>
      n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
    if (min && max) return `${fmt(min)}–${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return `Up to ${fmt(max)}`;
  }

  private extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const lines = description.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.match(/^[-•*]\s/) ||
        trimmed.toLowerCase().includes('requirement') ||
        trimmed.toLowerCase().includes('must have')
      ) {
        const cleaned = trimmed.replace(/^[-•*]\s/, '').trim();
        if (cleaned.length > 10 && cleaned.length < 200) {
          requirements.push(cleaned);
        }
      }
    }

    return requirements.slice(0, 10);
  }

  private detectExperienceLevel(title: string): 'entry' | 'mid' | 'senior' | 'lead' | 'executive' {
    const lower = title.toLowerCase();
    if (lower.includes('senior') || lower.includes('sr.') || lower.includes('principal')) {
      return 'senior';
    }
    if (lower.includes('lead') || lower.includes('staff')) {
      return 'lead';
    }
    if (lower.includes('junior') || lower.includes('jr.') || lower.includes('entry')) {
      return 'entry';
    }
    if (lower.includes('director') || lower.includes('vp') || lower.includes('chief')) {
      return 'executive';
    }
    return 'mid';
  }

  private deduplicateJobs(jobs: Job[]): Job[] {
    const seen = new Set<string>();
    const unique: Job[] = [];

    for (const job of jobs) {
      const key = `${job.title.toLowerCase()}_${job.company.toLowerCase()}`
        .replace(/\s+/g, '');
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(job);
      }
    }

    return unique;
  }
}
