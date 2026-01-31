import Link from "next/link";
import { Tag, ChevronRight, Settings, User, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Financial Management</CardTitle>
            <CardDescription>Configure how you track your spending.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1 px-2">
            <Link 
              href="/categories" 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Categories</div>
                  <div className="text-xs text-muted-foreground">Manage your income and expense categories</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link 
              href="/insights" 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Insights</div>
                  <div className="text-xs text-muted-foreground">Detailed financial analysis and charts</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Account</CardTitle>
            <CardDescription>Personal details and security.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1 px-2">
            <div className="flex items-center justify-between p-3 rounded-lg opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Personal Info</div>
                  <div className="text-xs text-muted-foreground">Update your name and email</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted text-muted-foreground">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Preferences</div>
                  <div className="text-xs text-muted-foreground">Currency and display settings</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
