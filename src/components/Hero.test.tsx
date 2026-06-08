import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
  const onViewModeChange = vi.fn();
  let getElementSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    onViewModeChange.mockReset();

    getElementSpy = vi.spyOn(document, "getElementById").mockImplementation((id) => {
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

  it("renders the overworld hero messaging", () => {
    render(
      <MemoryRouter>
        <Hero viewMode="map" onViewModeChange={onViewModeChange} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Nathan's World/i })).toBeInTheDocument();
    expect(screen.getByAltText(/Retro overworld map/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /PRESS START/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /HOMESTEAD/i })).toBeInTheDocument();
  });

  it("scrolls when press start is clicked", () => {
    render(
      <MemoryRouter>
        <Hero viewMode="map" onViewModeChange={onViewModeChange} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /PRESS START/i }));
    expect(projectsElement.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

    fireEvent.click(screen.getByRole("button", { name: /HOMESTEAD/i }));
    expect(aboutElement.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("shows destination details in the bottom status bar on hover", () => {
    render(
      <MemoryRouter>
        <Hero viewMode="map" onViewModeChange={onViewModeChange} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Hover or tap a destination/i)).toBeInTheDocument();

    fireEvent.pointerEnter(screen.getByRole("button", { name: /ARCADE DISTRICT/i }));

    expect(screen.getByText("DESTINATION:")).toBeInTheDocument();
    expect(screen.getByText(/ARCADE DISTRICT - Brick Breaker Resume/i)).toBeInTheDocument();
  });

  it("shows a mobile view toggle in the hero", () => {
    render(
      <MemoryRouter>
        <Hero viewMode="map" onViewModeChange={onViewModeChange} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch to resume view" }));

    expect(onViewModeChange).toHaveBeenCalledWith("grid");
  });

  it("locks manual controls to available path directions", () => {
    render(
      <MemoryRouter>
        <Hero viewMode="map" onViewModeChange={onViewModeChange} />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Move down" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move left" })).not.toBeDisabled();

    fireEvent.keyDown(window, { key: "ArrowLeft" });

    expect(screen.getByRole("button", { name: "Move down" })).not.toBeDisabled();
  });

  it("opens Nerdle after keyboard movement reaches its location", () => {
    render(
      <MemoryRouter>
        <Hero viewMode="map" onViewModeChange={onViewModeChange} />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    fireEvent.keyDown(window, { key: "Enter" });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "NERDLE" })).toBeInTheDocument();
  });

  it("opens Sudoku after keyboard movement reaches its location", () => {
    render(
      <MemoryRouter>
        <Hero viewMode="map" onViewModeChange={onViewModeChange} />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "Enter" });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "SUDOKU" })).toBeInTheDocument();
  });

  it("closes destination popups with Escape", () => {
    render(
      <MemoryRouter>
        <Hero viewMode="map" onViewModeChange={onViewModeChange} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /ARCADE DISTRICT/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
