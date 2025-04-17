
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon, TicketIcon, User, Clock, Star } from "lucide-react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { formatToIDR } from "@/utils/format";
import { formatDateTime, formatDateRange } from "@/utils/date";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { getEventById, getEventReviews, createTransaction } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Get event and reviews
  const event = getEventById(id || "");
  const reviews = getEventReviews(id || "");

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  if (!event) {
    return (
      <div className="container py-10 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="mt-4">The event you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" onClick={() => navigate("/events")}>
          Browse Events
        </Button>
      </div>
    );
  }

  // Handle booking
  const handleBookTicket = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book tickets");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      await createTransaction(event.id, 1);
      navigate(`/checkout/${event.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Event Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop"}
              alt={event.name}
              className="w-full aspect-video object-cover"
            />
            {event.isFree ? (
              <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                Free
              </Badge>
            ) : (
              <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                {formatToIDR(event.price)}
              </Badge>
            )}
          </div>

          {/* Event Details */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{formatDateRange(event.startDate, event.endDate)}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <User className="h-5 w-5 mr-2" />
                <span>By {event.organizerName}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <TicketIcon className="h-5 w-5 mr-2" />
                <span>{event.availableSeats} seats available</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="pt-4">
              <div className="prose max-w-none">
                <p>{event.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 mt-1 text-event-600" />
                    <div>
                      <div className="font-medium">Doors Open</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(event.startDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 mt-1 text-event-600" />
                    <div>
                      <div className="font-medium">Event Ends</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(event.endDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-4">
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {averageRating.toFixed(1)} out of 5
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>
                              {review.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground pl-10">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No reviews yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Ticket Booking */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book Tickets</CardTitle>
              <CardDescription>
                Secure your spot for this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Price</span>
                  <span className="font-semibold">
                    {event.isFree ? "Free" : formatToIDR(event.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Available Seats</span>
                  <span className="font-semibold">{event.availableSeats}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    {event.isFree ? "Free" : formatToIDR(event.price)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-event-600 hover:bg-event-700" 
                onClick={handleBookTicket}
                disabled={isLoading || event.availableSeats <= 0}
              >
                {isLoading 
                  ? "Processing..." 
                  : event.availableSeats <= 0 
                    ? "Sold Out" 
                    : "Book Now"}
              </Button>
            </CardFooter>
          </Card>

          {/* Organizer Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarFallback>{event.organizerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.organizerName}</p>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
