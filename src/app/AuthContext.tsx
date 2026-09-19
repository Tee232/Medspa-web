import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { UserRole } from "@/components/shared/Sidebar";

export interface NotificationPreferences {
  appointmentUpdates: boolean;
  schedulingAlerts: boolean;
  aiInsights: boolean;
  clientActivity: boolean;
}

export interface MockUser {
  id?: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatarUrl?: string;
  notificationPreferences: NotificationPreferences;
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  phone: string;
}

interface AuthContextValue {
  user: MockUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<void>;
  signup: (name: string, email: string, role: UserRole, password?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateProfile: (input: UpdateProfileInput) => void;
  updateNotificationPreferences: (prefs: NotificationPreferences) => void;
  updateAvatar: (imageUrl: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_PREFERENCES: NotificationPreferences = {
  appointmentUpdates: true,
  schedulingAlerts: true,
  aiInsights: true,
  clientActivity: false,
};

const STORAGE_KEY = "lumiere_medspa_user";

const DEFAULT_USERS: Record<UserRole, MockUser> = {
  front_desk: {
    id: "usr_fd_1",
    name: "Julia Reeves",
    role: "front_desk",
    email: "julia@lumieremedspa.com",
    phone: "(310) 555-0199",
    notificationPreferences: DEFAULT_PREFERENCES,
  },
  manager: {
    id: "usr_mg_1",
    name: "Daniel Osei",
    role: "manager",
    email: "daniel@lumieremedspa.com",
    phone: "(310) 555-0344",
    notificationPreferences: DEFAULT_PREFERENCES,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback to null on storage error
    }
    // Default logged in user for seamless initial demo, can logout anytime
    return DEFAULT_USERS.front_desk;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage write errors
    }
  }, [user]);

  async function login(email: string, _password?: string, role: UserRole = "front_desk") {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600)); // Simulate async auth

    // Check if email matches existing demo user
    const foundRole = (Object.keys(DEFAULT_USERS) as UserRole[]).find(
      (r) => DEFAULT_USERS[r].email.toLowerCase() === email.toLowerCase()
    );

    const newUser: MockUser = foundRole
      ? { ...DEFAULT_USERS[foundRole] }
      : {
          id: `usr_${Date.now()}`,
          name: email.split("@")[0].replace(".", " ").replace(/^./, (c) => c.toUpperCase()),
          email,
          role,
          phone: "(310) 555-0100",
          notificationPreferences: DEFAULT_PREFERENCES,
        };

    setUser(newUser);
    setIsLoading(false);
  }

  async function signup(name: string, email: string, role: UserRole, _password?: string) {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    const newUser: MockUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      phone: "(310) 555-0100",
      notificationPreferences: DEFAULT_PREFERENCES,
    };

    setUser(newUser);
    setIsLoading(false);
  }

  async function forgotPassword(_email: string) {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
  }

  async function resetPassword(_newPassword: string) {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  function setRole(role: UserRole) {
    setUser((u) => {
      if (!u) return DEFAULT_USERS[role];
      const template = DEFAULT_USERS[role];
      return {
        ...u,
        role,
        name: u.name === "Julia Reeves" || u.name === "Daniel Osei" || u.name === "Dr. Sarah Lin" ? template.name : u.name,
        email: u.email.includes("@lumieremedspa.com") ? template.email : u.email,
      };
    });
  }

  function updateProfile({ name, email, phone }: UpdateProfileInput) {
    setUser((u) => (u ? { ...u, name, email, phone } : null));
  }

  function updateNotificationPreferences(prefs: NotificationPreferences) {
    setUser((u) => (u ? { ...u, notificationPreferences: prefs } : null));
  }

  function updateAvatar(imageUrl: string) {
    setUser((u) => (u ? { ...u, avatarUrl: imageUrl } : null));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        forgotPassword,
        resetPassword,
        logout,
        setRole,
        updateProfile,
        updateNotificationPreferences,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

