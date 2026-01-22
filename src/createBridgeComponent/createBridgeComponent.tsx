import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BridgeComponent } from "../types";

export function createBridgeComponent<ModuleComponentProps>({
  rootComponent,
}: {
  rootComponent: React.ComponentType<ModuleComponentProps>;
}): () => BridgeComponent<ModuleComponentProps> {
  const rootMap = new Map<HTMLElement, ReactDOM.Root>();
  const App = rootComponent;
  return () => ({
    async render({ dom, fallback, ...props }) {
      let root = rootMap.get(dom);
      if (!root) {
        root = ReactDOM.createRoot(dom);
        rootMap.set(dom, root);
      }
      root.render(
        <ErrorBoundary FallbackComponent={fallback}>
          <App
            {...(props as ModuleComponentProps & React.JSX.IntrinsicAttributes)}
          />
        </ErrorBoundary>
      );
    },
    async destroy({ dom }) {
      rootMap.get(dom)?.unmount();
      rootMap.delete(dom);
    },
  });
}
