import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const route = getRouteApi("__root__");
const workspaceRoute = getRouteApi("/workspace/$workspaceId");

export const WorkspaceSelector = () => {
  const { workspaceId } = workspaceRoute.useParams();
  const { workspaces } = route.useLoaderData();
  const navigate = useNavigate();

  const handleWorkspaceChange = (workspaceId: string | null) => {
    if (!workspaceId) return;
    navigate({ to: "/workspace/$workspaceId", params: { workspaceId } });
  };

  return (
    <Select value={workspaceId} onValueChange={handleWorkspaceChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="p-1">
        {workspaces.map((workspace) => (
          <SelectItem key={workspace.name} value={workspace.name}>
            {workspace.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
