'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import CVForm from './CVForm'
import CVPreview from './CVPreview'
import { cvTypography, CVTypography } from './cvTypography'
import { Language, LANGUAGE_LABELS } from './cvLocale'


export type Experience = {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
}

export type Education = {
  id: string
  institution: string
  degree: string
  startDate: string
  endDate: string
  current: boolean
}

export type Project = {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string[]
}

export type SkillGroup = {
  id: string
  title: string
  text: string
}

export type CVData = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  summary: string
  experience: Experience[]
  education: Education[]
  projects: Project[]
  languages: string
  skills: SkillGroup[]
}

const initialData: CVData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  summary: '',
  experience: [],
  education: [],
  projects: [],
  languages: '',
  skills: [],
}

const STORAGE_KEY = 'cv-template-data'
const LANGUAGE_STORAGE_KEY = 'cv-template-language'
const TYPOGRAPHY_STORAGE_KEY = 'cv-template-typography'
const EXPORT_SCHEMA_VERSION = 1

function normalizeImportedData(parsed: Record<string, unknown>): CVData {
  const raw = { ...parsed }
  if (Array.isArray(raw.experience)) {
    raw.experience = (raw.experience as Experience[]).map((e) => {
      const desc = e.description as unknown
      return {
        ...e,
        description: Array.isArray(desc)
          ? desc
          : (desc as string).split('\n').map((s: string) => s.trim()).filter(Boolean),
      }
    })
  }
  if (Array.isArray(raw.projects)) {
    raw.projects = (raw.projects as Project[]).map((p) => {
      const desc = p.description as unknown
      return {
        ...p,
        description: Array.isArray(desc)
          ? desc
          : (desc as string).split('\n').map((s: string) => s.trim()).filter(Boolean),
      }
    })
  }
  if (Array.isArray(raw.skills) && raw.skills.length > 0 && typeof raw.skills[0] === 'string') {
    raw.skills = [{ id: Math.random().toString(36).slice(2, 9), title: 'Habilidades técnicas', text: (raw.skills as string[]).join(', ') }]
  }
  return { ...initialData, ...raw } as CVData
}

function ScaledPreview({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    function update() {
      const container = containerRef.current
      const inner = innerRef.current
      if (!container || !inner) return
      const newScale = Math.min(1, container.clientWidth / 816)
      setScale(newScale)
      setHeight(inner.scrollHeight * newScale)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    if (innerRef.current) ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height: height ?? 'auto', overflow: 'hidden' }}>
      <div ref={innerRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: '816px' }}>
        {children}
      </div>
    </div>
  )
}

export default function CVBuilder() {
  const [data, setData] = useState<CVData>(initialData)
  const [language, setLanguage] = useState<Language>('pt')
  const [typography, setTypography] = useState<CVTypography>({
    nome:          { ...cvTypography.nome },
    cargo:         { ...cvTypography.cargo },
    contactItems:  { ...cvTypography.contactItems },
    titulosSecao:  { ...cvTypography.titulosSecao },
    titulosEntrada:{ ...cvTypography.titulosEntrada },
    textos:        { ...cvTypography.textos },
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setData(normalizeImportedData(JSON.parse(saved)))
      }
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (savedLanguage && savedLanguage in LANGUAGE_LABELS) {
        setLanguage(savedLanguage as Language)
      }
      const savedTypography = localStorage.getItem(TYPOGRAPHY_STORAGE_KEY)
      if (savedTypography) {
        setTypography((prev) => ({ ...prev, ...JSON.parse(savedTypography) }))
      }
    } catch {
      // storage indisponível
    }
  }, [])

  function handleChange(newData: CVData) {
    setData(newData)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    } catch {
      // storage indisponível
    }
  }

  function handleLanguageChange(newLanguage: Language) {
    setLanguage(newLanguage)
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)
    } catch {
      // storage indisponível
    }
  }

  function handleTypographyChange(newTypography: CVTypography) {
    setTypography(newTypography)
    try {
      localStorage.setItem(TYPOGRAPHY_STORAGE_KEY, JSON.stringify(newTypography))
    } catch {
      // storage indisponível
    }
  }
  const cvRef = useRef<HTMLDivElement>(null)
  const [overflowPx, setOverflowPx] = useState(0)
  const overflowing = overflowPx > 0

  useEffect(() => {
    const el = cvRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setOverflowPx(Math.max(0, el.scrollHeight - 1056))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Estimativa de quantas linhas remover para caber em 1 página,
  // baseada na altura de linha da tipografia do corpo do texto.
  const linesToRemove = useMemo(() => {
    if (overflowPx <= 0) return 0
    const fontSizePx = parseFloat(typography.textos.fontSize) || 13
    const lineHeightPx = parseFloat(typography.textos.lineHeight) || fontSizePx
    return Math.ceil(overflowPx / lineHeightPx)
  }, [overflowPx, typography.textos])

  const origin = useMemo(() => typeof window !== 'undefined' ? window.location.origin : '', [])

  function handleExport() {
    const payload = { schemaVersion: EXPORT_SCHEMA_VERSION, ...data, language, typography }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.name ? data.name.replace(/\s+/g, '_') : 'curriculo'}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleImport(file: File) {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      delete parsed.schemaVersion
      const { language: importedLanguage, typography: importedTypography, ...cvFields } = parsed
      handleChange(normalizeImportedData(cvFields))
      if (typeof importedLanguage === 'string' && importedLanguage in LANGUAGE_LABELS) {
        handleLanguageChange(importedLanguage as Language)
      }
      if (importedTypography && typeof importedTypography === 'object') {
        handleTypographyChange({ ...typography, ...importedTypography })
      }
    } catch {
      window.alert('Não foi possível importar o arquivo. Verifique se é um JSON de currículo válido.')
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: data.name
      ? `${data.name.replace(/\s+/g, '_')}_${language === 'en' ? 'Resume' : 'Curriculo'}`
      : (language === 'en' ? 'Resume' : 'Curriculo'),
    pageStyle: `
      @font-face {
        font-family: 'Charter';
        font-style: normal;
        font-weight: normal;
        src: url('${origin}/fonts/charter_regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Charter';
        font-style: italic;
        font-weight: normal;
        src: url('${origin}/fonts/charter_italic.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Charter';
        font-style: normal;
        font-weight: bold;
        src: url('${origin}/fonts/charter_bold.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Charter';
        font-style: italic;
        font-weight: bold;
        src: url('${origin}/fonts/charter_bold_italic.woff2') format('woff2');
      }
      @page {
        size: 216mm 279mm;
        margin: 0;
      }
      @media print {
        html, body { margin: 0; padding: 0; height: 279mm; overflow: hidden; }
        .cv-content {
          max-width: 100% !important;
          min-height: unset !important;
          max-height: 279mm !important;
          overflow: hidden !important;
          padding: 0.8cm 18mm 15mm !important;
          box-shadow: none !important;
        }
      }
    `,
  })

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
        <CVForm data={data} onChange={handleChange} typography={typography} onTypographyChange={handleTypographyChange} onPrint={() => handlePrint()} language={language} onLanguageChange={handleLanguageChange} onExport={handleExport} onImport={handleImport} />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-100 p-8">
        {overflowing && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <span>⚠️</span>
            <span>Conteúdo ultrapassa 1 página — o PDF será cortado. Remova cerca de {linesToRemove} {linesToRemove === 1 ? 'linha' : 'linhas'} para caber em 1 página.</span>
          </div>
        )}
        <ScaledPreview>
          <CVPreview ref={cvRef} data={data} typography={typography} language={language} />
        </ScaledPreview>
      </div>

    </div>
  )
}
