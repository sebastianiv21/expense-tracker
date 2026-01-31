"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient, signOut } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/login");
          },
        },
      });
    } catch (err) {
      toast.error("Failed to log out");
    }
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Profile
            </CardTitle>
            <CardDescription>
              Your account details from Better Auth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <span className="font-medium text-muted-foreground">Name</span>
              <span className="col-span-2 font-semibold">
                {session?.user?.name}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <span className="font-medium text-muted-foreground">Email</span>
              <span className="col-span-2">{session?.user?.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="font-medium text-muted-foreground">User ID</span>
              <span className="col-span-2 text-xs font-mono text-muted-foreground break-all">
                {session?.user?.id}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Now that authentication is working, we can proceed to Phase 4:
                Core Layout & Navigation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
