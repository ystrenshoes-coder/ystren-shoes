export type SizeOption = {
  col: string;
  label: string;
};

export const WOMEN_SIZES: SizeOption[] = [
  { col: "35", label: "35 COL / 6 US / 36 EUR / 23 CM (WM)" },
  { col: "36", label: "36 COL / 6.5 US / 37 EUR / 23.5/24 CM (WM)" },
  { col: "37", label: "37 COL / 7 US / 38 EUR / 24 CM (WM)" },
  { col: "38", label: "38 COL / 8 US / 39 EUR / 25 CM (WM)" },
  { col: "39", label: "39 COL / 9 US / 40 EUR / 26 CM (WM)" },
];

export const MEN_SIZES: SizeOption[] = [
  { col: "38", label: "38 COL / 7 US / 40 EUR / 25 CM (MEN)" },
  { col: "39", label: "39 COL / 8 US / 41 EUR / 25.6/26 CM (MEN)" },
  { col: "40", label: "40 COL / 8.5 US / 42 EUR / 26 CM (MEN)" },
  { col: "41", label: "41 COL / 9 US / 43 EUR / 27 CM (MEN)" },
  { col: "42", label: "42 COL / 10 US / 44 EUR / 28 CM (MEN)" },
  { col: "43", label: "43 COL / 11 US / 45 EUR / 28.5 CM (MEN)" },
];

export function sizesForCategory(categorySlug?: string | null): SizeOption[] {
  if (categorySlug === "mujerr" || categorySlug === "mujer") {
    return WOMEN_SIZES;
  }
  if (categorySlug === "hombre") {
    return MEN_SIZES;
  }
  return MEN_SIZES;
}
