# mfe-react-bridge

This package provides utilities for loading microfrontends that use different versions of React. You can import microfrontends built with a different version of React and render them as if they are React components without errors.

## Installation

Install the package with your preferred package manager:

```bash
pnpm add @mintel/mfe-react-bridge
```

## Usage

### Exporting a remote microfrontend

```ts
import { createBridgeComponent } from "@mintel/mfe-react-bridge";
// or if you're using React 17:
import { createBridgeComponent } from "@mintel/mfe-react-bridge/react17";

// Import the React component you want to expose
import App from "./App";

export default createBridgeComponent({
  rootComponent: App,
});
```

### Importing a remote microfrontend

```tsx
import { importRemote } from 'module-federation-import-remote';
import { BridgeComponent, createRemoteComponent } from 'mfe-react-bridge';

// You can define the props your remote component expects for type safety
interface ModuleComponentProps {
  authToken: string;
}

interface RemoteBridgeComponent {
  default: () => BridgeComponent<ModuleComponentProps>;
};


// Load the remote module
const remote = await importRemote<RemoteBridgeComponent>({
  url: '/path/to/bundle',
  scope: 'SomeRemotePackage',
  module: 'App',
});

// Create the React component
const RemoteComponent = createRemoteComponent<ModuleComponentProps>({
  remote,
  // Provide an error fallback
  fallback: () => <div>Error!</div>,
});

// Render the React component
const SomeApp = () => (
  <Suspsense fallback={<div>Loading...</div>}>
    <RemoteComponent authToken="some-auth-token" />
  </Suspense>
);
```
