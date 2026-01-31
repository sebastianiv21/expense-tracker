"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, PiggyBank, Target, Zap } from "lucide-react";
import { createFinancialProfileSchema } from "@repo/shared";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api-client";

type FormValues = {
  monthlyIncomeTarget: number;
  needsPercentage: number;
  wantsPercentage: number;
  futurePercentage: number;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFinancialProfileSchema) as any,
    defaultValues: {
      monthlyIncomeTarget: 0,
      needsPercentage: 50,
      wantsPercentage: 30,
      futurePercentage: 20,
    },
  });

  useEffect(() => {
    async function checkExisting() {
      try {
        await api.get("/financial-profile");
        router.push("/");
      } catch {
        setIsChecking(false);
      }
    }
    checkExisting();
  }, [router]);

  const needs = form.watch("needsPercentage") || 0;
  const wants = form.watch("wantsPercentage") || 0;
  const future = form.watch("futurePercentage") || 0;
  const total = Number(needs) + Number(wants) + Number(future);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await api.post("/financial-profile", values);
      toast.success("Profile created successfully!");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof ApiError ? err.message : "Failed to create profile";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-125">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Welcome! Let&apos;s set your budget
          </CardTitle>
          <CardDescription className="text-center">
            Configure your monthly income target and how you want to allocate it
            using the 50/30/20 rule.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="monthlyIncomeTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income Target</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">
                          $
                        </span>
                        <Input
                          placeholder="5000"
                          type="number"
                          className="pl-7"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is the amount you plan to earn each month.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="needsPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        Needs
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wantsPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-500" />
                        Wants
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="futurePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <PiggyBank className="h-4 w-4 text-green-500" />
                        Future
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Total Allocation:</span>
                <span
                  className={`text-sm font-bold ${Math.abs(total - 100) < 0.01 ? "text-green-600" : "text-destructive"}`}
                >
                  {total}%
                </span>
              </div>
              {Math.abs(total - 100) >= 0.01 && (
                <p className="text-[0.8rem] font-medium text-destructive text-center">
                  Percentages must sum to exactly 100%
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                type="submit"
                disabled={isLoading || Math.abs(total - 100) >= 0.01}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
