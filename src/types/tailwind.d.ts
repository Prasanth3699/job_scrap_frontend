// types/tailwind.d.ts
declare module "tailwindcss/lib/util/flattenColorPalette" {
  function flattenColorPalette(colors: unknown): { [key: string]: string };
  export default flattenColorPalette;
}
