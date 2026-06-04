import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Projects from "./Projects";

describe("Projects section", () => {
  it("renders featured project cards", () => {
    render(
      <MemoryRouter>
        <Projects viewMode="map" />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /FEATURED PROJECTS/i })).toBeInTheDocument();
    expect(screen.getByText("BRICK BREAKER")).toBeInTheDocument();
    expect(screen.getByText("NERDLE")).toBeInTheDocument();
    expect(screen.getByText("SUDOKU")).toBeInTheDocument();
    expect(screen.getByText("BLACKJACK")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "DETAILS" }).length).toBeGreaterThan(0);
  });
});
