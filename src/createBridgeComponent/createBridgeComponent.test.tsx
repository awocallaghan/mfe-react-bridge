import React, { act } from "react";
import { expect, test } from "vitest";
import { waitFor } from "@testing-library/react";

import { createBridgeComponent } from "./createBridgeComponent";

test("renders and unmounts the app", async () => {
  const App = () => <div>Hello world</div>;
  const bridge = createBridgeComponent({
    rootComponent: App,
  })();
  const dom = document.createElement("div");

  await act(async () => {
    await bridge.render({ dom, fallback: () => <div>Fallback</div> });
  });

  await waitFor(() => {
    expect(dom.innerHTML).toBe("<div>Hello world</div>");
  });

  await act(async () => {
    await bridge.destroy({ dom });
  });

  expect(dom.innerHTML).toBe("");
});

test("renders the fallback component when the app throws an error", async () => {
  const App = () => {
    throw new Error();
  };
  const bridge = createBridgeComponent({
    rootComponent: App,
  })();
  const dom = document.createElement("div");

  await act(async () => {
    await bridge.render({ dom, fallback: () => <div>Fallback</div> });
  });

  expect(dom.innerHTML).toBe("<div>Fallback</div>");
});
