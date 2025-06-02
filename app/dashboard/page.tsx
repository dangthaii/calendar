"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Calendar from "@/components/Calendar";
import { Toaster } from "@/components/ui/toaster";
import { useCurrentUser, useLogout } from "@/lib/hooks/useAuth";
import "./styles.css";

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
    <div className="container mx-auto py-4 px-4 md:px-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendar App</h1>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-block text-sm text-gray-600">
            {user?.name || "Guest"}
          </span>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-gray-700 hover:text-gray-900"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="calendar-wrapper">
          {user ? (
            <Calendar userId={user.id} />
          ) : (
            <div className="text-center p-8">
              <p>Please log in to view and manage your calendar events.</p>
            </div>
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
}
