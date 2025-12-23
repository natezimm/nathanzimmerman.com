import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Index from "./Index";
import { ThemeProvider } from "@/contexts/ThemeContext";

describe("Index page", () => {
  it("renders the main sections", async () => {
    render(
      <ThemeProvider>
        <Index />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", { name: /Hi, I'm Nathan/ })
    ).toBeInTheDocument();
    
    // Lazy-loaded components need to be awaited
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Featured Projects/ })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /About Me/ })
      ).toBeInTheDocument();
    });
  });
});
