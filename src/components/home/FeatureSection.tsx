
import { CalendarCheck, Ticket, Users, BadgePercent } from "lucide-react";

export function FeatureSection() {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Why Choose EventHub?</h2>
          <p className="mt-3 text-muted-foreground">
            The all-in-one platform for event discovery and management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 rounded-full bg-event-100 flex items-center justify-center mb-4">
              <CalendarCheck className="h-6 w-6 text-event-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Event Discovery</h3>
            <p className="text-muted-foreground">
              Find events that match your interests with powerful search and filtering options.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 rounded-full bg-event-100 flex items-center justify-center mb-4">
              <Ticket className="h-6 w-6 text-event-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seamless Ticketing</h3>
            <p className="text-muted-foreground">
              Purchase and manage your tickets in one place with secure transactions.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 rounded-full bg-event-100 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-event-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Organizer Tools</h3>
            <p className="text-muted-foreground">
              Powerful dashboard for event creators to manage events, attendees, and analytics.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="h-12 w-12 rounded-full bg-event-100 flex items-center justify-center mb-4">
              <BadgePercent className="h-6 w-6 text-event-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rewards Program</h3>
            <p className="text-muted-foreground">
              Earn points and use referrals to get discounts on future event tickets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
