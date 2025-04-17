
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Ticket } from "lucide-react";

export function Hero() {
  return (
    <section className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-event-900 to-event-800 opacity-90" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop')",
          zIndex: -1,
        }}
      />

      {/* Hero Content */}
      <div className="container relative px-4 py-20 md:py-32 md:px-6">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
            Discover and Create Unforgettable Events
          </h1>
          <p className="text-lg text-white/90 md:text-xl">
            Find the best events happening around you or create your own. EventHub makes it easy to
            connect with experiences that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" asChild className="bg-event-600 hover:bg-event-700">
              <Link to="/events">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Explore Events
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Link to="/events/create">
                <Ticket className="mr-2 h-5 w-5" />
                Host an Event
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
