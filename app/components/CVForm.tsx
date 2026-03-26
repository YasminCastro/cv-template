"use client";

import { CVData, Experience, Education, Project } from "./CVBuilder";

type Props = {
  data: CVData;
  onChange: (data: CVData) => void;
};

function randomId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function CVForm({ data, onChange }: Props) {
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
      description: "",
    };
    set("experience", [...data.experience, entry]);
  }

  function updateExperience(
    id: string,
    field: keyof Experience,
    value: unknown,
  ) {
    set(
      "experience",
      data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  }

  function removeExperience(id: string) {
    set(
      "experience",
      data.experience.filter((e) => e.id !== id),
    );
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
    set(
      "education",
      data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  }

  function removeEducation(id: string) {
    set(
      "education",
      data.education.filter((e) => e.id !== id),
    );
  }

  function addProject() {
    const entry: Project = {
      id: randomId(),
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    set("projects", [...data.projects, entry]);
  }

  function updateProject(id: string, field: keyof Project, value: unknown) {
    set(
      "projects",
      data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }

  function removeProject(id: string) {
    set(
      "projects",
      data.projects.filter((p) => p.id !== id),
    );
  }

  function updateSkills(raw: string) {
    set(
      "skills",
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-xl font-semibold text-gray-950">Editar Currículo</h1>

      {/* Dados Pessoais */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
          Dados Pessoais
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ex: Yasmin Castro"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Cargo / Título profissional
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex: Desenvolvedora Full-Stack"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Localização
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Goiânia, Goiás, Brasil"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="yasmin@email.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Telefone
            </label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(62) 99999-9999"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Website / Portfólio / LinkedIn
            </label>
            <input
              type="text"
              value={data.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="yascastro.com.br"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Resumo */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
          Resumo Profissional
        </h2>
        <textarea
          value={data.summary}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="Descreva brevemente sua trajetória e objetivos profissionais..."
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </section>

      {/* Experiência */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
            Experiência
          </h2>
          <button
            onClick={addExperience}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            + Adicionar
          </button>
        </div>
        {data.experience.map((exp, i) => (
          <div
            key={exp.id}
            className="rounded-md border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Experiência {i + 1}
              </span>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remover
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(exp.id, "position", e.target.value)
                  }
                  placeholder="Desenvolvedora Full-Stack"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                  placeholder="SVA Tech"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Localização
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, "location", e.target.value)
                  }
                  placeholder="Belo Horizonte, MG"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Início
                </label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(exp.id, "startDate", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Fim
                </label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperience(exp.id, "endDate", e.target.value)
                  }
                  disabled={exp.current}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) =>
                  updateExperience(exp.id, "current", e.target.checked)
                }
                className="rounded"
              />
              Emprego atual
            </label>
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Descrição (uma atividade por linha)
              </label>
              <textarea
                value={exp.description}
                onChange={(e) =>
                  updateExperience(exp.id, "description", e.target.value)
                }
                placeholder={
                  "Planeja e mantém painéis interativos...\nDesenvolve APIs escaláveis com Node.js..."
                }
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Formação Acadêmica */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
            Formação Acadêmica
          </h2>
          <button
            onClick={addEducation}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            + Adicionar
          </button>
        </div>
        {data.education.map((edu, i) => (
          <div
            key={edu.id}
            className="rounded-md border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Formação {i + 1}
              </span>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remover
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Instituição
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, "institution", e.target.value)
                  }
                  placeholder="Instituto Federal de Goiás"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Grau e Curso
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, "degree", e.target.value)
                  }
                  placeholder="Bacharelado em Sistemas de Informação"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Início
                </label>
                <input
                  type="number"
                  value={edu.startDate}
                  onChange={(e) =>
                    updateEducation(edu.id, "startDate", e.target.value)
                  }
                  placeholder="2020"
                  min="1950"
                  max="2099"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Conclusão
                </label>
                <input
                  type="number"
                  value={edu.endDate}
                  onChange={(e) =>
                    updateEducation(edu.id, "endDate", e.target.value)
                  }
                  placeholder="2024"
                  min="1950"
                  max="2099"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Projetos */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
            Projetos e Experiências Relevantes
          </h2>
          <button
            onClick={addProject}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            + Adicionar
          </button>
        </div>
        {data.projects.map((proj, i) => (
          <div
            key={proj.id}
            className="rounded-md border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Projeto {i + 1}
              </span>
              <button
                onClick={() => removeProject(proj.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remover
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Função / Papel (opcional)
                </label>
                <input
                  type="text"
                  value={proj.role}
                  onChange={(e) =>
                    updateProject(proj.id, "role", e.target.value)
                  }
                  placeholder="Desenvolvedora Front-End"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Nome do projeto / Programa
                </label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) =>
                    updateProject(proj.id, "name", e.target.value)
                  }
                  placeholder="Residência TIC - Programa BRISA e UFG"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Início
                </label>
                <input
                  type="month"
                  value={proj.startDate}
                  onChange={(e) =>
                    updateProject(proj.id, "startDate", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Fim
                </label>
                <input
                  type="month"
                  value={proj.endDate}
                  onChange={(e) =>
                    updateProject(proj.id, "endDate", e.target.value)
                  }
                  disabled={proj.current}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={proj.current}
                onChange={(e) =>
                  updateProject(proj.id, "current", e.target.checked)
                }
                className="rounded"
              />
              Em andamento
            </label>
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Descrição (uma atividade por linha)
              </label>
              <textarea
                value={proj.description}
                onChange={(e) =>
                  updateProject(proj.id, "description", e.target.value)
                }
                placeholder={
                  "Programa prático de capacitação...\nContribuiu para o desenvolvimento..."
                }
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Habilidades */}
      <section className="space-y-3 pb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
          Habilidades
        </h2>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">
            Idiomas
          </label>
          <input
            type="text"
            value={data.languages}
            onChange={(e) => set("languages", e.target.value)}
            placeholder="Português (nativo), Inglês (avançado)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-800 mb-1">
            Habilidades técnicas (separe por vírgula)
          </label>
          <textarea
            value={data.skills.join(", ")}
            onChange={(e) => updateSkills(e.target.value)}
            placeholder="JavaScript, TypeScript, Node.js, React, Next.js, PostgreSQL, Docker, AWS"
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </section>
    </div>
  );
}
