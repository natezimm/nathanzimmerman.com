import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About section", () => {
  it("renders profile copy and stats", () => {
    render(<About viewMode="map" />);

    expect(screen.getByRole("heading", { name: /PLAYER PROFILE/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Software Engineer II/i).length).toBeGreaterThan(0);
    expect(screen.getByText("PLAYER STATS")).toBeInTheDocument();
    expect(screen.getByText("Problem Solving")).toBeInTheDocument();
  });
});
