
import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";
import { BarChart, Calendar, FileText, Settings, Users } from "lucide-react";

export function DashboardLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container px-4 py-6 md:px-6 flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <Button
              variant={currentPath === "/dashboard" ? "default" : "ghost"}
              className={
                currentPath === "/dashboard"
                  ? "justify-start"
                  : "justify-start text-muted-foreground"
              }
              asChild
            >
              <Link to="/dashboard">
                <BarChart className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button
              variant={currentPath.includes("/dashboard/events") ? "default" : "ghost"}
              className={
                currentPath.includes("/dashboard/events")
                  ? "justify-start"
                  : "justify-start text-muted-foreground"
              }
              asChild
            >
              <Link to="/dashboard/events">
                <Calendar className="mr-2 h-4 w-4" />
                My Events
              </Link>
            </Button>
            <Button
              variant={currentPath.includes("/dashboard/transactions") ? "default" : "ghost"}
              className={
                currentPath.includes("/dashboard/transactions")
                  ? "justify-start"
                  : "justify-start text-muted-foreground"
              }
              asChild
            >
              <Link to="/dashboard/transactions">
                <FileText className="mr-2 h-4 w-4" />
                Transactions
              </Link>
            </Button>
            <Button
              variant={currentPath.includes("/dashboard/attendees") ? "default" : "ghost"}
              className={
                currentPath.includes("/dashboard/attendees")
                  ? "justify-start"
                  : "justify-start text-muted-foreground"
              }
              asChild
            >
              <Link to="/dashboard/attendees">
                <Users className="mr-2 h-4 w-4" />
                Attendees
              </Link>
            </Button>
            <Button
              variant={currentPath.includes("/dashboard/settings") ? "default" : "ghost"}
              className={
                currentPath.includes("/dashboard/settings")
                  ? "justify-start"
                  : "justify-start text-muted-foreground"
              }
              asChild
            >
              <Link to="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </nav>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
