import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Hero from "./Hero";

const createMockElement = () => {
  const element = document.createElement("div");
  element.scrollIntoView = vi.fn();
  return element;
};

describe("Hero section", () => {
  const projectsElement = createMockElement();
  const contactElement = createMockElement();
  const aboutElement = createMockElement();
  let getElementSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
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
});
