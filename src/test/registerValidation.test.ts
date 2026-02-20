import { describe, it, expect } from "vitest";

// Test the validation logic from RegisterDialog independently
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{8,}$/;

interface Step1Data {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Step3Data {
  name: string;
  phone: string;
  role: string;
}

function validateStep1(data: Step1Data): Record<string, string> {
  const e: Record<string, string> = {};
  if (!data.email.trim()) e.email = "Email is required.";
  else if (!emailRegex.test(data.email.trim()))
    e.email = "Please enter a valid email.";
  if (!data.password) e.password = "Password is required.";
  else if (!passwordRegex.test(data.password))
    e.password = "Password must be at least 8 characters.";
  if (!data.confirmPassword)
    e.confirmPassword = "Please confirm your password.";
  else if (data.password !== data.confirmPassword)
    e.confirmPassword = "Passwords do not match.";
  return e;
}

function validateStep2(otp: string): Record<string, string> {
  const e: Record<string, string> = {};
  const t = otp.trim();
  if (!t) e.otp = "Enter the 6-digit verification code from your email.";
  else if (t.length !== 6) e.otp = "Code must be exactly 6 digits.";
  return e;
}

function validateStep3(data: Step3Data): Record<string, string> {
  const e: Record<string, string> = {};
  if (!data.name.trim()) e.name = "Name is required.";
  if (!data.phone.trim()) e.phone = "Phone is required.";
  if (!data.role) e.role = "Please select a role.";
  return e;
}

describe("RegisterDialog - Step 1 Validation", () => {
  it("TC-R01: should pass with valid email, password, and confirm password", () => {
    const errors = validateStep1({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("TC-R02: should fail when email is empty", () => {
    const errors = validateStep1({
      email: "",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(errors.email).toBe("Email is required.");
  });

  it("TC-R03: should fail when email is invalid", () => {
    const errors = validateStep1({
      email: "not-an-email",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(errors.email).toBe("Please enter a valid email.");
  });

  it("TC-R04: should fail when password is empty", () => {
    const errors = validateStep1({
      email: "user@example.com",
      password: "",
      confirmPassword: "",
    });
    expect(errors.password).toBe("Password is required.");
  });

  it("TC-R05: should fail when password is less than 8 characters", () => {
    const errors = validateStep1({
      email: "user@example.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(errors.password).toBe("Password must be at least 8 characters.");
  });

  it("TC-R06: should fail when passwords don't match", () => {
    const errors = validateStep1({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "different456",
    });
    expect(errors.confirmPassword).toBe("Passwords do not match.");
  });

  it("TC-R07: should fail when confirmPassword is empty", () => {
    const errors = validateStep1({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "",
    });
    expect(errors.confirmPassword).toBe("Please confirm your password.");
  });

  it("TC-R08: should return multiple errors for all empty fields", () => {
    const errors = validateStep1({
      email: "",
      password: "",
      confirmPassword: "",
    });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
    expect(errors.confirmPassword).toBeDefined();
  });

  it("TC-R09: should trim whitespace from email before validation", () => {
    const errors = validateStep1({
      email: "  user@example.com  ",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe("RegisterDialog - Step 2 (OTP) Validation", () => {
  it("TC-R10: should pass with a valid 6-digit OTP", () => {
    const errors = validateStep2("123456");
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("TC-R11: should fail when OTP is empty", () => {
    const errors = validateStep2("");
    expect(errors.otp).toContain("6-digit verification code");
  });

  it("TC-R12: should fail when OTP is less than 6 digits", () => {
    const errors = validateStep2("12345");
    expect(errors.otp).toBe("Code must be exactly 6 digits.");
  });

  it("TC-R13: should fail when OTP is more than 6 digits", () => {
    const errors = validateStep2("1234567");
    expect(errors.otp).toBe("Code must be exactly 6 digits.");
  });

  it("TC-R14: should trim whitespace from OTP", () => {
    const errors = validateStep2("  123456  ");
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe("RegisterDialog - Step 3 (Profile) Validation", () => {
  it("TC-R15: should pass with valid name, phone, and role", () => {
    const errors = validateStep3({
      name: "John Doe",
      phone: "+880 1712-345678",
      role: "user",
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("TC-R16: should fail when name is empty", () => {
    const errors = validateStep3({
      name: "",
      phone: "+880 1712-345678",
      role: "user",
    });
    expect(errors.name).toBe("Name is required.");
  });

  it("TC-R17: should fail when phone is empty", () => {
    const errors = validateStep3({
      name: "John Doe",
      phone: "",
      role: "user",
    });
    expect(errors.phone).toBe("Phone is required.");
  });

  it("TC-R18: should fail when role is not selected", () => {
    const errors = validateStep3({
      name: "John Doe",
      phone: "+880 1712-345678",
      role: "",
    });
    expect(errors.role).toBe("Please select a role.");
  });

  it("TC-R19: should return all errors when all fields empty", () => {
    const errors = validateStep3({ name: "", phone: "", role: "" });
    expect(errors.name).toBeDefined();
    expect(errors.phone).toBeDefined();
    expect(errors.role).toBeDefined();
  });
});
