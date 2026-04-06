"use client";

import { forwardRef } from "react";
import { CVData } from "./CVBuilder";
import { CVTypography } from "./cvTypography";
import { Language, locales } from "./cvLocale";

type Props = {
  data: CVData;
  typography: CVTypography;
  language: Language;
};

function parseBullets(items: string[]): string[] {
  return items.filter(Boolean);
}

type ContactItem = { label: string; href?: string };

function buildContactItems(data: CVData): ContactItem[] {
  const items: ContactItem[] = [];
  if (data.location) items.push({ label: data.location });
  if (data.email)
    items.push({ label: data.email, href: `mailto:${data.email}` });
  if (data.phone) items.push({ label: data.phone, href: `tel:${data.phone.replace(/\s/g, '')}` });
  if (data.website) {
    const href = data.website.startsWith("http")
      ? data.website
      : `https://${data.website}`;
    items.push({ label: data.website, href });
  }
  if (data.linkedin) {
    const href = data.linkedin.startsWith("http")
      ? data.linkedin
      : `https://${data.linkedin}`;
    items.push({ label: data.linkedin, href });
  }
  return items;
}

const CVPreview = forwardRef<HTMLDivElement, Props>(function CVPreview(
  { data, typography: t, language },
  ref,
) {
  const locale = locales[language];
  const contactItems = buildContactItems(data);

  function formatMonth(value: string) {
    if (!value) return "";
    const [year, month] = value.split("-");
    return locale.formatMonth(locale.months[parseInt(month) - 1], year);
  }

  const isEmpty =
    !data.name &&
    !data.title &&
    !data.summary &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.projects.length === 0 &&
    data.skills.length === 0 &&
    contactItems.length === 0;

  if (isEmpty) {
    return (
      <div ref={ref} className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">
          Preencha o formulário para visualizar o currículo
        </p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="cv-content bg-white shadow-md"
      style={{
        fontFamily: '"Charter", Georgia, serif',
        width: "816px",
        minHeight: "1055px",
        padding: "0.8cm 68px 57px",
        color: "#111",
        textAlign: "justify",
        ...t.textos,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        {data.name && (
          <h1
            style={{
              ...t.nome,
              fontWeight: "normal",
              margin: 0,
            }}
          >
            {data.name}
          </h1>
        )}
        {data.title && (
          <p style={{ ...t.cargo, margin: "6px 0 0", color: "#111" }}>{data.title}</p>
        )}
        {contactItems.length > 0 && (
          <p style={{ ...t.contactItems, margin: "8px 0 0" }}>
            {contactItems.map((item, i) => (
              <span key={i}>
                {i > 0 && " | "}
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Resumo */}
      {data.summary && (
        <Section titulosSecao={t.titulosSecao} title={locale.sections.summary}>
          <p style={{ margin: 0, ...t.textos, textAlign: "justify" }}>
            {data.summary}
          </p>
        </Section>
      )}

      {/* Experiência */}
      {data.experience.length > 0 && (
        <Section titulosSecao={t.titulosSecao} title={locale.sections.experience}>
          {data.experience.map((exp) => {
            const bullets = parseBullets(exp.description);
            const dateRange = [
              exp.startDate ? formatMonth(exp.startDate) : "",
              exp.current
                ? locale.present
                : exp.endDate
                  ? formatMonth(exp.endDate)
                  : "",
            ]
              .filter(Boolean)
              .join(" – ");

            const headingParts = [
              exp.position,
              exp.company,
              exp.location,
            ].filter(Boolean);

            return (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "bold", ...t.titulosEntrada }}>
                    {headingParts.map((part, i) => (
                      <span key={i}>
                        {i === 0 ? (
                          <span style={{ fontWeight: "bold", color: "#111" }}>{part}</span>
                        ) : (
                          <span style={{ fontWeight: "normal" }}>
                            {i === 1 ? ", " : " – "}
                            {part}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                  {dateRange && (
                    <span
                      style={{
                        ...t.titulosEntrada,
                        color: "#111",
                        whiteSpace: "nowrap",
                        marginLeft: "16px",
                      }}
                    >
                      {dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}
                    </span>
                  )}
                </div>
                {bullets.length > 0 && (
                  <ul
                    style={{
                      margin: "8px 0 0",
                      paddingLeft: "18px",
                      listStyleType: "disc",
                    }}
                  >
                    {bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: "4px",
                          ...t.textos,
                          textAlign: "justify",
                        }}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </Section>
      )}

      {/* Formação Acadêmica */}
      {data.education.length > 0 && (
        <Section titulosSecao={t.titulosSecao} title={locale.sections.education}>
          {data.education.map((edu) => {
            const years = [edu.startDate, edu.endDate]
              .filter(Boolean)
              .join(" - ");
            return (
              <div key={edu.id} style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "bold", ...t.titulosEntrada, color: "#111" }}>
                    {edu.institution}
                  </p>
                  {years && (
                    <span
                      style={{
                        ...t.titulosEntrada,
                        color: "#111",
                        whiteSpace: "nowrap",
                        marginLeft: "16px",
                      }}
                    >
                      {years}
                    </span>
                  )}
                </div>
                {edu.degree && (
                  <p style={{ margin: "2px 0 0", ...t.textos }}>{edu.degree}</p>
                )}
              </div>
            );
          })}
        </Section>
      )}

      {/* Projetos */}
      {data.projects.length > 0 && (
        <Section titulosSecao={t.titulosSecao} title={locale.sections.projects}>
          {data.projects.map((proj) => {
            const bullets = parseBullets(proj.description);
            const dateRange = [
              proj.startDate ? formatMonth(proj.startDate) : "",
              proj.current
                ? locale.present
                : proj.endDate
                  ? formatMonth(proj.endDate)
                  : "",
            ]
              .filter(Boolean)
              .join(" – ");

            const heading = [proj.role, proj.name].filter(Boolean).join(" - ");

            return (
              <div key={proj.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: "bold", ...t.titulosEntrada, color: "#111" }}>
                    {heading || proj.name}
                  </p>
                  {dateRange && (
                    <span
                      style={{
                        ...t.titulosEntrada,
                        color: "#111",
                        whiteSpace: "nowrap",
                        marginLeft: "16px",
                      }}
                    >
                      {dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}
                    </span>
                  )}
                </div>
                {bullets.length > 0 && (
                  <ul
                    style={{
                      margin: "8px 0 0",
                      paddingLeft: "18px",
                      listStyleType: "disc",
                    }}
                  >
                    {bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: "6px",
                          ...t.textos,
                          textAlign: "justify",
                        }}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </Section>
      )}

      {/* Habilidades */}
      {(data.languages || data.skills.length > 0) && (
        <Section titulosSecao={t.titulosSecao} title={locale.sections.skills}>
          {data.languages && (
            <p style={{ margin: "0 0 4px", ...t.textos }}>
              <strong style={{ ...t.titulosEntrada }}>{locale.sections.languages}:</strong> {data.languages}.
            </p>
          )}
          {data.skills.length > 0 && (
            <p style={{ margin: 0, ...t.textos }}>
              <strong style={{ ...t.titulosEntrada }}>{locale.sections.technicalSkills}:</strong> {data.skills.join(", ")}.
            </p>
          )}
        </Section>
      )}
    </div>
  );
});

export default CVPreview;

function Section({
  title,
  children,
  titulosSecao,
}: {
  title: string;
  children: React.ReactNode;
  titulosSecao: React.CSSProperties;
}) {
  return (
    <div style={{ marginTop: "4px" }}>
      <h2
        style={{
          ...titulosSecao,
          fontWeight: "bold",
          margin: "0 0 2px",
          borderBottom: "1px solid #111",
          paddingBottom: "2px",
        }}
      >
        {title}
      </h2>
      <div style={{ marginTop: "4px" }}>{children}</div>
    </div>
  );
}

