import React, { useEffect, useRef } from "react";
import { BridgeComponent } from "../types";

export function createRemoteComponent<ModuleComponentProps>({
  remote,
  fallback,
}: {
  remote: { default: () => BridgeComponent<ModuleComponentProps> };
  fallback: (info: { error: Error }) => React.ReactElement;
}) {
  return ({ ...renderProps }: ModuleComponentProps): React.ReactElement => {
    const rootRef = useRef<HTMLDivElement>(null);
    const remoteRef = useRef<BridgeComponent<ModuleComponentProps> | null>(
      null
    );

    useEffect(() => {
      let dom: HTMLDivElement | null = null;
      const renderTimeout = setTimeout(() => {
        if (!remoteRef.current) {
          remoteRef.current = remote.default();
        }

        dom = rootRef.current;

        if (dom) {
          // renderRef.current = rootRef.current;
          remoteRef.current.render({
            ...renderProps,
            dom,
            fallback,
          });
        }
      });

      return () => {
        clearTimeout(renderTimeout);
      };
    }, [renderProps]);

    useEffect(() => {
      let dom: HTMLDivElement | null = null;
      const domTimeout = setTimeout(() => {
        dom = rootRef.current;
      });
      return () => {
        clearTimeout(domTimeout);
        if (dom) {
          remoteRef.current?.destroy({ dom });
        }
      };
    }, []);

    return <div ref={rootRef} />;
  };
}
