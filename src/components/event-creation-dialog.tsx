"use client"

import { auth, db } from "@/firebase/firebaseConfig"; // Add this import
import { collection, doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "./ui/calendar"
import { useToast } from '@/hooks/use-toast';

// Add these functions at the top level of the file
async function createCalendarEvent(event: any, accessToken: string) {
  try {

    const formattedDate = event.date.toISOString().split('T')[0];
    
    // Create a new Date object by combining the formatted date and time
    const startDateTime = new Date(`${formattedDate}T${event.time}`);
    
    // Create end time (1 hour after start time)
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    console.log("date + time", startDateTime)
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: event.title,
          description: event.description,
          start: {
            dateTime: startDateTime.toISOString(),
          },
          end: {
            dateTime:endDateTime.toISOString(), // Add 1 hour
          },
          location: event.venue,
          attendees: event.invitees?.map((email: string) => ({ email })) || [],
        }),
      }
    );
    return response.json();
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

async function syncEventsToGoogleCalendar(userId: string, accessToken: string) {
  try {
    // Get all events from Firestore
    const scheduleRef = doc(db, 'User_Data', userId, 'schedule', 'tasks');
    const scheduleDoc = await getDoc(scheduleRef);
    const tasks = scheduleDoc.exists() ? scheduleDoc.data()?.tasks || [] : [];

    // Get existing calendar events
    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const calendarData = await calendarResponse.json();
    const existingEvents = calendarData.items || [];

    // Sync each task that's not already in Google Calendar
    for (const task of tasks) {
      const eventExists = existingEvents.some(
        (event: any) => 
          event.summary === task.title && 
          event.description === task.description
      );

      if (!eventExists) {
        await createCalendarEvent(task, accessToken);
      }
    }
  } catch (error) {
    console.error('Error syncing events:', error);
    throw error;
  }
}


type EventFormData = {
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  priority: 'low' | 'medium' | 'high';
  type: 'meeting' | 'task';
  invitees: string[];
}

const priorities = ["Low", "Medium", "High"]
const venues = ["Conference Room A", "Conference Room B", "Auditorium", "Cafeteria", "Online"]
const users = [
  { value: "alice", label: "Alice Johnson" },
  { value: "bob", label: "Bob Smith" },
  { value: "charlie", label: "Charlie Brown" },
  { value: "david", label: "David Lee" },
  { value: "emma", label: "Emma Watson" },
]

export function EventCreationDialog() {
  const { toast } = useToast();

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const { control, register, handleSubmit, formState: { errors }, watch } = useForm<EventFormData>()

  const onSubmit = async (data: EventFormData) => {
    try {
      console.log("Form submission started with data:", data);
      const user = auth.currentUser;
      if (!user) {
        console.log("No user found - authentication error");
        toast({
          title: "Error",
          description: "You must be logged in to create events",
          variant: "destructive"
        });
        return;
      }

      const userDocRef = doc(db, 'User_Data', user.uid, 'profile', 'info');
      const userDoc = await getDoc(userDocRef);
      console.log(userDoc)
      const accessToken = userDoc.data()?.accessToken;

      if (!data.date || !data.time || !data.venue || !data.priority || !data.title) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Create the event object
      const eventData = {
        date: data.date,
        time: data.time,
        venue: data.venue,
        priority: data.priority,
        type: data.type,
        title: data.title,
        description: data.description || '', // Provide default empty string if undefined
        invitees: data.invitees || [], // Provide default empty array if undefined
        /* createdAt: new Date().toISOString(),
         createdBy: user.uid,
         status: 'upcoming'*/
      };

      console.log("Sending event data to API:", eventData);

      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      /*
      // Reference to user's schedule document
      const scheduleRef = doc(db, 'User_Data', user.uid, 'schedule', 'tasks');
  
      // Get the current document
      const scheduleDoc = await getDoc(scheduleRef);
  
      if (!scheduleDoc.exists()) {
        // If document doesn't exist, create it with an array containing the new event
        await setDoc(scheduleRef, {
          tasks: [eventData]
        });
      } else {
        // If document exists, update it by adding the new event to the tasks array
        await updateDoc(scheduleRef, {
          tasks: arrayUnion(eventData)
        });
      }
  */
      console.log("API response status:", response.status);
      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to create event');

      }
      console.log("Access token: ", accessToken)
      if (accessToken) {
        await createCalendarEvent(data, accessToken);
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      setOpen(false);
      setStep(1);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
    }
  };
  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new event to your calendar. {step}/3
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {step === 1 && (
              <div className="grid gap-4">
                <Label>Select Date</Label>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <div className="w-full aspect-square">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="w-full h-full rounded-md border flex flex-col [&_.react-calendar__navigation]:h-[15%] [&_.react-calendar__viewContainer]:h-[85%] [&_.react-calendar__month-view]:h-full [&_.react-calendar__month-view__weekdays]:h-[15%] [&_.react-calendar__month-view__days]:h-[85%] [&_.react-calendar__month-view__days]:grid [&_.react-calendar__month-view__days]:grid-cols-7 [&_.react-calendar__month-view__days__day]:h-full [&_.react-calendar__month-view__days__day]:flex [&_.react-calendar__month-view__days__day]:items-center [&_.react-calendar__month-view__days__day]:justify-center [&_.react-calendar__month-view__days__day]:text-sm [&_.react-calendar__navigation__label__labelText]:text-base [&_.react-calendar__navigation_button]:min-w-[30px] [&_.react-calendar__navigation_button]:text-lg"
                      />
                    </div>
                  )}
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register("time", { required: "Time is required" })}
                  />
                  {errors.time && <p className="text-sm text-red-500">{errors.time.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Controller
                    name="venue"
                    control={control}
                    rules={{ required: "Venue is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue" />
                        </SelectTrigger>
                        <SelectContent>
                          {venues.map((venue) => (
                            <SelectItem key={venue} value={venue}>
                              {venue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.venue && <p className="text-sm text-red-500">{errors.venue.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Controller
                    name="priority"
                    control={control}
                    rules={{ required: "Priority is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        {priorities.map((priority) => (
                          <div key={priority} className="flex items-center space-x-2">
                            <RadioGroupItem value={priority} id={priority} />
                            <Label htmlFor={priority}>{priority}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.priority && <p className="text-sm text-red-500">{errors.priority.message}</p>}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter event title"
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Event Description</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    placeholder="Enter event description"
                    className="h-32"
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label>Invite Users</Label>
                  <Controller
                    name="invitees"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-neutral-500 dark:text-neutral-400"
                            )}
                          >
                            {field.value?.length > 0
                              ? `${field.value.length} user(s) selected`
                              : "Select users"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search users..." />
                            <CommandEmpty>No user found.</CommandEmpty>
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user.value}
                                  onSelect={() => {
                                    const currentValues = field.value || []
                                    const newValues = currentValues.includes(user.value)
                                      ? currentValues.filter((value) => value !== user.value)
                                      : [...currentValues, user.value]
                                    field.onChange(newValues)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value?.includes(user.value) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {user.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Controller
                    name="type"
                    control={control}
                    defaultValue="task"
                    render={({ field }) => (
                      <div className="mb-4">
                        <Label htmlFor="type">Event Type</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="task">Task</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />



                </div>

              </div>
            )}
          </div>
          <DialogFooter>
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit">Create Event</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


// export default EventCreationDialog();