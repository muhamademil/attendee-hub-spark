
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";

const eventFormSchema = z.object({
  name: z.string().min(5, "Event name must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  startDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, "Start date must be in the future"),
  endDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Please enter a valid end date"),
  totalSeats: z.coerce.number().min(1, "Total seats must be at least 1"),
  isFree: z.boolean().default(false),
  price: z.coerce.number().min(0, "Price must be a positive number").optional(),
  image: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function CreateEventPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { createEvent } = useEvents();
  const { user, isAuthenticated, isOrganizer } = useAuth();
  const navigate = useNavigate();

  // Check if user is logged in and is an organizer
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!isOrganizer) {
    navigate("/");
    toast.error("Only organizers can create events");
    return null;
  }

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      category: "",
      startDate: "",
      endDate: "",
      totalSeats: 100,
      isFree: false,
      price: 0,
      image: "",
    },
  });

  const isFree = form.watch("isFree");

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    try {
      // Format the dates
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      // Check if end date is after start date
      if (endDate < startDate) {
        toast.error("End date must be after start date");
        setIsLoading(false);
        return;
      }

      // Create event object
      const eventData = {
        name: data.name,
        description: data.description,
        location: data.location,
        category: data.category,
        startDate,
        endDate,
        totalSeats: data.totalSeats,
        isFree: data.isFree,
        price: data.isFree ? 0 : (data.price || 0),
        image: data.image,
      };

      // Submit the event
      const event = await createEvent(eventData);
      toast.success("Event created successfully");
      navigate(`/events/${event.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-10 px-4 md:px-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details to create your event
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Tech Conference 2025" {...field} />
                </FormControl>
                <FormDescription>
                  A catchy name will attract more attendees
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your event in detail..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include details about what attendees can expect
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Jakarta Convention Center" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Networking">Networking</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="totalSeats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Seats</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Free Event</FormLabel>
                    <FormDescription>
                      Toggle if this is a free event
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {!isFree && (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (IDR)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="500000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the price in Indonesian Rupiah (without commas)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a URL for your event image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full md:w-auto bg-event-600 hover:bg-event-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
