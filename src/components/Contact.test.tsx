import { describe, it, beforeEach, afterEach, expect, vi, type Mock } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

vi.mock("@emailjs/browser", () => ({
  default: {
    send: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import Contact from "./Contact";

type MockSend = typeof emailjs.send & Mock;

describe("Contact form", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "public");
    (toast.success as Mock).mockReset();
    (toast.error as Mock).mockReset();
    (emailjs.send as MockSend).mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  const fillForm = (data?: { name?: string; email?: string; message?: string }) => {
    const form = screen.getByRole("button", { name: "Send Message" }).closest("form");
    if (!form) {
      throw new Error("Contact form not found");
    }

    fireEvent.change(within(form).getByLabelText("Name"), { target: { value: data?.name ?? "Nathan" } });
    fireEvent.change(within(form).getByLabelText("Email"), { target: { value: data?.email ?? "test@example.com" } });
    fireEvent.change(within(form).getByLabelText("Message"), {
      target: { value: data?.message ?? "Hello there" },
    });
  };

  it("renders call-to-action links", () => {
    render(<Contact />);

    expect(screen.getByRole("heading", { name: /LET'S CONNECT!/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/natezimm");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/zimmermannathan");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:nathan.a.zimmerman@gmail.com");
    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute("href", "/resume.pdf");
  });

  it("submits successfully and resets fields", async () => {
    (emailjs.send as MockSend).mockResolvedValue({});
    render(<Contact />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Message sent! You'll receive a confirmation email shortly."
      );
    });

    const form = screen.getByRole("button", { name: "Send Message" }).closest("form");
    if (!form) {
      throw new Error("Contact form not found");
    }

    expect(within(form).getByLabelText("Name")).toHaveValue("");
    expect(within(form).getByLabelText("Email")).toHaveValue("");
    expect(within(form).getByLabelText("Message")).toHaveValue("");
  });

  it("sanitizes angle brackets before submitting", async () => {
    (emailjs.send as MockSend).mockResolvedValue({});
    render(<Contact />);

    fillForm({
      name: "<Nathan>",
      email: "test@example.com",
      message: "Hello <world>",
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(emailjs.send).toHaveBeenCalled();
    });

    const call = (emailjs.send as MockSend).mock.calls[0];
    expect(call[2]).toMatchObject({
      fname: "Nathan",
      femail: "test@example.com",
      message: "Hello world",
    });
  });

  it("enforces cooldown between successful submissions", async () => {
    const nowSpy = vi.spyOn(Date, "now");
    nowSpy.mockReturnValue(40000);
    (emailjs.send as MockSend).mockResolvedValue({});
    render(<Contact />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });

    nowSpy.mockReturnValue(41000);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please wait 29 seconds before sending another message."
      );
    });
  });

  it("shows error toast on failure", async () => {
    (emailjs.send as MockSend).mockRejectedValue(new Error("fail"));
    render(<Contact />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to send message. Please try again or email me directly."
      );
    });
  });

  it("handles missing EmailJS config", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");
    render(<Contact />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Contact form is not configured. Please email me directly."
      );
    });

    expect(emailjs.send).not.toHaveBeenCalled();
  });
});
