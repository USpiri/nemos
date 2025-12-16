import { getRouteApi } from "@tanstack/react-router";
import { SidebarContent as SidebarContentBase } from "../ui/sidebar";
import { WorkspaceTree } from "../WorkspaceTree";

const root = "nemos-app";
const route = getRouteApi("/workspace/$workspaceId");

export const SidebarContent = () => {
  const tree = route.useLoaderData();
  const { workspaceId } = route.useParams();

  return (
    <SidebarContentBase>
      <WorkspaceTree tree={tree} root={root} workspace={workspaceId} />
    </SidebarContentBase>
  );
};
