import React from "react";
import { expect, test, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

import { createRemoteComponent } from "./createRemoteComponent";

test("it renders a bridge component", async () => {
  const BridgeComponent = {
    render: vi.fn(),
    destroy: vi.fn(),
  };
  const remote = { default: () => BridgeComponent };

  const fallback = () => <div>Error!</div>;
  const Component = createRemoteComponent({
    remote,
    fallback,
  });
  const { container, unmount } = render(<Component />);

  await waitFor(() => expect(BridgeComponent.render).toHaveBeenCalled());
  expect(BridgeComponent.destroy).not.toHaveBeenCalled();
  expect(BridgeComponent.render).toHaveBeenCalledWith({
    dom: container.querySelector("div"),
    fallback: fallback,
  });

  unmount();
  await waitFor(() => expect(BridgeComponent.destroy).toHaveBeenCalled());
});

test("it only destroys the component when unmounted", async () => {
  const BridgeComponent = {
    render: vi.fn(),
    destroy: vi.fn(),
  };
  const remote = { default: () => BridgeComponent };

  const fallback = () => <div>Error!</div>;
  const Component = createRemoteComponent({
    remote,
    fallback,
  });
  const { rerender, unmount } = render(<Component />);

  await waitFor(() => expect(BridgeComponent.render).toHaveBeenCalled());
  expect(BridgeComponent.destroy).not.toHaveBeenCalled();

  rerender(<Component />);
  await waitFor(() => expect(BridgeComponent.render).toHaveBeenCalledTimes(2));
  expect(BridgeComponent.destroy).not.toHaveBeenCalled();

  unmount();
  await waitFor(() => expect(BridgeComponent.destroy).toHaveBeenCalled());
});
