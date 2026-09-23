import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the current year", () => {
    render(<Footer />);

    const year = new Date().getFullYear().toString();
    expect(screen.getByText((content) => content.includes(year))).toBeInTheDocument();
  });
});
