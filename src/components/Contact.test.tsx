import { describe, it, beforeEach, expect, vi, type Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

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
    ((emailjs.send as MockSend).mockReset());
  });

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Nathan" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Hello there" },
    });
  };

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

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
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
