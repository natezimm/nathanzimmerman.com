import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, buttonVariants } from "./button";

describe("Button primitives", () => {
  it("exports a variant helper", () => {
    const className = buttonVariants({ variant: "outline", size: "sm" });
    expect(className).toContain("border");
    expect(className).toContain("h-9");
  });

  it("renders default styles", () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole("button", { name: "Primary" })).toHaveClass("bg-primary");
  });

  it("supports asChild to forward props", () => {
    render(
      <Button asChild>
        <a href="/" aria-label="home">
          Home
        </a>
      </Button>
    );

    const link = screen.getByRole("link", { name: "home" });
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveClass("inline-flex");
  });
});
