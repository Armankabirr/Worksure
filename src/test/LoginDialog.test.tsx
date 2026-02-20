import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginDialog from "@/components/LoginDialog";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockLogin = vi.fn();
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("LoginDialog Component", () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSwitchToRegister = vi.fn();

  const renderDialog = () => {
    return render(
      <LoginDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue({ error: null });
  });

  it("TC-L01: should render login dialog when open", () => {
    renderDialog();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it("TC-L02: should render email and password fields", () => {
    renderDialog();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("TC-L03: should show validation error for empty email", async () => {
    renderDialog();
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.click(submitButton);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("TC-L04: should show validation error for invalid email format", async () => {
    renderDialog();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "password123");

    // Submit via form to bypass native email validation
    fireEvent.submit(submitButton.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it("TC-L05: should show validation error for empty password", async () => {
    renderDialog();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "user@example.com");
    await userEvent.click(submitButton);

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("TC-L06: should call login with correct credentials on valid submission", async () => {
    renderDialog();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "user@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@example.com", "password123");
    });
  });

  it("TC-L07: should navigate to home on successful login", async () => {
    renderDialog();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "user@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("TC-L08: should display error message on login failure", async () => {
    mockLogin.mockResolvedValue({
      error: new Error("Invalid credentials"),
    });

    renderDialog();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "user@example.com");
    await userEvent.type(passwordInput, "wrongpassword");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("TC-L09: should not render when open is false", () => {
    render(
      <LoginDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onSwitchToRegister={mockOnSwitchToRegister}
      />
    );
    expect(screen.queryByText(/welcome back/i)).not.toBeInTheDocument();
  });

  it("TC-L10: should clear errors when user types in fields", async () => {
    renderDialog();
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    // Trigger validation error
    await userEvent.click(submitButton);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    // Type in email — error should clear
    await userEvent.type(emailInput, "a");
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
  });
});
