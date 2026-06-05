import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "./Index";

describe("Index page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("defaults to map view", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const mapToggle = screen.getByRole("button", { name: "MAP VIEW" });
    expect(mapToggle).toHaveAttribute("aria-pressed", "true");
  });

  it("defaults small screens to resume view", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query === "(max-width: 767px)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const resumeToggle = screen.getByRole("button", { name: "RESUME VIEW" });
    expect(resumeToggle).toHaveAttribute("aria-pressed", "true");
  });

  it("renders the main sections", async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Nathan's World/i })
    ).toBeInTheDocument();
    
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /FEATURED PROJECTS/i })
      ).toBeInTheDocument();
    }, { timeout: 5000 });
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /EXPERIENCE/i })
      ).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
