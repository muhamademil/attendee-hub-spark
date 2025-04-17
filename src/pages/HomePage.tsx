
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeatureSection } from "@/components/home/FeatureSection";
import { EventList } from "@/components/events/EventList";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="container px-4 py-12 md:px-6">
        <EventList title="Upcoming Events" limit={6} />
      </div>
      <Categories />
      <FeatureSection />
      
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Hosting an Event?</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Create your event on EventHub and reach thousands of potential attendees. Our platform provides all the tools you need to manage your event successfully.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/events/create"
                className="inline-flex h-10 items-center justify-center rounded-md bg-event-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-event-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Create an Event
              </a>
              <a
                href="/about"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
