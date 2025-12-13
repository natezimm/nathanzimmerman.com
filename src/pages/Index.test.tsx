import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Index from "./Index";
import { ThemeProvider } from "@/contexts/ThemeContext";

describe("Index page", () => {
  it("renders the main sections", () => {
    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", { name: /Hi, I'm Nathan/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Featured Projects/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /About Me/ })
    ).toBeInTheDocument();
  });
});
