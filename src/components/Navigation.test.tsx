import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Navigation from "./Navigation";

const createMockElement = () => {
  const element = document.createElement("div");
  element.scrollIntoView = vi.fn();
  return element;
};

describe("Navigation", () => {
  let getElementSpy: ReturnType<typeof vi.spyOn>;
  const homeElement = createMockElement();
  const projectsElement = createMockElement();
  const contactElement = createMockElement();
  const onViewModeChange = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    onViewModeChange.mockReset();

    getElementSpy = vi.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === "home") return homeElement;
      if (id === "projects") return projectsElement;
      if (id === "contact") return contactElement;
      return null;
    });
  });

  afterEach(() => {
    homeElement.scrollIntoView = vi.fn();
    projectsElement.scrollIntoView = vi.fn();
    contactElement.scrollIntoView = vi.fn();
    getElementSpy.mockRestore();
  });

  it("scrolls to sections and toggles view mode", () => {
    render(<Navigation viewMode="map" onViewModeChange={onViewModeChange} />);

    expect(screen.queryByRole("button", { name: /SOUND:/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/❤/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /NATHAN ZIMMERMAN/i }));
    expect(homeElement.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

    fireEvent.click(screen.getByRole("button", { name: "PROJECTS" }));
    expect(projectsElement.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

    fireEvent.click(screen.getByRole("button", { name: "GRID VIEW" }));
    expect(onViewModeChange).toHaveBeenCalledWith("grid");
  });

  it("opens mobile menu and scrolls from it", () => {
    render(<Navigation viewMode="map" onViewModeChange={onViewModeChange} />);

    fireEvent.click(screen.getByLabelText("Toggle menu"));
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();

    fireEvent.click(within(mobileMenu).getByRole("button", { name: "CONTACT" }));
    expect(contactElement.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });
});
