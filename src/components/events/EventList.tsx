
import { useState, useEffect } from "react";
import { useEvents } from "@/context/EventContext";
import { Event } from "@/types";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface EventListProps {
  title?: string;
  limit?: number;
  filterBar?: boolean;
  initialCategory?: string;
  initialLocation?: string;
  initialQuery?: string;
}

export function EventList({ 
  title = "Events", 
  limit, 
  filterBar = false,
  initialCategory = '',
  initialLocation = '',
  initialQuery = ''
}: EventListProps) {
  const { events, searchEvents } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);

  // Get unique categories and locations for filters
  const categories = Array.from(new Set(events.map(event => event.category)));
  const locations = Array.from(new Set(events.map(event => event.location)));

  // Filter events based on search and filters
  useEffect(() => {
    const results = searchEvents(debouncedQuery, category || undefined, location || undefined);
    setFilteredEvents(results);
  }, [debouncedQuery, category, location, events, searchEvents]);

  // Display limited number of events if limit is provided
  const displayEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
      
      {filterBar && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:w-2/5">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {displayEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters to find events.
          </p>
        </div>
      )}

      {limit && filteredEvents.length > limit && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" asChild>
            <a href="/events">View All Events</a>
          </Button>
        </div>
      )}
    </div>
  );
}
