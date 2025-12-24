import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AlertCircle } from "lucide-react";
import { type ErrorComponentProps } from "@tanstack/react-router";
import { Code } from "@/components/ui/typography";

export const GlobalError = ({ error, reset }: ErrorComponentProps) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-destructive/10">
            <AlertCircle className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>An unexpected error occurred</EmptyTitle>
          <EmptyDescription>Please try again later.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-col items-center gap-4">
          <Button onClick={reset}>Try again</Button>
          <Code>{error.message}</Code>
        </EmptyContent>
      </Empty>
    </main>
  );
};
