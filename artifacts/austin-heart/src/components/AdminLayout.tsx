import { Link, useLocation } from "wouter";
import { useAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink, LayoutDashboard } from "lucide-react";
import { useEffect } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: auth, isLoading } = useAdminMe();
  const logout = useAdminLogout();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !auth?.authenticated) {
      setLocation("/admin/login");
    }
  }, [isLoading, auth, setLocation]);

  if (isLoading || !auth?.authenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/admin/login")
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-gray-50">
      <aside className="w-full md:w-64 bg-white border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-semibold text-primary">CMS Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
            <LayoutDashboard className="w-4 h-4" />
            Pages
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-gray-100"
          >
            <ExternalLink className="w-4 h-4" />
            View Site
          </a>
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout} disabled={logout.isPending}>
            <LogOut className="w-4 h-4 mr-2" />
            {logout.isPending ? "Logging out..." : `Logout (${auth.username})`}
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
