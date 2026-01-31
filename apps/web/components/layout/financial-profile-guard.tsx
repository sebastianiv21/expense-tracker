"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export function FinancialProfileGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Don't check on onboarding page itself to avoid infinite loop
    if (pathname === "/onboarding") {
      setIsChecking(false);
      return;
    }

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
  }, [pathname, router]);

  if (isChecking && pathname !== "/onboarding") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
