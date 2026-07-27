"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, FileJson, Settings2, Upload } from "lucide-react";
import { CVTypography, TypographyEntry } from "./cvTypography";
import { Language, LANGUAGE_LABELS } from "./cvLocale";

const TYPOGRAPHY_LABELS: Record<keyof CVTypography, string> = {
  nome: "Nome",
  cargo: "Cargo",
  contactItems: "Itens de Contato",
  titulosSecao: "Títulos de Seção",
  titulosEntrada: "Títulos de Entrada",
  textos: "Textos",
};

type Props = {
  typography: CVTypography;
  onTypographyChange: (t: CVTypography) => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
  onPrint: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
};

export default function CVFormHeader({
  typography,
  onTypographyChange,
  language,
  onLanguageChange,
  onPrint,
  onExport,
  onImport,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);

  function updateTypographyField(
    key: keyof CVTypography,
    field: keyof TypographyEntry,
    value: string,
  ) {
    onTypographyChange({
      ...typography,
      [key]: { ...typography[key], [field]: value },
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = "";
    setJsonDialogOpen(false);
  }

  function handleExportClick() {
    onExport();
    setJsonDialogOpen(false);
  }

  return (
    <div className="flex items-center justify-between font-(family-name:--font-roboto)">
      <h1 className="text-xl font-semibold text-gray-950">Editar Currículo</h1>
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings2 size={13} />
            Tipografia
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto font-(family-name:--font-roboto)">
            <DialogHeader>
              <DialogTitle>Configurações de Tipografia</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              {(Object.keys(TYPOGRAPHY_LABELS) as (keyof CVTypography)[]).map(
                (key) => (
                  <div key={key}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      {TYPOGRAPHY_LABELS[key]}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          "fontSize",
                          "lineHeight",
                          "letterSpacing",
                        ] as (keyof TypographyEntry)[]
                      ).map((field) => (
                        <div key={field}>
                          <Label className="text-xs text-gray-500 mb-1">
                            {field}
                          </Label>
                          <Input
                            value={typography[key][field]}
                            onChange={(e) =>
                              updateTypographyField(key, field, e.target.value)
                            }
                            className="text-xs h-7"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </DialogContent>
        </Dialog>
        <Select
          value={language}
          onValueChange={(val) => onLanguageChange(val as Language)}
        >
          <SelectTrigger className="w-32">
            <span>{LANGUAGE_LABELS[language]}</span>
          </SelectTrigger>
          <SelectContent className="font-(family-name:--font-roboto)">
            {(Object.keys(LANGUAGE_LABELS) as Language[]).map((l) => (
              <SelectItem key={l} value={l}>
                {LANGUAGE_LABELS[l]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="hidden"
        />
        <Dialog open={jsonDialogOpen} onOpenChange={setJsonDialogOpen}>
          <DialogTrigger className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <FileJson size={13} />
            JSON
          </DialogTrigger>
          <DialogContent className="max-w-sm font-(family-name:--font-roboto)">
            <DialogHeader>
              <DialogTitle>Importar / Exportar JSON</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload size={14} />
                Importar JSON
              </button>
              <button
                onClick={handleExportClick}
                className="flex w-full items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download size={14} />
                Exportar JSON
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Button
        onClick={onPrint}
        size="icon-lg"
        aria-label="Baixar PDF"
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-blue-600 text-white shadow-lg shadow-black/10 hover:bg-blue-500 hover:shadow-xl hover:-translate-y-0.5"
      >
        <Download className="size-6" />
      </Button>
    </div>
  );
}
