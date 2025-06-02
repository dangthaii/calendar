"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Calendar from "@/components/Calendar";
import { Toaster } from "@/components/ui/toaster";
import { useCurrentUser, useLogout } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: logout } = useLogout();

  const handleLogout = async () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Calendar App</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="calendar-wrapper">
        {user ? (
          <Calendar userId={user.id} />
        ) : (
          <div className="text-center p-8">
            <p>Please log in to view and manage your calendar events.</p>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
}
