import { ThemeProvider } from "./theme/ThemeProvider";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return (
    <>
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
};
