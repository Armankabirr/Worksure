import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer Component", () => {
  it("TC-F01: should render the brand name 'WorkSure'", () => {
    render(<Footer />);
    expect(screen.getByText("WorkSure")).toBeInTheDocument();
  });

  it("TC-F02: should render company description", () => {
    render(<Footer />);
    expect(
      screen.getByText(/We are the best place to get quality services/i)
    ).toBeInTheDocument();
  });

  it("TC-F03: should render Company section links", () => {
    render(<Footer />);
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Our Team")).toBeInTheDocument();
  });

  it("TC-F04: should render Know More section links", () => {
    render(<Footer />);
    expect(screen.getByText("Know More")).toBeInTheDocument();
    expect(screen.getByText("Our Story")).toBeInTheDocument();
    expect(screen.getByText("FAQs")).toBeInTheDocument();
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  });

  it("TC-F05: should render Newsletter section with email input", () => {
    render(<Footer />);
    expect(screen.getByText("Newsletter")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("TC-F06: should render copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2026 WorkSure. All Rights Reserved/i)
    ).toBeInTheDocument();
  });

  it("TC-F07: should render the email input with correct type", () => {
    render(<Footer />);
    const emailInput = screen.getByPlaceholderText("Email Address");
    expect(emailInput).toHaveAttribute("type", "email");
  });
});
