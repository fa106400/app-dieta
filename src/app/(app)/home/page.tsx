import { AuthStatus } from "@/components/auth/AuthStatus";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1>Home</h1>
      <br />
      <AuthStatus />
    </main>
  );
}
