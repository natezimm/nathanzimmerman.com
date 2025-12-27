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
    
    // Lazy-loaded components need to be awaited with longer timeout
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Featured Projects/ })
      ).toBeInTheDocument();
    }, { timeout: 5000 });
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /About Me/ })
      ).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
