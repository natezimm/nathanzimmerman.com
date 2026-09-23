import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound page", () => {
  it("logs the missing path and renders a link home", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/missing"]}>
        <NotFound />
      </MemoryRouter>
    );

    expect(consoleError).toHaveBeenCalledWith(
      "404 Error: User attempted to access non-existent route:",
      "/missing"
    );
    expect(screen.getByRole("link", { name: /Return to Home/ })).toHaveAttribute("href", "/");

    consoleError.mockRestore();
  });
});
