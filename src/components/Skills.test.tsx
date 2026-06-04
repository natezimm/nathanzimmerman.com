import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Skills, { skillFillFromYears } from "./Skills";

describe("Skills section", () => {
  it("renders grouped skills", () => {
    render(<Skills viewMode="map" />);

    expect(screen.getByRole("heading", { name: /SKILLS & TECH/i })).toBeInTheDocument();
    expect(screen.getByText("LANGUAGES")).toBeInTheDocument();
    expect(screen.getByText("FRAMEWORKS")).toBeInTheDocument();
    expect(screen.getByText("DATABASES")).toBeInTheDocument();
    expect(screen.getByText("TOOLS & OTHER")).toBeInTheDocument();
  });

  it("fills bars by years of experience", () => {
    render(<Skills viewMode="map" />);

    expect(skillFillFromYears("6+ Years")).toBe(90);
    expect(screen.getByRole("meter", { name: "TypeScript experience" })).toHaveStyle({ width: "74%" });
    expect(screen.getByRole("meter", { name: "React experience" })).toHaveStyle({ width: "74%" });
    expect(skillFillFromYears("3+ Years")).toBe(74);

    expect(screen.getByRole("meter", { name: "JavaScript experience" })).toHaveStyle({ width: "90%" });
    expect(screen.getByRole("meter", { name: "Angular experience" })).toHaveStyle({ width: "74%" });
  });
});
