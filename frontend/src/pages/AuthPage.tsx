import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "../App";
import { API_URL } from "@/lib/utils";

type Props = {
  onLogin: (token: string, user: User) => void;
};

type Mode = "login" | "register";

export default function AuthPage({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData(e.currentTarget);

    try {
      const endpoint =
        mode === "login" ? `${API_URL}/login` : `${API_URL}/register`;
      const body =
        mode === "login"
          ? { username: data.get("username"), password: data.get("password") }
          : {
              username: data.get("username"),
              display_name: data.get("display_name"),
              email: data.get("email"),
              phone: data.get("phone"),
              birthdate: data.get("birthdate"),
              password: data.get("password"),
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Something went wrong");
        return;
      }

      onLogin(json.token, json.user);
    } catch {
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg" style={{ fontFamily: "Georgia, serif", letterSpacing: "-2px" }}>
            socialapp
          </h1>
          <p className="text-sm text-white/90 mt-1">Share your moments</p>
        </div>
        <Card className="border-0 rounded-lg shadow-2xl bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {mode === "login"
                ? "Log in"
                : "Sign up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="yourname"
                  autoComplete="username"
                  required
                />
              </div>

              {mode === "register" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="display_name">Display name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      placeholder="Your Name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+46701234567"
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="birthdate">Date of birth</Label>
                    <Input
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:opacity-90">
                {loading
                  ? "Loading…"
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              {mode === "login" ? "No account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggle}
                className="font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80"
              >
                {mode === "login" ? "Register" : "Sign in"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
