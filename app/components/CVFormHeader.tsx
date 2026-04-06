"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CVTypography, TypographyEntry } from "./cvTypography";
import { Language, LANGUAGE_LABELS } from "./cvLocale";

const TYPOGRAPHY_LABELS: Record<keyof CVTypography, string> = {
  nome:           "Nome",
  cargo:          "Cargo",
  contactItems:   "Itens de Contato",
  titulosSecao:   "Títulos de Seção",
  titulosEntrada: "Títulos de Entrada",
  textos:         "Textos",
};

type Props = {
  typography: CVTypography;
  onTypographyChange: (t: CVTypography) => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
  onPrint: () => void;
};

export default function CVFormHeader({ typography, onTypographyChange, language, onLanguageChange, onPrint }: Props) {
  function updateTypographyField(key: keyof CVTypography, field: keyof TypographyEntry, value: string) {
    onTypographyChange({ ...typography, [key]: { ...typography[key], [field]: value } });
  }

  return (
    <div className="flex items-center justify-between font-(family-name:--font-roboto)">
      <h1 className="text-xl font-semibold text-gray-950">Editar Currículo</h1>
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            </svg>
            Tipografia
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto font-(family-name:--font-roboto)">
            <DialogHeader>
              <DialogTitle>Configurações de Tipografia</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              {(Object.keys(TYPOGRAPHY_LABELS) as (keyof CVTypography)[]).map((key) => (
                <div key={key}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    {TYPOGRAPHY_LABELS[key]}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["fontSize", "lineHeight", "letterSpacing"] as (keyof TypographyEntry)[]).map((field) => (
                      <div key={field}>
                        <Label className="text-xs text-gray-500 mb-1">{field}</Label>
                        <Input
                          value={typography[key][field]}
                          onChange={(e) => updateTypographyField(key, field, e.target.value)}
                          className="text-xs h-7"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <Select value={language} onValueChange={(val) => onLanguageChange(val as Language)}>
          <SelectTrigger className="w-32">
            <span>{LANGUAGE_LABELS[language]}</span>
          </SelectTrigger>
          <SelectContent className="font-(family-name:--font-roboto)">
            {(Object.keys(LANGUAGE_LABELS) as Language[]).map((l) => (
              <SelectItem key={l} value={l}>{LANGUAGE_LABELS[l]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Baixar PDF
        </button>
      </div>
    </div>
  );
}
