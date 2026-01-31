"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export function FinancialProfileGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      try {
        await api.get("/financial-profile");
        setIsChecking(false);
      } catch (err: unknown) {
        // If not found (404), redirect to onboarding
        if (err instanceof ApiError && err.status === 404) {
          router.push("/onboarding");
        } else {
          // For other errors, we might want to log or handle them
          console.error("Error checking financial profile:", err);
          setIsChecking(false);
        }
      }
    }

    checkProfile();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
