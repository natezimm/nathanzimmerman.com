import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App shell", () => {
  it("renders the index route", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /Hi, I'm Nathan/ })
    ).toBeInTheDocument();
  });
});
