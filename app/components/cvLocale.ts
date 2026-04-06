export type Language = 'pt' | 'en' | 'es'

export const LANGUAGE_LABELS: Record<Language, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
}

type Locale = {
  months: string[]
  present: string
  formatMonth: (month: string, year: string) => string
  sections: {
    summary: string
    experience: string
    education: string
    projects: string
    skills: string
    languages: string
    technicalSkills: string
  }
}

export const locales: Record<Language, Locale> = {
  pt: {
    months: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    present: 'Atual',
    formatMonth: (month, year) => `${month} ${year}`,
    sections: {
      summary:       'Resumo Profissional',
      experience:    'Experiência Profissional',
      education:     'Educação',
      projects:      'Projetos',
      skills:        'Competências',
      languages:     'Idiomas',
      technicalSkills: 'Habilidades Técnicas',
    },
  },
  en: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    present: 'Present',
    formatMonth: (month, year) => `${month} ${year}`,
    sections: {
      summary:       'Professional Summary',
      experience:    'Work Experience',
      education:     'Education',
      projects:      'Projects',
      skills:        'Skills',
      languages:     'Languages',
      technicalSkills: 'Technical Skills',
    },
  },
  es: {
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    present: 'actualidad',
    formatMonth: (month, year) => `${month} ${year}`,
    sections: {
      summary:       'Resumen Profesional',
      experience:    'Experiencia Laboral',
      education:     'Educación',
      projects:      'Proyectos',
      skills:        'Competencias',
      languages:     'Idiomas',
      technicalSkills: 'Habilidades Técnicas',
    },
  },
}
