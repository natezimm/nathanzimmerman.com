import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

describe("ThemeToggle", () => {
  it("toggles the document theme", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByLabelText("Toggle theme");

    fireEvent.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
