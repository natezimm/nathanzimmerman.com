import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

const ThemeInspector = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button data-testid="toggle" onClick={toggleTheme}>
        Toggle
      </button>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("defaults to light when no preference exists", async () => {
    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.classList.contains("light")).toBe(true);
    });

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("respects saved theme and toggles value", async () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    const toggle = screen.getByTestId("toggle");
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(localStorage.getItem("theme")).toBe("light");
    });
  });

  it("falls back to system preference when no saved theme", async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn(() => ({
      matches: true,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    try {
      render(
        <ThemeProvider>
          <ThemeInspector />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(localStorage.getItem("theme")).toBe("dark");
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it("throws when used outside provider", () => {
    expect(() => render(<ThemeInspector />)).toThrow("useTheme must be used within a ThemeProvider");
  });
});
