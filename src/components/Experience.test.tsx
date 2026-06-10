import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Experience from "./Experience";

describe("Experience section", () => {
  it("renders resume timeline entries", () => {
    render(<Experience viewMode="map" />);

    expect(screen.getByRole("heading", { name: /EXPERIENCE/i })).toBeInTheDocument();
    expect(screen.getByText("Software Engineer II")).toBeInTheDocument();
    expect(screen.getByText("Nelnet")).toBeInTheDocument();
    expect(
      screen.getByText("Built payment-plan and billing workflows across .NET microservices and Angular UI.")
    ).toBeInTheDocument();
    expect(screen.getByText("Software Development Engineer")).toBeInTheDocument();
    expect(screen.getByText("Amazon")).toBeInTheDocument();
    expect(screen.getByText("Delivered customer-facing mortgage platform features.")).toBeInTheDocument();
  });
});
