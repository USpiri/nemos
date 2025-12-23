import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyTitle,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { AlertCircle } from "lucide-react";
import { type ErrorComponentProps } from "@tanstack/react-router";

export const WorkspaceError = ({ error, reset }: ErrorComponentProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-destructive/10">
          <AlertCircle className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Error loading workspaces</EmptyTitle>
        <EmptyDescription>{error.message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={reset}>Try again</Button>
      </EmptyContent>
    </Empty>
  );
};
