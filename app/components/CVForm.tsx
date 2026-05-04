"use client";

import { CVData, Experience, Education, Project, SkillGroup } from "./CVBuilder";
import { CVTypography } from "./cvTypography";
import { Language } from "./cvLocale";
import CVFormHeader from "./CVFormHeader";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  data: CVData;
  onChange: (data: CVData) => void;
  typography: CVTypography;
  onTypographyChange: (t: CVTypography) => void;
  onPrint: () => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
};

function randomId() {
  return Math.random().toString(36).slice(2, 9);
}

function FormSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen className="space-y-3">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger className="flex items-center gap-2 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400 transition-transform duration-200 group-data-open:rotate-90"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
            {title}
          </h2>
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent className="space-y-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function DragHandle(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing touch-none"
      title="Arrastar para reordenar"
    >
      <GripVertical size={14} />
    </button>
  );
}

function SortableExperienceItem({
  exp,
  index,
  onUpdate,
  onRemove,
}: {
  exp: Experience;
  index: number;
  onUpdate: (id: string, field: keyof Experience, value: unknown) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exp.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="rounded-md border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DragHandle {...attributes} {...listeners} />
          <span className="text-xs font-medium text-gray-500">Experiência {index + 1}</span>
        </div>
        <button onClick={() => onRemove(exp.id)} className="text-xs text-red-400 hover:text-red-600">
          Remover
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">Cargo</label>
          <input
            type="text"
            value={exp.position}
            onChange={(e) => onUpdate(exp.id, "position", e.target.value)}
            placeholder="Desenvolvedora Full-Stack"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">Empresa</label>
          <input
            type="text"
            value={exp.company}
            onChange={(e) => onUpdate(exp.id, "company", e.target.value)}
            placeholder="SVA Tech"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-800 mb-1">Localização</label>
          <input
            type="text"
            value={exp.location}
            onChange={(e) => onUpdate(exp.id, "location", e.target.value)}
            placeholder="Belo Horizonte, MG"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">Início</label>
          <input
            type="month"
            value={exp.startDate}
            onChange={(e) => onUpdate(exp.id, "startDate", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">Fim</label>
          <input
            type="month"
            value={exp.endDate}
            onChange={(e) => onUpdate(exp.id, "endDate", e.target.value)}
            disabled={exp.current}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
        <input
          type="checkbox"
          checked={exp.current}
          onChange={(e) => onUpdate(exp.id, "current", e.target.checked)}
          className="rounded"
        />
        Emprego atual
      </label>
      <div>
        <label className="block text-xs font-medium text-gray-800 mb-1">Descrição</label>
        <div className="space-y-2">
          {exp.description.map((bullet, bi) => (
            <div key={bi} className="flex items-start gap-2">
              <span className="mt-2 text-gray-400 text-xs select-none">•</span>
              <input
                type="text"
                value={bullet}
                onChange={(e) => {
                  const updated = [...exp.description];
                  updated[bi] = e.target.value;
                  onUpdate(exp.id, "description", updated);
                }}
                placeholder="Descreva uma atividade ou conquista..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => onUpdate(exp.id, "description", exp.description.filter((_, i) => i !== bi))}
                className="mt-2 text-xs text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUpdate(exp.id, "description", [...exp.description, ""])}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            + Adicionar bullet
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableEducationItem({
  edu,
  index,
  onUpdate,
  onRemove,
}: {
  edu: Education;
  index: number;
  onUpdate: (id: string, field: keyof Education, value: unknown) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: edu.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="rounded-md border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DragHandle {...attributes} {...listeners} />
          <span className="text-xs font-medium text-gray-500">Formação {index + 1}</span>
        </div>
        <button onClick={() => onRemove(edu.id)} className="text-xs text-red-400 hover:text-red-600">
          Remover
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-800 mb-1">Instituição</label>
          <input
            type="text"
            value={edu.institution}
            onChange={(e) => onUpdate(edu.id, "institution", e.target.value)}
            placeholder="Instituto Federal de Goiás"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-800 mb-1">Grau e Curso</label>
          <input
            type="text"
            value={edu.degree}
            onChange={(e) => onUpdate(edu.id, "degree", e.target.value)}
            placeholder="Bacharelado em Sistemas de Informação"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">Início</label>
          <input
            type="number"
            value={edu.startDate}
            onChange={(e) => onUpdate(edu.id, "startDate", e.target.value)}
            placeholder="2020"
            min="1950"
            max="2099"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">Conclusão</label>
          <input
            type="number"
            value={edu.endDate}
            onChange={(e) => onUpdate(edu.id, "endDate", e.target.value)}
            placeholder="2024"
            min="1950"
            max="2099"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function SortableProjectItem({
  proj,
  index,
  onUpdate,
  onRemove,
}: {
  proj: Project;
  index: number;
  onUpdate: (id: string, field: keyof Project, value: unknown) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: proj.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="rounded-md border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DragHandle {...attributes} {...listeners} />
          <span className="text-xs font-medium text-gray-500">Projeto {index + 1}</span>
        </div>
        <button onClick={() => onRemove(proj.id)} className="text-xs text-red-400 hover:text-red-600">
          Remover
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-800 mb-1">Função / Papel (opcional)</label>
          <input
            type="text"
            value={proj.role}
            onChange={(e) => onUpdate(proj.id, "role", e.target.value)}
            placeholder="Desenvolvedora Front-End"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-800 mb-1">Nome do projeto / Programa</label>
          <input
            type="text"
            value={proj.name}
            onChange={(e) => onUpdate(proj.id, "name", e.target.value)}
            placeholder="Residência TIC - Programa BRISA e UFG"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">Início</label>
          <input
            type="month"
            value={proj.startDate}
            onChange={(e) => onUpdate(proj.id, "startDate", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">Fim</label>
          <input
            type="month"
            value={proj.endDate}
            onChange={(e) => onUpdate(proj.id, "endDate", e.target.value)}
            disabled={proj.current}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
        <input
          type="checkbox"
          checked={proj.current}
          onChange={(e) => onUpdate(proj.id, "current", e.target.checked)}
          className="rounded"
        />
        Em andamento
      </label>
      <div>
        <label className="block text-xs font-medium text-gray-800 mb-1">Descrição</label>
        <div className="space-y-2">
          {proj.description.map((bullet, bi) => (
            <div key={bi} className="flex items-start gap-2">
              <span className="mt-2 text-gray-400 text-xs select-none">•</span>
              <input
                type="text"
                value={bullet}
                onChange={(e) => {
                  const updated = [...proj.description];
                  updated[bi] = e.target.value;
                  onUpdate(proj.id, "description", updated);
                }}
                placeholder="Descreva uma atividade ou conquista..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => onUpdate(proj.id, "description", proj.description.filter((_, i) => i !== bi))}
                className="mt-2 text-xs text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUpdate(proj.id, "description", [...proj.description, ""])}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            + Adicionar bullet
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableSkillGroupItem({
  sg,
  index,
  onUpdate,
  onRemove,
}: {
  sg: SkillGroup;
  index: number;
  onUpdate: (id: string, field: keyof SkillGroup, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sg.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="rounded-md border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DragHandle {...attributes} {...listeners} />
          <span className="text-xs font-medium text-gray-500">Grupo {index + 1}</span>
        </div>
        <button onClick={() => onRemove(sg.id)} className="text-xs text-red-400 hover:text-red-600">
          Remover
        </button>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-800 mb-1">Título</label>
        <input
          type="text"
          value={sg.title}
          onChange={(e) => onUpdate(sg.id, "title", e.target.value)}
          placeholder="Ex: Linguagens de programação"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-800 mb-1">Habilidades</label>
        <input
          type="text"
          value={sg.text}
          onChange={(e) => onUpdate(sg.id, "text", e.target.value)}
          placeholder="Ex: JavaScript, TypeScript, Python"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

export default function CVForm({ data, onChange, typography, onTypographyChange, onPrint, language, onLanguageChange }: Props) {

  const sensors = useSensors(useSensor(PointerSensor));

  function set(field: keyof CVData, value: unknown) {
    onChange({ ...data, [field]: value });
  }

  function addExperience() {
    const entry: Experience = {
      id: randomId(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [],
    };
    set("experience", [...data.experience, entry]);
  }

  function updateExperience(id: string, field: keyof Experience, value: unknown) {
    set("experience", data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function removeExperience(id: string) {
    set("experience", data.experience.filter((e) => e.id !== id));
  }

  function handleExperienceDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.experience.findIndex((e) => e.id === active.id);
    const newIndex = data.experience.findIndex((e) => e.id === over.id);
    set("experience", arrayMove(data.experience, oldIndex, newIndex));
  }

  function addEducation() {
    const entry: Education = {
      id: randomId(),
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
    };
    set("education", [...data.education, entry]);
  }

  function updateEducation(id: string, field: keyof Education, value: unknown) {
    set("education", data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function removeEducation(id: string) {
    set("education", data.education.filter((e) => e.id !== id));
  }

  function handleEducationDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.education.findIndex((e) => e.id === active.id);
    const newIndex = data.education.findIndex((e) => e.id === over.id);
    set("education", arrayMove(data.education, oldIndex, newIndex));
  }

  function addProject() {
    const entry: Project = {
      id: randomId(),
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [],
    };
    set("projects", [...data.projects, entry]);
  }

  function updateProject(id: string, field: keyof Project, value: unknown) {
    set("projects", data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function removeProject(id: string) {
    set("projects", data.projects.filter((p) => p.id !== id));
  }

  function handleProjectDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.projects.findIndex((e) => e.id === active.id);
    const newIndex = data.projects.findIndex((e) => e.id === over.id);
    set("projects", arrayMove(data.projects, oldIndex, newIndex));
  }

  function addSkillGroup() {
    const entry: SkillGroup = { id: randomId(), title: "", text: "" };
    set("skills", [...data.skills, entry]);
  }

  function updateSkillGroup(id: string, field: keyof SkillGroup, value: string) {
    set("skills", data.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function removeSkillGroup(id: string) {
    set("skills", data.skills.filter((s) => s.id !== id));
  }

  function handleSkillDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.skills.findIndex((e) => e.id === active.id);
    const newIndex = data.skills.findIndex((e) => e.id === over.id);
    set("skills", arrayMove(data.skills, oldIndex, newIndex));
  }

  return (
    <div className="p-6 space-y-6">
      <CVFormHeader
        typography={typography}
        onTypographyChange={onTypographyChange}
        language={language}
        onLanguageChange={onLanguageChange}
        onPrint={onPrint}
      />

      {/* Dados Pessoais */}
      <FormSection title="Dados Pessoais">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-800 mb-1">Nome completo</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ex: Yasmin Castro"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-800 mb-1">Cargo / Título profissional</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex: Desenvolvedora Full-Stack"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">Localização</label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Goiânia, Goiás, Brasil"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">E-mail</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="yasmin@email.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">Telefone</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(62) 99999-9999"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">Website / Portfólio</label>
            <input
              type="text"
              value={data.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="yascastro.com.br"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">LinkedIn</label>
            <input
              type="text"
              value={data.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="linkedin.com/in/yasmincastro"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </FormSection>

      {/* Resumo */}
      <FormSection title="Resumo Profissional">
        <textarea
          value={data.summary}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="Descreva brevemente sua trajetória e objetivos profissionais..."
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </FormSection>

      {/* Experiência */}
      <FormSection
        title="Experiência"
        action={
          <button onClick={addExperience} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            + Adicionar
          </button>
        }
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleExperienceDragEnd}>
          <SortableContext items={data.experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {data.experience.map((exp, i) => (
              <SortableExperienceItem
                key={exp.id}
                exp={exp}
                index={i}
                onUpdate={updateExperience}
                onRemove={removeExperience}
              />
            ))}
          </SortableContext>
        </DndContext>
      </FormSection>

      {/* Formação Acadêmica */}
      <FormSection
        title="Formação Acadêmica"
        action={
          <button onClick={addEducation} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            + Adicionar
          </button>
        }
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEducationDragEnd}>
          <SortableContext items={data.education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {data.education.map((edu, i) => (
              <SortableEducationItem
                key={edu.id}
                edu={edu}
                index={i}
                onUpdate={updateEducation}
                onRemove={removeEducation}
              />
            ))}
          </SortableContext>
        </DndContext>
      </FormSection>

      {/* Projetos */}
      <FormSection
        title="Projetos e Experiências Relevantes"
        action={
          <button onClick={addProject} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            + Adicionar
          </button>
        }
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjectDragEnd}>
          <SortableContext items={data.projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {data.projects.map((proj, i) => (
              <SortableProjectItem
                key={proj.id}
                proj={proj}
                index={i}
                onUpdate={updateProject}
                onRemove={removeProject}
              />
            ))}
          </SortableContext>
        </DndContext>
      </FormSection>

      {/* Habilidades */}
      <FormSection
        title="Habilidades"
        action={
          <button onClick={addSkillGroup} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            + Adicionar
          </button>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">Idiomas</label>
            <input
              type="text"
              value={data.languages}
              onChange={(e) => set("languages", e.target.value)}
              placeholder="Português (nativo), Inglês (avançado)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSkillDragEnd}>
            <SortableContext items={data.skills.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {data.skills.map((sg, i) => (
                <SortableSkillGroupItem
                  key={sg.id}
                  sg={sg}
                  index={i}
                  onUpdate={updateSkillGroup}
                  onRemove={removeSkillGroup}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </FormSection>
    </div>
  );
}
