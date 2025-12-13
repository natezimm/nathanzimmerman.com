import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Projects from "./Projects";

describe("Projects section", () => {
  it("renders featured work and actions", () => {
    render(<Projects />);

    expect(screen.getByText("Brick Breaker Resume")).toBeInTheDocument();
    expect(screen.getByText("Nerdle")).toBeInTheDocument();
    expect(screen.getByText("Blackjack")).toBeInTheDocument();
    expect(screen.getByText("Sudoku")).toBeInTheDocument();
    expect(screen.getAllByText("Code")).toHaveLength(4);
    expect(screen.getAllByText("Live Demo")).toHaveLength(4);
  });
});
