import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input primitive", () => {
  it("renders with provided attributes", () => {
    render(<Input placeholder="name" type="email" className="extra" />);
    const input = screen.getByPlaceholderText("name") as HTMLInputElement;
    expect(input.type).toBe("email");
    expect(input).toHaveClass("extra");
  });
});
