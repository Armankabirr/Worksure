export type UserRole = "user" | "worker";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string; // plain text for mock only (never do this in real backends)
}

export interface AuthResult {
  token: string;
  user: Omit<MockUser, "password">;
}

const STORAGE_KEY = "mock_users";
const TOKEN_KEY = "mock_token";
const CURRENT_USER_KEY = "mock_current_user";

function loadUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MockUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: MockUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function registerUser(data: Omit<MockUser, "id">): Promise<AuthResult> {
  await delay(600);

  const users = loadUsers();
  const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());

  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const newUser: MockUser = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    ...data,
  };

  users.push(newUser);
  saveUsers(users);

  const authResult: AuthResult = {
    token: `mock-token-${newUser.id}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
  };

  localStorage.setItem(TOKEN_KEY, authResult.token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authResult.user));

  return authResult;
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  await delay(600);

  const users = loadUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const authResult: AuthResult = {
    token: `mock-token-${user.id}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };

  localStorage.setItem(TOKEN_KEY, authResult.token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authResult.user));

  return authResult;
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser():
  | (Omit<MockUser, "password"> & { token: string | null })
  | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as Omit<MockUser, "password">;
    const token = localStorage.getItem(TOKEN_KEY);
    return { ...user, token };
  } catch {
    return null;
  }
}


