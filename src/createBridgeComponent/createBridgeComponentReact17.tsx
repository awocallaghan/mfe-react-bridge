import React from "react";
import ReactDOM from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import { BridgeComponent } from "../types";

export function createBridgeComponent<ModuleComponentProps>({
  rootComponent,
}: {
  rootComponent: React.ComponentType<ModuleComponentProps>;
}): () => BridgeComponent<ModuleComponentProps> {
  const App = rootComponent;
  return () => ({
    async render({ dom, fallback, ...props }) {
      ReactDOM.render(
        <ErrorBoundary FallbackComponent={fallback}>
          <App
            {...(props as ModuleComponentProps & React.JSX.IntrinsicAttributes)}
          />
        </ErrorBoundary>,
        dom
      );
    },
    async destroy({ dom }) {
      ReactDOM.unmountComponentAtNode(dom);
    },
  });
}
