'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import CVForm from './CVForm'
import CVPreview from './CVPreview'
import { cvTypography, CVTypography } from './cvTypography'
import { Language } from './cvLocale'


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
        const parsed = JSON.parse(saved)
        // migração: description string → string[]
        if (parsed.experience) {
          parsed.experience = parsed.experience.map((e: Experience) => ({
            ...e,
            description: Array.isArray(e.description)
              ? e.description
              : e.description.split('\n').map((s: string) => s.trim()).filter(Boolean),
          }))
        }
        if (parsed.projects) {
          parsed.projects = parsed.projects.map((p: Project) => ({
            ...p,
            description: Array.isArray(p.description)
              ? p.description
              : p.description.split('\n').map((s: string) => s.trim()).filter(Boolean),
          }))
        }
        // migração: skills string[] → SkillGroup[]
        if (parsed.skills && parsed.skills.length > 0 && typeof parsed.skills[0] === 'string') {
          parsed.skills = [{ id: Math.random().toString(36).slice(2, 9), title: 'Habilidades técnicas', text: parsed.skills.join(', ') }]
        }
        setData({ ...initialData, ...parsed })
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
  const cvRef = useRef<HTMLDivElement>(null)

  const origin = useMemo(() => typeof window !== 'undefined' ? window.location.origin : '', [])

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
        body { margin: 0; padding: 0; }
        .cv-content {
          max-width: 100% !important;
          min-height: unset !important;
          padding: 0.8cm 18mm 15mm !important;
          box-shadow: none !important;
        }
      }
    `,
  })

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white" style={{ fontFamily: "var(--font-roboto), sans-serif" }}>
        <CVForm data={data} onChange={handleChange} typography={typography} onTypographyChange={setTypography} onPrint={() => handlePrint()} language={language} onLanguageChange={setLanguage} />
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-100 p-8">
        <ScaledPreview>
          <CVPreview ref={cvRef} data={data} typography={typography} language={language} />
        </ScaledPreview>
      </div>

    </div>
  )
}
