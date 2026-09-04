export type SizeRowData = {
  col: string;
  us: string;
  eur: string;
  cm: string;
  suffix: "WM" | "MEN";
};

export const WOMEN_SIZES: SizeRowData[] = [
  { col: "35", us: "6", eur: "36", cm: "23", suffix: "WM" },
  { col: "36", us: "6.5", eur: "37", cm: "23.5/24", suffix: "WM" },
  { col: "37", us: "7", eur: "38", cm: "24", suffix: "WM" },
  { col: "38", us: "8", eur: "39", cm: "25", suffix: "WM" },
  { col: "39", us: "9", eur: "40", cm: "26", suffix: "WM" },
];

export const MEN_SIZES: SizeRowData[] = [
  { col: "38", us: "7", eur: "40", cm: "25", suffix: "MEN" },
  { col: "39", us: "8", eur: "41", cm: "25.6/26", suffix: "MEN" },
  { col: "40", us: "8.5", eur: "42", cm: "26", suffix: "MEN" },
  { col: "41", us: "9", eur: "43", cm: "27", suffix: "MEN" },
  { col: "42", us: "10", eur: "44", cm: "28", suffix: "MEN" },
  { col: "43", us: "11", eur: "45", cm: "28.5", suffix: "MEN" },
];

export function sizeLabel(row: SizeRowData): string {
  return `${row.col} COL / ${row.us} US / ${row.eur} EUR / ${row.cm} CM (${row.suffix})`;
}

export function parseSizeLabel(label: string): SizeRowData | null {
  const m = label.match(
    /(\S+)\s+COL\s*\/\s*(\S+)\s+US\s*\/\s*(\S+)\s+EUR\s*\/\s*(\S+)\s+CM\s*\(?(WM|MEN)?\)?/i
  );
  if (!m) return null;
  return {
    col: m[1],
    us: m[2],
    eur: m[3],
    cm: m[4],
    suffix: (m[5]?.toUpperCase() as "WM" | "MEN") ?? "MEN",
  };
}

export function sizesForCategory(categorySlug?: string | null): SizeRowData[] {
  const slug = categorySlug?.toLowerCase();
  if (slug === "mujerr" || slug === "mujer") {
    return WOMEN_SIZES;
  }
  if (slug === "hombre") {
    return MEN_SIZES;
  }
  return MEN_SIZES;
}
