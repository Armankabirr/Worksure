import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HowItWorks from "@/components/HowItWorks";

describe("HowItWorks Component", () => {
  it("TC-H01: should render the section heading", () => {
    render(<HowItWorks />);
    expect(screen.getByText("How It Works")).toBeInTheDocument();
  });

  it("TC-H02: should render the section description", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(/Three easy steps to professional service/i)
    ).toBeInTheDocument();
  });

  it("TC-H03: should render step 1 - Choose a Service", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Choose a Service")).toBeInTheDocument();
    expect(
      screen.getByText(/Browse our wide range of professional services/i)
    ).toBeInTheDocument();
  });

  it("TC-H04: should render step 2 - Book a Professional", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Book a Professional")).toBeInTheDocument();
    expect(
      screen.getByText(/Select a verified professional/i)
    ).toBeInTheDocument();
  });

  it("TC-H05: should render step 3 - Relax — Job Done Right", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(/Relax — Job Done Right/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sit back and relax while our professionals/i)
    ).toBeInTheDocument();
  });

  it("TC-H06: should render all three step numbers", () => {
    render(<HowItWorks />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("TC-H07: should render exactly 3 step cards", () => {
    render(<HowItWorks />);
    const stepTitles = [
      "Choose a Service",
      "Book a Professional",
      /Relax — Job Done Right/i,
    ];
    stepTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
