import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "./textarea";

describe("Textarea primitive", () => {
  it("applies className and rows", () => {
    render(<Textarea placeholder="message" rows={10} className="extra" />);
    const textarea = screen.getByPlaceholderText("message");
    expect(textarea).toHaveAttribute("rows", "10");
    expect(textarea).toHaveClass("extra");
  });
});
