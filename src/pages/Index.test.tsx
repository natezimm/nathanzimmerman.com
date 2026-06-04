import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "./Index";

describe("Index page", () => {
  it("defaults to map view", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const mapToggle = screen.getByRole("button", { name: "MAP VIEW" });
    expect(mapToggle).toHaveAttribute("aria-pressed", "true");
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
