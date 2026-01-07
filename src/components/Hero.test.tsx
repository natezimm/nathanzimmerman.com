import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen, act, waitFor } from "@testing-library/react";
import Hero from "./Hero";

const createMockElement = () => {
  const element = document.createElement("div");
  element.scrollIntoView = vi.fn();
  return element;
};

const mockMatchMedia = (prefersReducedMotion: boolean) => {
  const listeners: ((e: MediaQueryListEvent) => void)[] = [];

  return vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? prefersReducedMotion : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: (_event: string, callback: (e: MediaQueryListEvent) => void) => {
      listeners.push(callback);
    },
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("Hero section", () => {
  const projectsElement = createMockElement();
  const contactElement = createMockElement();
  const aboutElement = createMockElement();
  let getElementSpy: ReturnType<typeof vi.spyOn>;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
    originalMatchMedia = window.matchMedia;
    window.matchMedia = mockMatchMedia(false);

    getElementSpy = vi
      .spyOn(document, "getElementById")
      .mockImplementation((id) => {
        if (id === "projects") return projectsElement;
        if (id === "contact") return contactElement;
        if (id === "about") return aboutElement;
        return null;
      });
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = originalMatchMedia;
    projectsElement.scrollIntoView = vi.fn();
    contactElement.scrollIntoView = vi.fn();
    aboutElement.scrollIntoView = vi.fn();
    getElementSpy.mockRestore();
  });

  it("scrolls to featured sections", () => {
    render(<Hero />);

    fireEvent.click(screen.getByRole("button", { name: "View My Work" }));
    expect(projectsElement.scrollIntoView).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Get In Touch" }));
    expect(contactElement.scrollIntoView).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText("Scroll to about section"));
    expect(aboutElement.scrollIntoView).toHaveBeenCalled();
  });

  describe("Typing effect", () => {
    it("provides accessible text for screen readers", () => {
      render(<Hero />);

      const srOnlyText = screen.getByText("Full-Stack Engineer • Product-Minded Builder • Former Special-Ed Teacher");
      expect(srOnlyText).toBeInTheDocument();
      expect(srOnlyText).toHaveClass("sr-only");
    });

    it("has aria-label with full roles text", () => {
      render(<Hero />);

      const typingParagraph = screen.getByLabelText("Full-Stack Engineer • Product-Minded Builder • Former Special-Ed Teacher");
      expect(typingParagraph).toBeInTheDocument();
    });

    it("starts typing the first role", async () => {
      render(<Hero />);

      await act(async () => {
        vi.advanceTimersByTime(80 * 5);
      });

      const typingContainer = screen.getByLabelText("Full-Stack Engineer • Product-Minded Builder • Former Special-Ed Teacher");
      expect(typingContainer.textContent).toContain("Full-");
    });

    it("displays cursor element with blink animation class", () => {
      render(<Hero />);

      const cursor = document.querySelector(".animate-blink");
      expect(cursor).toBeInTheDocument();
    });

    it("types and deletes text cycling through roles", async () => {
      render(<Hero />);

      const advanceTimeBy = async (ms: number) => {
        const steps = Math.ceil(ms / 80);
        for (let i = 0; i < steps; i++) {
          await act(async () => {
            vi.advanceTimersByTime(80);
          });
        }
      };

      await advanceTimeBy(19 * 80);

      const visibleTypingSpan = document.querySelector('[aria-hidden="true"].inline-flex');
      expect(visibleTypingSpan?.textContent).toContain("Full-Stack Engineer");
      await advanceTimeBy(2000);
      await advanceTimeBy(50 * 10);

      const textAfterDelete = visibleTypingSpan?.textContent || "";
      expect(textAfterDelete.length).toBeLessThan("Full-Stack Engineer".length);
    });
  });

  describe("Reduced motion preference", () => {
    it("shows static text when user prefers reduced motion", async () => {
      window.matchMedia = mockMatchMedia(true);

      render(<Hero />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const typingContainer = screen.getByLabelText("Full-Stack Engineer • Product-Minded Builder • Former Special-Ed Teacher");
      expect(typingContainer.textContent).toContain("Full-Stack Engineer");
    });
  });
});
