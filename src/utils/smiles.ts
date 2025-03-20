import { parse, SvgDrawer } from "@ibm-materials/ts-smiles-drawer";

const options = {
  explicitHydrogens: true,
  terminalCarbons: true,
  width: 500,
  height: 300,
};

const drawer = new SvgDrawer(options);

export const draw = (smiles: string, node: SVGSVGElement, theme?: string) => {
  const docTheme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

  const originalLog = console.log;
  console.log = () => {};
  parse(
    smiles,
    // eslint-disable-next-line
    (res: any) => {
      drawer.draw(res, node, theme ?? docTheme);
    },
    // eslint-disable-next-line
    (e: any) => console.error(e),
  );
  console.log = originalLog;
};
