export type TypographyEntry = { fontSize: string; lineHeight: string; letterSpacing: string }
export type CVTypography = { [K in keyof typeof cvTypography]: TypographyEntry }

export const cvTypography = {
  nome: { fontSize: "32px", lineHeight: "30px", letterSpacing: "0.5px" },
  cargo: { fontSize: "20px", lineHeight: "20px", letterSpacing: "0px" },
  contactItems: { fontSize: "14px", lineHeight: "15px", letterSpacing: "0px" },
  titulosSecao: { fontSize: "16px", lineHeight: "17px", letterSpacing: "0px" },
  titulosEntrada: {
    fontSize: "14px",
    lineHeight: "15px",
    letterSpacing: "0px",
  },
  textos: { fontSize: "13px", lineHeight: "13px", letterSpacing: "0.2px" },
} as const;
