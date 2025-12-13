import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

describe("Card primitives", () => {
  it("renders Card with base styles", () => {
    render(
      <Card data-testid="base-card" className="custom-card">
        <div>Card content</div>
      </Card>
    );

    const card = screen.getByTestId("base-card");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("custom-card");
  });

  it("renders header variants", () => {
    render(
      <Card>
        <CardHeader className="header">
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Title")).toHaveClass("font-semibold");
    expect(screen.getByText("Description")).toHaveClass("text-sm");
    expect(screen.getByText("Body")).toHaveClass("p-6");
    expect(screen.getByText("Footer")).toHaveClass("flex");
  });
});
