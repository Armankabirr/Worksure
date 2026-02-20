import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServiceCard from "@/components/ServiceCard";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockOpenLogin = vi.fn();
let mockIsAuthenticated = false;

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    openLogin: mockOpenLogin,
  }),
}));

const defaultProps = {
  image: "/test-image.jpg",
  title: "Electrician Service",
  description: "Professional electrical services for your home.",
  alt: "Electrician working",
};

describe("ServiceCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
  });

  it("TC-S01: should render service card with title", () => {
    render(<ServiceCard {...defaultProps} />);
    expect(screen.getByText("Electrician Service")).toBeInTheDocument();
  });

  it("TC-S02: should render service card with description", () => {
    render(<ServiceCard {...defaultProps} />);
    expect(
      screen.getByText("Professional electrical services for your home.")
    ).toBeInTheDocument();
  });

  it("TC-S03: should render the image with correct alt text", () => {
    render(<ServiceCard {...defaultProps} />);
    const img = screen.getByRole("img", { name: "Electrician working" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-image.jpg");
  });

  it("TC-S04: should render 'Get Start' button", () => {
    render(<ServiceCard {...defaultProps} />);
    expect(screen.getByText("Get Start")).toBeInTheDocument();
  });

  it("TC-S05: should open login dialog when unauthenticated user clicks button", async () => {
    mockIsAuthenticated = false;
    render(<ServiceCard {...defaultProps} />);

    await userEvent.click(screen.getByText("Get Start"));

    expect(mockOpenLogin).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("TC-S06: should navigate to /profile when authenticated user clicks button", async () => {
    mockIsAuthenticated = true;
    render(<ServiceCard {...defaultProps} />);

    await userEvent.click(screen.getByText("Get Start"));

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
    expect(mockOpenLogin).not.toHaveBeenCalled();
  });

  it("TC-S07: should render with different props correctly", () => {
    render(
      <ServiceCard
        image="/cleaning.jpg"
        title="Cleaning Service"
        description="Deep cleaning for offices."
        alt="Cleaning team"
      />
    );
    expect(screen.getByText("Cleaning Service")).toBeInTheDocument();
    expect(screen.getByText("Deep cleaning for offices.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Cleaning team" })).toBeInTheDocument();
  });
});
