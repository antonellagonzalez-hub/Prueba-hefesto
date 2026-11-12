import { Toaster } from "@/components/base/Toaster";
import { TooltipProvider } from "@/components/base/Tooltip";

import {
  DesignerPanelPage,
  PrototypeDesignerPanel,
} from "../prototype/designer-panel/PrototypeDesignerPanel";
import { AppLayout } from "./AppLayout";
import { DocumentosDesk } from "./documentos/DocumentosDesk";

const showPrototypeDesignerPanel = import.meta.env.VITE_LEXY_PROTOTYPE !== "false";
const isDesignerPanelPage =
  typeof window !== "undefined" && window.location.pathname === "/designer-panel";

export const App = () => {
  return (
    <TooltipProvider>
      {showPrototypeDesignerPanel && isDesignerPanelPage ? (
        <DesignerPanelPage />
      ) : (
        <AppLayout>
          <DocumentosDesk />
        </AppLayout>
      )}
      <Toaster />
      {showPrototypeDesignerPanel && !isDesignerPanelPage ? <PrototypeDesignerPanel /> : null}
    </TooltipProvider>
  );
};
