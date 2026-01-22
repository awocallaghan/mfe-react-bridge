export interface BridgeComponent<ModuleComponentProps> {
  render: (
    props: ModuleComponentProps & {
      dom: HTMLDivElement;
      fallback: (info: { error: Error }) => React.ReactElement;
    }
  ) => void;
  destroy: (params: { dom: HTMLDivElement }) => void;
}
