
import { EventList } from "@/components/events/EventList";
import { useSearchParams } from "react-router-dom";

export default function EventsPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const query = searchParams.get("q") || "";

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Events</h1>
        <p className="text-muted-foreground">
          Discover events that match your interests
        </p>
      </div>
      <EventList 
        title="" 
        filterBar={true} 
        initialCategory={category}
        initialLocation={location}
        initialQuery={query}
      />
    </div>
  );
}
