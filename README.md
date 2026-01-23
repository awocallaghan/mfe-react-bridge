# mfe-react-bridge

This package provides utilities for rendering React microfrontends that use different versions of React, allowing you to decouple your microfrontend architecture from relying on a shared instance of React. You can import microfrontends which use a different version of React to the host and render them without hook errors. You can also use this approach to render microfrontends that don't use React as if they were a React component.

This package is designed to work with [Module Federation](https://module-federation.io/) and inspired by [@module-federation/bridge-react](https://www.npmjs.com/package/@module-federation/bridge-react).

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [How it works](#how-it-works)
- [Contributing](#contributing)

## Installation

Install the package with your preferred package manager:

```bash
pnpm add @mintel/mfe-react-bridge
```

The package provides type definitions, as well as a `/react17` entry point for projects that have not yet upgraded to React 18+.

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

## How it works

This library provides a wrapper interface around React components to avoid rendering components using different instances of React within a single React tree. The library abstracts the bridge interface and allows you to work with React components, but it can be useful to understand how this works.

The `createBridgeComponent` function wraps an `render`/`destroy` interface around a React component:

```ts
export interface BridgeComponent<ModuleComponentProps> {
  render: (
    props: ModuleComponentProps & {
      dom: HTMLDivElement;
      fallback: (info: { error: Error }) => React.ReactElement;
    },
  ) => void;
  destroy: (params: { dom: HTMLDivElement }) => void;
}
```

The `createRemoteComponent` function takes a remote module that exports this interface and provides a React component that uses it under the hood.

If you're trying to expose a non-React microfrontend, you can implement the `BridgeComponent` interface directly to wrap your microfrontend's render and destroy logic:

```ts
export default () => ({
  render: ({ dom, ...props }) => {
    // Your microfrontend's render logic here
  },
  destroy: ({ dom }) => {
    // Your microfrontend's cleanup logic here
  },
});
```

## Contributing

Contributions are welcome! Please open issues and pull requests as needed.

We're using this in production at Mintel, so any changes must be backwards compatible.
