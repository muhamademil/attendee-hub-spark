
import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, ArrowRight, TicketIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { formatToIDR } from "@/utils/format";
import { formatDateRange, isEventLive, isEventUpcoming } from "@/utils/date";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isLive = isEventLive(event.startDate, event.endDate);
  const isUpcoming = isEventUpcoming(event.startDate);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2670&auto=format&fit=crop"}
          alt={event.name}
          className="aspect-video w-full object-cover"
        />
        {isLive && (
          <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
            Live
          </Badge>
        )}
        {isUpcoming && !isLive && (
          <Badge className="absolute top-2 right-2 bg-event-500 text-white">
            Upcoming
          </Badge>
        )}
        {event.isFree ? (
          <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">
            Free
          </Badge>
        ) : (
          <Badge className="absolute bottom-2 left-2 bg-blue-600 text-white">
            {formatToIDR(event.price)}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.name}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>{formatDateRange(event.startDate, event.endDate)}</span>
          </div>
          <div className="flex items-start">
            <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-start">
            <TicketIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>{event.availableSeats} seats available</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">By {event.organizerName}</span>
        <Button size="sm" asChild>
          <Link to={`/events/${event.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
