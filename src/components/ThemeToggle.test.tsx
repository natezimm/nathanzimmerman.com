import { describe, expect, it, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("toggles the document theme from dark to light", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Default is now dark
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const button = screen.getByLabelText("Toggle theme");
    fireEvent.click(button);

    // After toggle, should be light
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});
