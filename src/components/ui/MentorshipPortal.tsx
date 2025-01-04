
'use client';

import React, { useMemo } from 'react';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { auth } from '@/firebase/firebaseConfig';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  MessageSquare,
  User,
  Users,
  Video,
  Menu,
  Settings,
  MonitorUp,
  Mic,
  MonitorOff,
  MicOff,
  Activity,
  VideoOff,
  PhoneOff,
  Check,
  ArrowUp,
  PenSquare,
  Send,
  ImageIcon,
  Play,
  Github,
  Link,
  Linkedin,
  Star,
  Twitter,
  Hash,
  Moon,
  Sun,
  LogOut,
  Bell,
  BellRing,
  MoreVertical,
  Plus,
  Mail,
  Eye,
  Pencil,
  Settings2,
  Trash2,
  Paperclip,
  Phone,
  CheckCheck,
  Search,
  Archive,
  Trash,
  UserPlus,
  MapPin,
  Globe,
  CheckCircle2,
  Trophy,
  Target,
  Wrench,
  Save,
  Instagram,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Upload,
  MonitorPlay,
  Heart,
  MessageCircle,
  Share,
  Forward,
  ReplyIcon,
  X,
  Filter,
  Palette,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  Calendar,
  Inbox,
  Users2,
  FileText,
  Music,
  Youtube,
  ThumbsUp,
  ThumbsDown,
  Download,
  Subtitles,
  ArrowUpDown,
  BarChart2,
  Repeat,
  Share2,
  Bookmark,
  MoreHorizontal
} from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Label, DropdownMenuSeparator, RadioGroup } from '@radix-ui/react-dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { toast } from '@/hooks/use-toast';
import { Textarea } from './textarea';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from './menubar';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import Marquee from './marquee';
import SpacesView from './chatView';
import { EmailDialog } from '../email-dialog';
import { ActivityDialog } from '../activity-dialog'
import { EventCreationDialog } from '../event-creation-dialog'
import { ViewCollectionsDialog } from '../view-collections-dialog';
import { ResourceCreationDialog } from '../resource-creation-dialog';

interface Task {
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'completed';
  type: 'meeting' | 'task';
  invitees: string[];
  createdAt: string;
  createdBy: string;
}

const DashboardView = () => {
  const [selectedChat, setSelectedChat] = useState({
    name: "John Doe",
    avatar: "/avatars/john.jpg",
    lastMessage: "Thanks for the help!",
    lastMessageTime: "2:30 PM"
  });

  const [messages, setMessages] = useState([
  ]);

  const cohortMembers = [
    {
      name: "Sarah Wilson",
      avatar: "/avatars/sarah.jpg",
      email: "sarah@example.com"
    },
    {
      name: "Mike Johnson",
      avatar: "/avatars/mike.jpg",
      email: "mike@example.com"
    },
    {
      name: "Emily Brown",
      avatar: "/avatars/emily.jpg",
      email: "emily@example.com"
    }
  ];

  const upcomingEvent = {
    name: "Weekly Mentorship Session",
    description: "Group discussion on advanced React patterns",
    startTime: "3:00 PM",
    duration: "1 hour",
    date: "Oct 15, 2023",
    attendees: cohortMembers
  };

  return (
    <div className="h-screen pt-16 px-6">
      <Card className="mb-6">
        <CardHeader className="py-4 flex flex-col items-center text-center">
          <CardTitle className="text-2xl">
            {(() => {
              const { auth } = require('@/firebase/firebaseConfig');
              const [firstName, setFirstName] = useState('');

              useEffect(() => {
                const unsubscribe = auth.onAuthStateChanged(async (user: { displayName: string; }) => {
                  if (user) {
                    // Get user's display name and split to get first name
                    const displayName = user.displayName || '';
                    const firstName = displayName.split(' ')[0];
                    setFirstName(firstName);
                  }
                });

                return () => unsubscribe();
              }, []);

              const hour = new Date().getHours();
              let greeting = '';
              if (hour < 12) greeting = 'Good morning';
              else if (hour < 17) greeting = 'Good afternoon';
              else greeting = 'Good evening';

              return `${greeting}, ${firstName || 'there'}!`
            })()}
          </CardTitle>
          <CardDescription className="text-base">
            Welcome to your mentorship dashboard
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-160px)]">
        <Card className="col-span-2 h-full">
          {(() => {
            const [currentView, setCurrentView] = useState<'inbox' | 'activity'>('activity');
            const [activityFeed] = useState([
              {
                id: 1,
                user: "Alex Thompson",
                action: "shared a resource",
                content: "Check out this great article on React performance optimization!",
                timestamp: "2 hours ago"
              },
              {
                id: 2,
                user: "Maria Garcia",
                action: "completed a milestone",
                content: "Just finished the Advanced React Patterns module!",
                timestamp: "4 hours ago"
              },
              {
                id: 3,
                user: "James Wilson",
                action: "asked a question",
                content: "Has anyone worked with GraphQL subscriptions?",
                timestamp: "Yesterday"
              }
            ]);

            const [messages] = useState([
              {
                id: 1,
                from: "Sarah Chen",
                subject: "Weekly Mentoring Session",
                preview: "Hi! Just wanted to confirm our mentoring session for tomorrow at 2pm...",
                timestamp: "10:30 AM",
                unread: true
              },
              {
                id: 2,
                from: "David Kumar",
                subject: "Code Review Request",
                preview: "Could you take a look at my latest PR when you have a chance?",
                timestamp: "Yesterday",
                unread: false
              },
              {
                id: 3,
                from: "Lisa Park",
                subject: "Resource Recommendation",
                preview: "Based on our last discussion, I think you'll find this tutorial helpful...",
                timestamp: "2 days ago",
                unread: false
              }
            ]);


            return (
              <>
                <CardHeader className="py-4 pt-10">
                  <div className="mb-4 px-2 text-center">
                    <div className="flex justify-center gap-4 mb-4">
                      <Button
                        variant={currentView === 'activity' ? 'default' : 'outline'}
                        onClick={() => setCurrentView('activity')}
                        className="w-48"
                      >
                        <Activity className="h-5 w-5 mr-2" />
                        Activity Feed
                      </Button>
                      <Button
                        variant={currentView === 'inbox' ? 'default' : 'outline'}
                        onClick={() => setCurrentView('inbox')}
                        className="w-48"
                      >
                        <Inbox className="h-5 w-5 mr-2" />
                        Inbox
                      </Button>
                    </div>
                  </div>

                  {currentView === 'inbox' ? (
                    <Card className="p-4">
                      <div className="px-2">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 flex space-x-3">
                            <Input placeholder="Search emails..." className="max-w-md" />
                            <Button variant="outline" className="px-4">
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                          </div>
                          <div className='px-4'>
                            <EmailDialog />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-4">
                      <div className="px-2">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 flex space-x-3">
                            <Input placeholder="Search activities..." className="max-w-md" />
                            <Button variant="outline" className="px-4">
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                          </div>
                          <div className='px-4'>
                            <ActivityDialog />
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </CardHeader>

                <CardContent className="p-6 h-[calc(100vh-100px)]">
                  <Card className="h-full">
                    <div className="h-full flex flex-col">
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4 pr-4">
                          {currentView === 'inbox' ? (
                            <>
                              {messages.map(msg => (
                                <Dialog key={msg.id}>
                                  <DialogTrigger asChild>
                                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                                      <CardContent className="p-5">
                                        <div className="grid grid-cols-[80px_1fr] gap-4">
                                          <div className="flex items-center justify-center">
                                            <Avatar className="h-12 w-12">
                                              <AvatarFallback>{msg.from[0]}</AvatarFallback>
                                            </Avatar>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-1">
                                              <p className="font-medium text-base truncate">{msg.from}</p>
                                              <span className="text-sm text-muted-foreground">{msg.timestamp}</span>
                                            </div>
                                            <p className="text-sm font-medium mb-1">{msg.subject}</p>
                                            <p className="text-sm text-muted-foreground truncate">{msg.preview}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[525px]">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback>{msg.from[0]}</AvatarFallback>
                                        </Avatar>
                                        {msg.from}
                                      </DialogTitle>
                                      <DialogDescription className="text-sm text-muted-foreground">
                                        {msg.timestamp}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      <p className="font-medium mb-2">{msg.subject}</p>
                                      <p className="text-base">{msg.preview}</p>
                                    </div>
                                    <DialogFooter className="mt-6">
                                      <Button>Reply</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              ))}
                            </>
                          ) : (
                            <>
                              {activityFeed.map((activity) => (
                                <Card key={activity.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                  <CardContent className="p-5">
                                    <div className="flex gap-4">
                                      <Avatar className="h-12 w-12">
                                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                          <p className="font-medium">{activity.user}</p>
                                          <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                                        </div>
                                        <p className="text-sm">{activity.action}</p>
                                        {activity.content && (
                                          <Card className="mt-2 p-3 bg-muted">
                                            <p className="text-sm">{activity.content}</p>
                                          </Card>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </Card>
                </CardContent>
                <div className="h-[calc(100vh-var(--header-height)-2rem)]">
                  <CardFooter className="p-4 flex justify-center">
                    <Card className="p-4">
                      <div className="px-2">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Card className="p-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Last Updated: {new Date().toLocaleTimeString()}</span>
                            </div>
                          </Card>
                          <Card className="p-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {currentView === 'inbox' ? '3 unread messages' : '5 new activities'}
                              </span>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </Card>
                  </CardFooter>
                </div>
              </>
            );
          })()}
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Cohort Section */}
          <Card>
            <CardHeader className="py-4">
              <div className="flex items-center justify-center gap-2">
                <Card className="p-2 w-full">
                  <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                    <Users2 className="h-5 w-5" />
                    Cohort
                  </CardTitle>
                </Card>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] px-4">
                <div className="space-y-3 py-4">
                  <Card className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 shadow-sm">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">Active Members</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="relative">
                    <div className="space-y-2">
                      {[
                        {
                          name: "Sarah Johnson",
                          email: "sarah.j@example.com",
                          avatar: "/avatars/sarah.png"
                        },
                        {
                          name: "Michael Chen",
                          email: "m.chen@example.com",
                          avatar: "/avatars/michael.png"
                        },
                        {
                          name: "Emma Wilson",
                          email: "emma.w@example.com",
                          avatar: "/avatars/emma.png"
                        },
                        {
                          name: "James Rodriguez",
                          email: "james.r@example.com",
                          avatar: "/avatars/james.png"
                        },
                        {
                          name: "Sophia Lee",
                          email: "sophia.l@example.com",
                          avatar: "/avatars/sophia.png"
                        },
                        {
                          name: "David Kim",
                          email: "david.k@example.com",
                          avatar: "/avatars/david.png"
                        },
                        ...cohortMembers
                      ].map((member, i) => (
                        <Dialog key={i}>
                          <DialogTrigger asChild>
                            <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium text-sm mb-1">{member.name}</p>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {member.email}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Send Message</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm font-medium">Message</div>
                                <Textarea id="message" placeholder="Type your message here..." />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button>Send Message</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </Card>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Event Section */}
          <Card>
            <div className="flex justify-center">
              <CardHeader className="py-4 text-center">
                <div>
                  <Card className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Event
                    </CardTitle>
                  </Card>
                </div>
              </CardHeader>
            </div>
            <CardContent className="space-y-4 p-2">
              <Card className="flex justify-center">
                <CardContent className="space-y-4 p-4 text-center">
                  <div>
                    <h3 className="font-semibold text-base mb-1">{upcomingEvent.name}</h3>
                    <p className="text-sm text-muted-foreground">{upcomingEvent.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-xs justify-center">
                      <Clock className="h-3 w-3 mr-2" />
                      {upcomingEvent.startTime} ({upcomingEvent.duration})
                    </div>
                    <div className="flex items-center text-xs justify-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      {upcomingEvent.date}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Attendees</p>
                    <div className="flex -space-x-2 justify-center">
                      {upcomingEvent.attendees.map((attendee, i) => (
                        <Avatar key={i} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full text-sm py-2" variant="outline">
                    <Share className="h-3 w-3 mr-2" />
                    Share Invitation Link
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ScheduleView = () => {
  const [tasks, setTasks] = useState<any[]>([

    // Sample data for better visualization
    /*
    {
      id: '1',
      title: 'Weekly Team Standup',
      description: 'Regular team sync meeting to discuss progress and blockers',
      date: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
      priority: 'medium',
      status: 'current',
      type: 'meeting',
      attendees: ['john@example.com', 'sarah@example.com', 'mike@example.com'],
      location: 'Conference Room A'
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Complete and submit the Q1 project deliverables',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
      priority: 'high',
      status: 'upcoming',
      type: 'task'
    },
    {
      id: '3',
      title: 'Client Presentation',
      description: 'Present new features to key stakeholders',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
      priority: 'high',
      status: 'upcoming',
      type: 'meeting',
      attendees: ['client@external.com', 'ceo@example.com'],
      location: 'Virtual - Zoom'
    }*/
  ]);

  const processTaskDate = (task: any) => {
    if (!task.date || !task.time) return new Date(); // Return current date as fallback
  
    // Handle Firestore Timestamp
    const timestamp = task.date.toDate ? task.date.toDate() : new Date(task.date);
    
    // Parse the time string
    const [hours, minutes] = task.time.split(':').map(Number);
    
    // Create new date object and set hours/minutes
    const combinedDate = new Date(timestamp);
    combinedDate.setHours(hours, minutes, 0, 0);
    
    return combinedDate;
  };


  const [isLoading, setIsLoading] = useState(true);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meeting' | 'task'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const [newTask, setNewTask] = useState<Task>({
    title: '',
    description: '',
    date: new Date(),
    time: '',
    venue: '',
    priority: 'medium',
    status: 'upcoming',
    type: 'task',
    invitees: [],
    createdAt: new Date().toISOString(),
    createdBy: auth.currentUser?.uid || '',
  });

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks
      .filter(task => {
        if (!task) return false;
        const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || task.type === filterType;
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        return matchesSearch && matchesType && matchesPriority;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [tasks, searchQuery, filterType, filterPriority]);

  const fetchTasks = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const response = await fetch('/api/schedule');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
  
      const data = await response.json();
      setTasks(data.tasks || []); // Ensure we always set an array, even if empty
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupedTasks = useMemo(() => {
    if (!filteredTasks) return {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
      completed: []
    };
  
    const now = new Date();
    const groups = {
      overdue: [] as typeof tasks,
      today: [] as typeof tasks,
      tomorrow: [] as typeof tasks,
      thisWeek: [] as typeof tasks,
      later: [] as typeof tasks,
      completed: [] as typeof tasks,
    };
  
    filteredTasks.forEach(task => {
      if (!task) return;
      
      if (task.status === 'completed') {
        groups.completed.push(task);
        return;
      }
  
      // Convert Firestore timestamp to Date object
      let taskDate;
      if (task.date && task.time) {
        // Handle Firestore timestamp conversion
        const timestamp = task.date;
        const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
        
        // Parse time string
        const [hours, minutes] = task.time.split(':').map(Number);
        
        // Set the hours and minutes
        taskDate = new Date(date);
        taskDate.setHours(hours, minutes, 0, 0);
      } else {
        taskDate = new Date();
      }
      console.log('Task date raw:', task.date);
console.log('Task time:', task.time);
console.log('Processed date:', taskDate);
  
      const isToday = taskDate.toDateString() === now.toDateString();
      const isTomorrow = taskDate.toDateString() === new Date(now.getTime() + 86400000).toDateString();
      const isThisWeek = taskDate <= new Date(now.getTime() + 7 * 86400000);
  
      if (taskDate < now && !isToday) {
        groups.overdue.push(task);
      } else if (isToday) {
        groups.today.push(task);
      } else if (isTomorrow) {
        groups.tomorrow.push(task);
      } else if (isThisWeek) {
        groups.thisWeek.push(task);
      } else {
        groups.later.push(task);
      }
    });
  
    return groups;
  }, [filteredTasks]);

  const addTask = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const newTaskData = {
        ...newTask,
        status: 'upcoming',
        date: new Date(newTask.date).toISOString()
      };

      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTaskData)
      });

      //fetchTasks();

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const data = await response.json();
      setTasks([...tasks, data.task]);
      setShowAddDialog(false);
      setNewTask({
        title: '',
        description: '',
        date: new Date(),
        time: '',
        priority: 'medium',
        status: 'upcoming',
        type: 'task',
        invitees: [],
        venue: '',
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || ''
      });

      toast({
        title: "Success",
        description: "Task added successfully"
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/schedule', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId,
          updates: { status: newStatus }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
      toast({
        title: "Success", 
        description: "Task status updated"
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

  // Modify deleteTask function to use API
  const deleteTask = async (task: Task) => {
    try {
      console.log("deleteTask input", task)

      const taskKey = `${task.date}-${task.time}`;

      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/schedule?taskKey=${taskKey}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => `${task.date}-${task.time}` !== taskKey));
      toast({
        title: "Success",
        description: "Task deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    }
  };

  // Add loading state handling
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
const renderTaskCard = (task: any) => {

  console.log("render task date: ", task.date)
  const taskDate = new Date(task.date._seconds * 1000)
  //const taskDate = task.date.toDate ? task.date.toDate() : new Date(task.date);
  //const formattedDate = taskDate.toLocaleDateString();
  console.log("created: ", task.createdAt)
  //console.log("formattedDate: ", formattedDate)

  const getCombinedDateTime = (date: Date, timeString: string) => {
    if (!date || !timeString) return new Date();
    
    const [hours, minutes] = timeString.split(':');
    const combinedDate = new Date(date);
    combinedDate.setHours(parseInt(hours, 10));
    combinedDate.setMinutes(parseInt(minutes, 10));
    return combinedDate;
  };

  const taskDateTime = getCombinedDateTime(taskDate, task.time);

  console.log("taskDateTime: ", taskDateTime)


   return (
    
    <Card key={`${task.date}-${task.time}`}  className="relative bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <Card className="p-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Due Date */}
          <div className="col-span-2 p-4">
            <Card className="h-full shadow-md border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="flex items-center justify-center h-full p-4">
                <Card className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border border-transparent hover:border-primary">
                  <CardContent className="p-2">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold">
                        {taskDateTime.getDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {taskDateTime.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {taskDateTime.getFullYear()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Time & Location */}
          <div className="col-span-3 p-4">
            <Card className="h-full shadow-md border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="space-y-3 p-4">
                <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border border-transparent hover:border-primary">
                  <CardContent className="p-2">
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      {task.time}
                    </div>
                  </CardContent>
                </Card>
                {task.type === 'meeting' && (
                  <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border border-transparent hover:border-primary">
                    <CardContent className="p-2">
                      <div className="flex items-center text-sm text-muted-foreground group cursor-pointer">
                        <MapPin className="mr-2 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="hover:underline group-hover:text-primary transition-colors">{task.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Badge
                  variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {task.priority}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Description & Attendees */}
          <div className="col-span-7 p-4">
            <Card className="h-full shadow-md border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="space-y-4 p-4">
                <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border border-transparent hover:border-primary">
                  <CardContent className="p-2">
                    <div>
                      <h3 className="font-medium text-lg mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {task.attendees && task.attendees.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {task.attendees.map((attendee: string, index: number) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-white dark:border-slate-900">
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {attendee.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => {
                          // Add attendee logic here
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {task.attendees.length} {task.attendees.length === 1 ? 'attendee' : 'attendees'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>

      <Card className="border-t rounded-t-none">
        <CardFooter className="pt-3 pb-3 px-6 flex items-center justify-between bg-black-50 dark:bg-black-800">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-2">
              <div className="text-sm text-gray-500 flex items-center">
                <span>{task.type === 'meeting' ? 'Meeting' : 'Task'}</span>
                <span className="mx-2">•</span>
                <span>Created {new Date(task.createdAt).toISOString().split('T')[0]}</span>
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 inline-flex items-center"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit {task.type === 'meeting' ? 'Meeting' : 'Task'}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="date">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="date">Date</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                  </TabsList>
                  <TabsContent value="date" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" defaultValue={taskDate.toISOString().split('T')[0]} />
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input type="time" defaultValue={task.time} />
                    </div>
                    {task.type === 'meeting' && (
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input defaultValue={task.location} />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select defaultValue={task.priority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input defaultValue={task.title} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea defaultValue={task.description} />
                    </div>
                    {task.type === 'meeting' && (
                      <div className="space-y-2">
                        <Label>Attendees</Label>
                        <Input defaultValue={task.attendees?.join(', ')} placeholder="Enter email addresses separated by commas" />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900 inline-flex items-center"
              onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'upcoming' : 'completed')}
            >
              {task.status === 'completed' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reopen
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-900 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-950 inline-flex items-center"
              onClick={() => deleteTask(task)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Card>
  );};

  return (
    <div className="space-y-6 pt-10">
      <Card className="h-[80vh] flex flex-col">
        <Card className="rounded-b-none border-b-0">
          <Card>
            <CardHeader className="sticky top-0 bg-background z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Card className="bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader className="p-2">
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                </Card>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xs"
                  />
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger asChild>
                        <Button variant="ghost" className="w-[120px]">
                          <Filter className="mr-2 h-4 w-4" />
                          Filters
                        </Button>
                      </MenubarTrigger>
                      <MenubarContent>
                        <MenubarSub>
                          <MenubarSubTrigger>Type ({filterType})</MenubarSubTrigger>
                          <MenubarSubContent>
                            <MenubarItem onClick={() => setFilterType('all')}>
                              <Check className={`mr-2 h-4 w-4 ${filterType === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                              All Types
                            </MenubarItem>
                            <MenubarItem onClick={() => setFilterType('meeting')}>
                              <Check className={`mr-2 h-4 w-4 ${filterType === 'meeting' ? 'opacity-100' : 'opacity-0'}`} />
                              Meetings
                            </MenubarItem>
                            <MenubarItem onClick={() => setFilterType('task')}>
                              <Check className={`mr-2 h-4 w-4 ${filterType === 'task' ? 'opacity-100' : 'opacity-0'}`} />
                              Tasks
                            </MenubarItem>
                          </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator />
                        <MenubarSub>
                          <MenubarSubTrigger>Priority ({filterPriority})</MenubarSubTrigger>
                          <MenubarSubContent>
                            <MenubarItem onClick={() => setFilterPriority('all')}>
                              <Check className={`mr-2 h-4 w-4 ${filterPriority === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                              All Priorities
                            </MenubarItem>
                            <MenubarItem onClick={() => setFilterPriority('low')}>
                              <Check className={`mr-2 h-4 w-4 ${filterPriority === 'low' ? 'opacity-100' : 'opacity-0'}`} />
                              Low
                            </MenubarItem>
                            <MenubarItem onClick={() => setFilterPriority('medium')}>
                              <Check className={`mr-2 h-4 w-4 ${filterPriority === 'medium' ? 'opacity-100' : 'opacity-0'}`} />
                              Medium
                            </MenubarItem>
                            <MenubarItem onClick={() => setFilterPriority('high')}>
                              <Check className={`mr-2 h-4 w-4 ${filterPriority === 'high' ? 'opacity-100' : 'opacity-0'}`} />
                              High
                            </MenubarItem>
                          </MenubarSubContent>
                        </MenubarSub>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                  <div>
                    <EventCreationDialog />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Card>

        <Card className="flex-1 rounded-t-none border-t-0">
          <CardContent className="flex-1 overflow-y-auto pr-4 custom-scrollbar" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(203 213 225) transparent'
          }}>
            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgb(203 213 225);
                border-radius: 20px;
                border: 2px solid transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: rgb(148 163 184);
              }
            `}</style>

            <div className="space-y-8">
              {groupedTasks.overdue.length > 0 && (
                <div>
                  <h3 className="text-red-500 font-semibold mb-4">Overdue</h3>
                  <div className="space-y-4">
                    {groupedTasks.overdue.map((task) => renderTaskCard(task))}
                  </div>
                </div>
              )}

              {groupedTasks.today.length > 0 && (
                <div className="pt-4">
                  <Card className="bg-white dark:bg-gray-800 shadow-sm">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-center gap-3">
                        <h3 className="text-blue-500 font-semibold">Today :</h3>
                        <span className="text-blue-500 font-semibold">
                          {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-4">
                    {groupedTasks.today.map((task) => renderTaskCard(task))}
                  </div>
                </div>
              )}

              {groupedTasks.tomorrow.length > 0 && (
                <div>
                  <h3 className="text-green-500 font-semibold mb-4">Tomorrow</h3>
                  <div className="space-y-4">
                    {groupedTasks.tomorrow.map((task) => renderTaskCard(task))}
                  </div>
                </div>
              )}

              {groupedTasks.thisWeek.length > 0 && (
                <div>
                  <Card className="bg-white dark:bg-gray-800 shadow-sm">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-center gap-3">
                        <h3 className="text-purple-500 font-semibold">This Week :</h3>
                        <span className="text-purple-500 font-semibold">
                          {new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })} - {new Date(Date.now() + 6 * 86400000).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-4">
                    {groupedTasks.thisWeek.map((task) => renderTaskCard(task))}
                  </div>
                </div>
              )}

              {groupedTasks.later.length > 0 && (
                <div>
                  <h3 className="text-gray-500 font-semibold mb-4">Later</h3>
                  <div className="space-y-4">
                    {groupedTasks.later.map((task) => renderTaskCard(task))}
                  </div>
                </div>
              )}

              {groupedTasks.completed.length > 0 && (
                <div>
                  <h3 className="text-gray-400 font-semibold mb-4">Completed</h3>
                  <div className="space-y-4">
                    {groupedTasks.completed.map((task) => renderTaskCard(task))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task/Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="datetime-local"
                value={newTask.date instanceof Date ? newTask.date.toISOString().slice(0, 16) : ''}
                onChange={(e) => setNewTask({ ...newTask, date: new Date(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newTask.type}
                onValueChange={(value: 'meeting' | 'task') => setNewTask({ ...newTask, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newTask.type === 'meeting' && (
              <>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={newTask.venue}
                    onChange={(e) => setNewTask({ ...newTask, venue: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attendees (comma-separated emails)</Label>
                  <Input
                    value={newTask.invitees.join(', ')}
                    onChange={(e) => setNewTask({
                      ...newTask,
                      invitees: e.target.value.split(',').map(email => email.trim())
                    })}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={addTask}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};



export function HeroVideoDialogDemoTopInBottomOut() {
  return (
    <div className="relative">
      <HeroVideoDialog
        className="dark:hidden block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}

async function refreshSession() {
  try {
    // Get current user
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    // Get fresh ID token
    const idToken = await user.getIdToken(true);

    // Call session endpoint to refresh session cookie
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh session');
    }

    return true;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return false;
  }
}


export default function MentorshipPortal() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const Sidebar = () => {
    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [currentProfileView, setCurrentProfileView] = useState('details');
    const [profileData, setProfileData] = useState({
      username: auth.currentUser?.email || "johndoe@example.com",
      fullName: auth.currentUser?.displayName || "John Doe",
      email: auth.currentUser?.email || "johndoe@example.com",
      photoURL: auth.currentUser?.photoURL || "/default-avatar.png",
      bio: "",
      skills: [] as string[],
      achievements: [] as string[],
      niche: "",
      goal: "",
      isGoogleConnected: false,
      isInstagramConnected: false,
      isDiscordConnected: false,
      isLinkedInConnected: false,
      isTwitterConnected: false,
      isTikTokConnected: false
    });
    const { theme, setTheme } = useTheme();

    const handleConnect = (service: string) => {
      setProfileData(prev => ({
        ...prev,
        [`is${service}Connected`]: true
      }));
      toast({
        title: "Success",
        description: `Connected to ${service}`
      });
    };

    return (
      <div className="mt-16 fixed top-0 left-0 bottom-0 w-64">
        <div className="h-full flex flex-col p-4 border-r bg-background">
          <div className="flex flex-col gap-3 flex-1">
            <Button variant="ghost" className="justify-start w-full" onClick={() => setCurrentView('dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => setCurrentView('spaces')}>
              <Hash className="mr-2 h-4 w-4" />
              Spaces
            </Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => setCurrentView('connect')}>
              <Users className="mr-2 h-4 w-4" />
              Connect
            </Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => setCurrentView('schedule')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => setCurrentView('resources')}>
              <BookOpen className="mr-2 h-4 w-4" />
              Resources
            </Button>
          </div>

          <div className="flex items-center justify-center w-full border-t border-b pt-3 pb-3 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center justify-center gap-2">
                <Sun className={`h-4 w-4 transition-opacity ${theme === 'dark' ? 'opacity-50' : 'text-yellow-500'}`} />
              </div>
              <Switch
                id="theme-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => {
                  const newTheme = checked ? 'dark' : 'light';
                  setTheme(newTheme);
                  toast({
                    title: "Theme Changed",
                    description: `Switched to ${newTheme} mode`
                  });
                }}
                className="data-[state=checked]:bg-slate-800 data-[state=unchecked]:bg-yellow-500"
              />
              <div className="flex items-center justify-center gap-2">
                <Moon className={`h-4 w-4 transition-opacity ${theme === 'dark' ? 'text-slate-200' : 'opacity-50'}`} />
              </div>
            </div>
          </div>

          <Button variant="ghost" className="justify-between w-full mt-2 mb-2" onClick={async () => {
            try {
              const response = await fetch('/api/profiles', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                }
              });

              if (!response.ok) {
                throw new Error('Failed to fetch profile');
              }

              const data = await response.json();
              setProfileData(data.profile);
              setShowProfileDialog(true);
              setCurrentProfileView('details');
            } catch (error) {
              console.error('Error fetching profile:', error);
              toast({
                title: "Error",
                description: "Failed to load profile data",
                variant: "destructive",
                duration: 3000
              });
            }
          }}>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileData.photoURL} alt={profileData.fullName} />
                <AvatarFallback>{profileData.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{profileData.fullName}</span>
                <span className="text-xs text-muted-foreground">{profileData.email}</span>
              </div>
            </div>
            <Settings className="h-4 w-4" />
          </Button>

          <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
            <DialogContent className="w-[70vw] max-w-[1000px] h-[80vh] max-h-[800px]">
              <div className="space-y-6 mt-6 overflow-y-auto pr-4 custom-scrollbar" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(203 213 225) transparent'
              }}>
                <style jsx global>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgb(203 213 225);
                    border-radius: 20px;
                    border: 2px solid transparent;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgb(148 163 184);
                  }
                `}</style>
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profileData.photoURL} alt={profileData.fullName} />
                          <AvatarFallback>{profileData.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-0 right-0 rounded-full bg-background shadow-sm"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Change photo</span>
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        <Link className="h-4 w-4 mr-1" />
                        Copy Link
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4 divide-y divide-border">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Name</h3>
                        <input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        />
                      </div>

                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">Username</h3>
                        <input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        />
                      </div>

                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">Email Address</h3>
                        <input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        />
                      </div>

                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">Phone Number</h3>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) => setProfileData(prev => ({
                              ...prev,
                              countryCode: value
                            }))}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+1">+1 (US/CA)</SelectItem>
                              <SelectItem value="+44">+44 (UK)</SelectItem>
                              <SelectItem value="+61">+61 (AU)</SelectItem>
                              <SelectItem value="+91">+91 (IN)</SelectItem>
                              <SelectItem value="+86">+86 (CN)</SelectItem>
                              <SelectItem value="+81">+81 (JP)</SelectItem>
                              <SelectItem value="+49">+49 (DE)</SelectItem>
                              <SelectItem value="+33">+33 (FR)</SelectItem>
                              <SelectItem value="+55">+55 (BR)</SelectItem>
                            </SelectContent>
                          </Select>
                          <input
                            id="phone"
                            type="tel"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">About</h3>
                        <textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant="destructive"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
                <Button
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-gray-100"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/profiles', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(profileData)
                      });

                      if (!response.ok) {
                        throw new Error('Failed to save changes');
                      }

                      const data = await response.json();
                      toast({
                        title: "Success",
                        description: "Profile updated successfully",
                        duration: 3000
                      });
                      setShowProfileDialog(false);
                    } catch (error) {
                      console.error('Error saving changes:', error);
                      toast({
                        title: "Error",
                        description: "Failed to save changes",
                        variant: "destructive",
                        duration: 3000
                      });
                    }
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  };

  const ResourcesView = () => {
    const [resources, setResources] = useState<any[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newResource, setNewResource] = useState({
      title: '',
      type: '',
      platform: '',
      author: '',
      description: '',
    });

    // Fetch resources on component mount
    useEffect(() => {
      const fetchResources = async () => {
        try {
          const response = await fetch('/api/resources');
          if (!response.ok) {
            throw new Error('Failed to fetch resources');
          }
          const data = await response.json();
          setResources(data);
        } catch (error) {
          console.error('Error fetching resources:', error);
        }
      };

      fetchResources();
    }, []);

    function setShowSecondStep(arg0: boolean): void {
      throw new Error('Function not implemented.');
    }

    return (
      <div className="space-y-6 pt-10">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className='pl-10 text-transparent'>sample</CardTitle>
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold pr-5"> {(() => {
                      const { auth } = require('@/firebase/firebaseConfig');
                      const [firstName, setFirstName] = useState('');

                      useEffect(() => {
                        const unsubscribe = auth.onAuthStateChanged(async (user: { displayName: string; }) => {
                          if (user) {
                            // Get user's display name and split to get first name
                            const displayName = user.displayName || '';
                            const firstName = displayName.split(' ')[0];
                            setFirstName(firstName);
                          }
                        });

                        return () => unsubscribe();
                      }, []);

                      return `${firstName || 'there'}'s Library`
                    })()}</h3>
                    <ViewCollectionsDialog />
                  </div>
                </CardContent>
              </Card>
              <ResourceCreationDialog />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recommended Resources */}
              <div>
                <Card className="p-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center pt-2 pb-2">Product Hub</h3>
                </Card>
                <div className="pt-10 space-y-4">
                  {resources.map((resource, i) => (
                    <Card key={i} className="hover:bg-accent transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2">{resource.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <span>{resource.recommended}</span>
                              <span>•</span>
                              <Badge variant="secondary">{resource.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="mt-1">
                                <BookOpen className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <Card className="mb-6 pt-5">
                                <CardContent>
                                  <DialogHeader>
                                    <DialogTitle>Join Our Mentorship Program</DialogTitle>
                                    <DialogDescription>
                                      Get personalized guidance and unlock premium resources
                                    </DialogDescription>
                                  </DialogHeader>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="space-y-6">
                                  <div className="text-center">
                                    <h4 className="font-medium mb-4">Premium Mentorship Benefits</h4>
                                    <ul className="text-sm space-y-3">
                                      <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>1-on-1 sessions with expert mentors</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>Access to all premium resources</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>Personalized learning path</span>
                                      </li>
                                      <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>Project reviews and feedback</span>
                                      </li>
                                    </ul>
                                  </div>

                                  <div className="text-center space-y-4 p-6 border rounded-lg">
                                    <div>
                                      <span className="text-3xl font-bold">$199</span>
                                      <span className="text-sm text-muted-foreground">/month</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Cancel anytime. 100% satisfaction guaranteed.
                                    </p>
                                  </div>

                                  <div className="flex flex-col gap-3">
                                    <Button size="lg" onClick={() => setCurrentView('course')}>
                                      Start Your Mentorship Journey
                                    </Button>
                                  </div>

                                  <div className="text-center text-sm text-muted-foreground">
                                    <p>Have questions? <span className="text-primary cursor-pointer hover:underline">Contact us</span></p>
                                  </div>
                                </CardContent>
                              </Card>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Learning Path */}
              <div>
                <Card className="p-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center pt-2 pb-2">Content Hub</h3>
                </Card>
                <div className='pt-10'></div>
                {currentView === "youtube" ? (
                  <YoutubeView />
                ) : currentView === "tiktok" ? (
                  <TikTokView />
                ) : currentView === "twitter" ? (
                  <TwitterView />
                ) : currentView === "instagram" ? (
                  <InstagramView />
                ) : (
                  <div className="space-y-4">
                    {[
                      {
                        platform: "YouTube",
                        status: "Latest Content",
                        content: [
                          {
                            title: "Frontend Development Tips",
                            views: "15K views",
                            date: "2 days ago",
                            thumbnail: "/youtube-thumb-1.jpg"
                          },
                          {
                            title: "React Best Practices",
                            views: "32K views",
                            date: "1 week ago",
                            thumbnail: "/youtube-thumb-2.jpg"
                          }
                        ],
                        channelInfo: {
                          subscribers: "50K",
                          totalVideos: "125"
                        }
                      },
                      {
                        platform: "Instagram",
                        status: "Recent Posts",
                        content: [
                          {
                            caption: "Sharing some web development tips! 💻 #webdev #coding",
                            likes: "2.5K",
                            comments: "156",
                            thumbnail: "/instagram-post-1.jpg"
                          },
                          {
                            caption: "Check out this cool React project! 🚀 #reactjs #javascript",
                            likes: "3.2K",
                            comments: "234",
                            thumbnail: "/instagram-post-2.jpg"
                          }
                        ],
                        profileInfo: {
                          followers: "25K",
                          posts: "342",
                          following: "1.2K"
                        }
                      },
                      {
                        platform: "TikTok",
                        status: "Trending",
                        content: [
                          {
                            title: "Quick CSS Tips",
                            likes: "45K",
                            comments: "1.2K",
                            thumbnail: "/tiktok-thumb-1.jpg"
                          },
                          {
                            title: "JavaScript Shorts",
                            likes: "32K",
                            comments: "890",
                            thumbnail: "/tiktok-thumb-2.jpg"
                          }
                        ],
                        profileInfo: {
                          followers: "100K",
                          likes: "1.2M"
                        }
                      },
                      {
                        platform: "Twitter",
                        status: "Recent Threads",
                        content: [
                          {
                            text: "🧵 Essential Web Development Tools in 2024",
                            retweets: "2.5K",
                            likes: "12K",
                            time: "3h ago"
                          },
                          {
                            text: "Breaking down complex React concepts 👇",
                            retweets: "1.8K",
                            likes: "8K",
                            time: "1d ago"
                          }
                        ],
                        profileInfo: {
                          followers: "75K",
                          tweets: "3.2K"
                        }
                      }
                    ].map((platform, i) => (
                      <Card
                        key={i}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <Card className="p-3">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium flex items-center gap-2">
                                  {platform.platform === "YouTube" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="p-0"
                                    >
                                      <svg className="h-5 w-5 dark:text-red-500 text-red-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                      </svg>
                                    </Button>
                                  )}
                                  {platform.platform === "TikTok" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="p-0"
                                    >
                                      <svg className="h-5 w-5 dark:text-white text-black" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                      </svg>
                                    </Button>
                                  )}
                                  {platform.platform === "Twitter" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="p-0"
                                    >
                                      <svg className="h-5 w-5 dark:text-white text-black" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                      </svg>
                                    </Button>
                                  )}
                                  {platform.platform === "Instagram" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="p-0"
                                    >
                                      <svg className="h-5 w-5 dark:text-white text-black" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                      </svg>
                                    </Button>
                                  )}
                                  {platform.platform}
                                </h4>
                                <Badge variant="secondary">{platform.status}</Badge>
                              </div>
                            </Card>

                            <div className="grid gap-3">
                              {platform.content.map((item, j) => (
                                <Card key={j} className="p-2">
                                  <div className="flex items-center gap-3 hover:bg-accent rounded-lg">
                                    {item.thumbnail && (
                                      <div className="w-24 h-16 bg-muted rounded overflow-hidden">
                                        <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(${item.thumbnail})` }} />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{item.title || item.text}</p>
                                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                        {item.views && <span>{item.views}</span>}
                                        {item.likes && <span>{item.likes} likes</span>}
                                        {item.retweets && <span>{item.retweets} retweets</span>}
                                        {item.date || item.time && <span>• {item.date || item.time}</span>}
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>

                            <Card className="p-3">
                              <div className="flex justify-between items-center">
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                  {platform.channelInfo && (
                                    <>
                                      <span>{platform.channelInfo.subscribers} subscribers</span>
                                      <span>{platform.channelInfo.totalVideos} videos</span>
                                    </>
                                  )}
                                  {platform.profileInfo && (
                                    <>
                                      <span>{platform.profileInfo.followers} followers</span>
                                      {platform.profileInfo.likes && <span>{platform.profileInfo.likes} likes</span>}
                                      {platform.profileInfo.tweets && <span>{platform.profileInfo.tweets} tweets</span>}
                                    </>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => setCurrentView(platform.platform.toLowerCase())}
                                >
                                  Open
                                </Button>
                              </div>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            {/* Step 1: Resource Details */}
            {!setShowSecondStep ? (
              <>
                <div className="flex justify-center">
                  <Card className="w-full">
                    <CardContent className="flex flex-col items-center py-4">
                      <DialogHeader className="text-center">
                        <DialogTitle>Add New Resource - Details</DialogTitle>
                        <DialogDescription>
                          First, let's add the resource details and metadata
                        </DialogDescription>
                      </DialogHeader>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="recommended">Recommended For</label>
                    <input
                      id="recommended"
                      value={newResource.recommended}
                      onChange={(e) => setNewResource({ ...newResource, recommended: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="e.g. Beginners, Advanced Developers"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="url">Resource URL</label>
                    <input
                      id="url"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="https://"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="tags">Tags</label>
                    <input
                      id="tags"
                      value={newResource.tags}
                      onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Enter comma-separated tags"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setShowSecondStep(true)}
                    disabled={!newResource.recommended || !newResource.url || !newResource.tags}
                  >
                    Continue to Course Details
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                {/* Step 2: Course Information */}
                <div className="flex justify-center">
                  <Card className="w-full">
                    <CardContent className="flex flex-col items-center py-4">
                      <DialogHeader className="text-center">
                        <DialogTitle>Course Information</DialogTitle>
                        <DialogDescription>
                          Now, let's add the core details about your course
                        </DialogDescription>
                      </DialogHeader>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title">Course Title</label>
                    <input
                      id="title"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="type">Course Type</label>
                    <Select onValueChange={(value) => setNewResource({ ...newResource, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video Course">Video Course</SelectItem>
                        <SelectItem value="Interactive Course">Interactive Course</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Tutorial Series">Tutorial Series</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description">Course Description</label>
                    <textarea
                      id="description"
                      value={newResource.description}
                      onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Provide a detailed overview of the course content and learning outcomes"
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setShowSecondStep(false)}>
                    Back to Resource Details
                  </Button>
                  <Button onClick={async () => {
                    try {
                      const response = await fetch('/api/resources', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newResource)
                      });

                      if (!response.ok) {
                        throw new Error('Failed to add resource');
                      }

                      const updatedResponse = await fetch('/api/resources');
                      const updatedData = await updatedResponse.json();
                      setResources(updatedData);

                      setNewResource({
                        title: '',
                        type: '',
                        platform: '',
                        author: '',
                        description: '',
                      });

                      setShowSecondStep(false);
                      setShowAddDialog(false);
                    } catch (error) {
                      console.error('Error adding resource:', error);
                    }
                  }}>Create Course</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const YoutubeView = () => {
    const [channelData] = useState({
      snippet: {
        title: "Code With Sarah",
        thumbnails: {
          default: {
            url: "/avatars/sarah.jpg"
          }
        }
      },
      statistics: {
        subscriberCount: "125K",
        videoCount: "342",
        viewCount: "2.1M",
        commentCount: "45.2K"
      }
    });

    const [videos] = useState([
      {
        id: "1",
        snippet: {
          title: "Build a Full Stack App with Next.js 13",
          thumbnails: {
            medium: {
              url: "/thumbnails/nextjs-tutorial.jpg"
            }
          },
          publishedAt: "2024-01-15T14:30:00Z"
        },
        statistics: {
          viewCount: "12.5K"
        }
      },
      {
        id: "2",
        snippet: {
          title: "React Hooks Deep Dive - useState & useEffect",
          thumbnails: {
            medium: {
              url: "/thumbnails/react-hooks.jpg"
            }
          },
          publishedAt: "2024-01-10T16:45:00Z"
        },
        statistics: {
          viewCount: "8.2K"
        }
      },
      {
        id: "3",
        snippet: {
          title: "TypeScript Crash Course for Beginners",
          thumbnails: {
            medium: {
              url: "/thumbnails/typescript.jpg"
            }
          },
          publishedAt: "2024-01-05T13:15:00Z"
        },
        statistics: {
          viewCount: "15.7K"
        }
      }
    ]);

    return (
      <div className="flex h-screen w-full overflow-hidden bg-background pt-12">
        {/* Main Content - 2/3 width */}
        <div className="w-2/3 h-full flex flex-col px-8">
          {/* Title Section */}
          <h1 className="text-3xl font-bold tracking-tight mb-6">Building a Modern Web Application with React and TypeScript</h1>

          {/* Video Player Section */}
          <div className="h-[45%] w-full rounded-xl overflow-hidden shadow-lg">
            <div className="relative w-full h-full">
              <iframe
                src="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                title="Channel Trailer"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Video Info Section */}
          <div className="flex-1 mt-6">
            <div className="flex flex-col space-y-4">
              {/* Video title and controls row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage src="/avatars/channel-avatar.png" />
                    <AvatarFallback>CH</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">Code Horizons</h3>
                    <p className="text-sm text-muted-foreground">256K subscribers</p>
                  </div>
                  <Button className="ml-4" variant="default" size="sm">Subscribe</Button>

                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="flex items-center gap-2 px-4">
                    <ThumbsUp className="h-5 w-5" />
                    12K
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2 px-4">
                    <Share className="h-5 w-5" />
                    Share
                  </Button>
                  <div>
                    <Menubar className="border-none">
                      <MenubarMenu>
                        <MenubarTrigger className="cursor-pointer hover:bg-accent/50">
                          <MoreVertical className="h-5 w-5" />
                        </MenubarTrigger>
                        <MenubarContent>
                          <Dialog>
                            <DialogTrigger asChild>
                              <MenubarItem>Show Description</MenubarItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Video Description</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <p className="text-sm text-muted-foreground">
                                  Learn how to build modern web applications using React and TypeScript. This comprehensive tutorial covers everything from setup to deployment, including best practices and advanced patterns.
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <MenubarItem>Show Subtitles</MenubarItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Live Subtitles</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <iframe
                                  src="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb&cc_load_policy=1"
                                  className="w-full h-[200px]"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </div>
                </div>
              </div>

              {/* Video details section */}
              <div className="flex flex-col gap-4">
                <div className="bg-accent/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Learn how to build modern web applications using React and TypeScript. This comprehensive tutorial covers everything from setup to deployment, including best practices and advanced patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-1/3 h-full">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6">
              <h3 className="font-semibold text-lg pl-8">Similar Videos</h3>
              <Menubar className="border-none">
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer hover:bg-accent/50">
                    <Filter className="h-4 w-4" />
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Most Recent</MenubarItem>
                    <MenubarItem>Most Viewed</MenubarItem>
                    <MenubarItem>Most Liked</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-4 p-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="group p-3 hover:bg-accent/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-44 aspect-video rounded-md overflow-hidden">
                        <img
                          src="/default-avatar.png"
                          alt={video.snippet.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                          10:30
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {video.snippet.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-2">Code Horizons</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                          <span>{video.statistics.viewCount} views</span>
                          <span>•</span>
                          <span>{new Date(video.snippet.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  };

  const TikTokView = () => {
    const [sortBy, setSortBy] = useState("recent");
    const [profile] = useState({
      handle: "@codehorizons",
      name: "Code Horizons",
      description: "Teaching code through short-form content 👨‍💻✨\nDaily tips and tutorials on web development",
      stats: {
        followers: "125K",
        following: "892",
        likes: "1.2M"
      }
    });

    const [posts, setPosts] = useState([
      {
        id: "1",
        caption: "Quick CSS Grid Tutorial 🎨",
        stats: {
          likes: "45K",
          comments: "1.2K",
          shares: "2.3K",
          views: "250K"
        },
        duration: "0:45",
        publishedAt: "2024-01-15T12:00:00Z"
      },
      {
        id: "2",
        caption: "JavaScript Tips & Tricks ⚡️",
        stats: {
          likes: "32K",
          comments: "890",
          shares: "1.5K",
          views: "180K"
        },
        duration: "1:00",
        publishedAt: "2024-01-12T15:30:00Z"
      },
      {
        id: "3",
        caption: "React Hooks Explained Simply 💡",
        stats: {
          likes: "28K",
          comments: "750",
          shares: "1.2K",
          views: "165K"
        },
        duration: "0:55",
        publishedAt: "2024-01-10T14:20:00Z"
      }
    ]);

    return (
      <div className="flex flex-col space-y-6 pt-10">
        {/* Profile Section */}
        <div className="bg-card rounded-lg p-6">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative">
              <img
                src="/default-avatar.png"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
              />
              <div className="absolute -bottom-2 right-0 bg-primary text-white text-xs px-2 py-1 rounded-full">
                Pro
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center mb-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <span className="text-muted-foreground text-sm">{profile.handle}</span>
              </div>
              <p className="text-muted-foreground whitespace-pre-line mb-4 max-w-lg">{profile.description}</p>
              <div className="flex justify-center gap-12">
                <div className="text-center">
                  <div className="font-bold">{profile.stats.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profile.stats.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profile.stats.likes}</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold">Latest Shorts</h3>
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort by
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem onClick={() => setSortBy("recent")}>Most Recent</MenubarItem>
                    <MenubarItem onClick={() => setSortBy("views")}>Most Viewed</MenubarItem>
                    <MenubarItem onClick={() => setSortBy("likes")}>Most Liked</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[9/16]">
                  <img
                    src="/default-avatar.png"
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                    {post.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {post.caption}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                    <span>❤️ {post.stats.likes}</span>
                    <span>💬 {post.stats.comments}</span>
                    <span>↗️ {post.stats.shares}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TwitterView = () => {
    const [tweets, setTweets] = useState([
      {
        id: "1",
        snippet: {
          title: "🔥 Just launched my new React course! Early bird pricing available for the next 48 hours.",
          description: "Learn React from the ground up including:\n• Hooks\n• State Management\n• Performance Optimization\n• Testing\n\nLink in bio! 🚀",
          thumbnails: {
            medium: {
              url: "/course-promo.jpg"
            }
          },
          publishedAt: "2024-01-20T10:30:00Z"
        },
        statistics: {
          retweetCount: "3.2K",
          likeCount: "15.7K",
          replyCount: "428",
          viewCount: "102K"
        }
      },
      {
        id: "2",
        snippet: {
          title: "💡 Pro Tip: When debugging React components, use the React DevTools extension.",
          description: "It lets you:\n• Inspect component props\n• View state changes\n• Profile performance\n• Debug hooks\n\nA must-have for React developers!",
          publishedAt: "2024-01-20T07:30:00Z"
        },
        statistics: {
          retweetCount: "2.1K",
          likeCount: "9.3K",
          replyCount: "156",
          viewCount: "78K"
        }
      },
      {
        id: "3",
        snippet: {
          title: "Today's coding session:",
          description: "• Built a new authentication system\n• Added real-time updates\n• Fixed that pesky bug in production\n\nRemember: coding is a journey, not a race. Take breaks and celebrate small wins! 🎉",
          publishedAt: "2024-01-20T04:30:00Z"
        },
        statistics: {
          retweetCount: "1.8K",
          likeCount: "7.2K",
          replyCount: "203",
          viewCount: "65K"
        }
      }
    ]);

    return (
      <div className="space-y-6 pt-12">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Twitter Profile</CardTitle>
              <Button variant="outline" size="sm" className="hover:bg-accent/50 transition-colors">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Card className="overflow-hidden">
              {/* Profile Banner */}
              <div className="relative mb-16">
                <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg"></div>
                <div className="absolute -bottom-12 left-6">
                  <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                    <AvatarImage src="/avatars/sarah.jpg" />
                    <AvatarFallback>SW</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Profile Info */}
              <Card className="border-0 shadow-none">
                <CardContent className="px-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">Sarah Wilson</h3>
                      <p className="text-muted-foreground">@sarahcodes</p>
                    </div>
                    <Button className="hover:bg-primary/90 transition-colors">Follow</Button>
                  </div>

                  <p className="mt-4">Senior Software Engineer | Teaching web development and React | Building in public</p>

                  <Card className="mt-4 bg-accent/10">
                    <CardContent className="py-4">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          San Francisco, CA
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined March 2020
                        </span>
                      </div>

                      <div className="flex gap-6 mt-4">
                        <span className="text-sm">
                          <strong>75.2K</strong> <span className="text-muted-foreground">Followers</span>
                        </span>
                        <span className="text-sm">
                          <strong>1.2K</strong> <span className="text-muted-foreground">Following</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </Card>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Tweets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {tweets.map((tweet) => (
                <Card key={tweet.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/avatars/sarah.jpg" />
                        <AvatarFallback>SW</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Sarah Wilson</span>
                          <span className="text-muted-foreground">@sarahcodes</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(tweet.snippet.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Card className="bg-accent/5 border-0">
                      <CardContent className="py-3">
                        <p className="font-medium">{tweet.snippet.title}</p>
                        <p className="mt-2 text-muted-foreground whitespace-pre-line">{tweet.snippet.description}</p>
                      </CardContent>
                    </Card>

                    {tweet.snippet.thumbnails?.medium.url && (
                      <Card className="mt-4 overflow-hidden border-0">
                        <img
                          src={tweet.snippet.thumbnails.medium.url}
                          alt=""
                          className="w-full rounded-lg"
                        />
                      </Card>
                    )}

                    <Card className="mt-4 bg-background">
                      <CardContent className="py-2">
                        <div className="flex justify-between text-muted-foreground">
                          <Button variant="ghost" size="sm" className="hover:text-blue-500 hover:bg-blue-500/10">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {tweet.statistics.replyCount}
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-green-500 hover:bg-green-500/10">
                            <Repeat className="h-4 w-4 mr-2" />
                            {tweet.statistics.retweetCount}
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-red-500 hover:bg-red-500/10">
                            <Heart className="h-4 w-4 mr-2" />
                            {tweet.statistics.likeCount}
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-blue-500 hover:bg-blue-500/10">
                            <BarChart2 className="h-4 w-4 mr-2" />
                            {tweet.statistics.viewCount}
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  const InstagramView = () => {
    return (
      <div className="space-y-6 pt-16">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 ring-2 ring-offset-2 ring-primary/10">
                      <AvatarImage src="/default-avatar.png" />
                      <AvatarFallback>IG</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">username</h3>
                      <p className="text-muted-foreground">Full Name</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-accent/50">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between text-center">
                  <div className="p-2">
                    <p className="font-semibold">234</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="p-2">
                    <p className="font-semibold">14.3k</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="p-2">
                    <p className="font-semibold">1,234</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-4">
                <p className="text-sm">
                  Bio description goes here
                  <br />📍 Location
                  <br />🔗 website.com
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((post) => (
                    <Card key={post} className="aspect-square overflow-hidden hover:opacity-90 transition-opacity">
                      <CardContent className="p-0">
                        <img
                          src="/default-avatar.png"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            {[1, 2].map((post) => (
              <Card key={post} className="mb-4 last:mb-0">
                <CardContent className="p-0">
                  <Card className="border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 ring-2 ring-offset-1 ring-primary/10">
                            <AvatarImage src="/default-avatar.png" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">username</span>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="aspect-square">
                    <img
                      src="/default-avatar.png"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <Card className="border-0">
                    <CardContent className="p-4">
                      <div className="flex justify-between text-muted-foreground">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm" className="hover:text-red-500 hover:bg-red-500/10">
                            <Heart className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-blue-500 hover:bg-blue-500/10">
                            <MessageCircle className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-blue-500 hover:bg-blue-500/10">
                            <Send className="h-5 w-5" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="hover:text-blue-500 hover:bg-blue-500/10">
                          <Bookmark className="h-5 w-5" />
                        </Button>
                      </div>
                      <p className="mt-2 text-sm">
                        <span className="font-medium">username</span> Caption text goes here...
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">View all 123 comments</p>
                      <p className="mt-1 text-xs text-muted-foreground">2 HOURS AGO</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  const CourseView = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [isAdminView, setIsAdminView] = useState(false);

    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const response = await fetch('/api/course', {
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error('Failed to fetch courses');
          }
          const data = await response.json();
          setCourses(data.courses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      };

      fetchCourses();
    }, []);

    return (
      <div className="space-y-6 pt-16">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setIsAdminView(!isAdminView)}
          >
            {isAdminView ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                View Course
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Course
              </>
            )}
          </Button>
        </div>

        {isAdminView ? (
          <AdminCourseView courses={courses} />
        ) : (
          <MemberCourseView courses={courses} />
        )}
      </div>
    );
  };

  // Member facing view
  const MemberCourseView = ({ courses }: { courses: any[] }) => {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Course: Advanced JavaScript Concepts</CardTitle>
            <Badge variant="secondary">Progress: 45%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Course Content Navigation */}
            <div className="md:col-span-1 flex flex-col h-full">
              <div className="font-semibold mb-4">Course Modules</div>
              <ScrollArea className="flex-grow pr-4">
                <div className="relative">
                  {/* Vertical line connecting modules */}
                  <div className="absolute left-[18px] top-6 bottom-6 w-0.5 bg-border" />

                  {[
                    {
                      title: "Introduction to Advanced JS",
                      completed: true,
                      lessons: [
                        { name: "Course Overview", completed: true, current: false, url: "/lessons/course-overview" },
                        { name: "Setting Up Environment", completed: true, current: false, url: "/lessons/setup" }
                      ]
                    },
                    {
                      title: "Closures & Scope",
                      completed: false,
                      current: true,
                      lessons: [
                        { name: "Understanding Closures", completed: true, current: false, url: "/lessons/closures" },
                        { name: "Lexical Scope", completed: false, current: true, url: "/lessons/lexical-scope" },
                        { name: "Practical Applications", completed: false, current: false, url: "/lessons/practical-closures" }
                      ]
                    },
                    {
                      title: "Prototypes & Inheritance",
                      completed: false,
                      lessons: [
                        { name: "Prototype Chain", completed: false, current: false, url: "/lessons/prototype-chain" },
                        { name: "Inheritance Patterns", completed: false, current: false, url: "/lessons/inheritance" }
                      ]
                    },
                    {
                      title: "Asynchronous JavaScript",
                      completed: false,
                      lessons: [
                        { name: "Promises Deep Dive", completed: false, current: false, url: "/lessons/promises" },
                        { name: "Async/Await Patterns", completed: false, current: false, url: "/lessons/async-await" },
                        { name: "Error Handling", completed: false, current: false, url: "/lessons/error-handling" }
                      ]
                    },
                    {
                      title: "Design Patterns",
                      completed: false,
                      lessons: [
                        { name: "Singleton Pattern", completed: false, current: false, url: "/lessons/singleton" },
                        { name: "Factory Pattern", completed: false, current: false, url: "/lessons/factory" },
                        { name: "Observer Pattern", completed: false, current: false, url: "/lessons/observer" },
                        { name: "Module Pattern", completed: false, current: false, url: "/lessons/module-pattern" }
                      ]
                    },
                    {
                      title: "Performance Optimization",
                      completed: false,
                      lessons: [
                        { name: "Memory Management", completed: false, current: false, url: "/lessons/memory" },
                        { name: "Code Splitting", completed: false, current: false, url: "/lessons/code-splitting" },
                        { name: "Lazy Loading", completed: false, current: false, url: "/lessons/lazy-loading" }
                      ]
                    }
                  ].map((module, i) => {
                    // Check if all lessons are completed
                    const isModuleCompleted = module.lessons.every(lesson => lesson.completed);

                    const handleLessonClick = async (lessonUrl: string, moduleIndex: number, lessonIndex: number) => {
                      try {
                        // Mark the lesson as completed
                        const response = await fetch('/api/course/progress', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            moduleIndex,
                            lessonIndex,
                            completed: true
                          })
                        });

                        if (!response.ok) {
                          throw new Error('Failed to update lesson progress');
                        }

                        // Navigate to lesson content
                        window.location.href = lessonUrl;
                      } catch (error) {
                        console.error('Error updating lesson progress:', error);
                      }
                    };

                    return (
                      <div key={i} className="mb-6 relative">
                        <div className={`
                        border rounded-lg p-4
                        ${module.current ? 'border-primary bg-accent shadow-sm' : 'border-border'}
                      `}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`
                            w-5 h-5 rounded-full z-10 flex items-center justify-center
                            ${isModuleCompleted ? 'bg-primary' : module.current ? 'border-2 border-primary' : 'border-2 border-muted-foreground'}
                          `}>
                              {isModuleCompleted && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className="font-medium">{module.title}</span>
                          </div>

                          <div className="space-y-2 ml-6 border-l-2 pl-4 border-border">
                            {module.lessons.map((lesson, j) => (
                              <button
                                key={j}
                                onClick={() => handleLessonClick(lesson.url, i, j)}
                                className={`
                                block w-full text-left flex items-center gap-2 p-2 rounded-md 
                                transition-all duration-200 ease-in-out
                                hover:bg-accent/50 hover:text-primary hover:-translate-y-0.5
                                hover:underline hover:decoration-primary hover:decoration-2
                                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                                ${lesson.current ? 'bg-accent/50 text-primary font-medium' : ''}
                                ${lesson.completed ? 'text-muted-foreground' : ''}
                              `}
                              >
                                <div className={`
                                w-3 h-3 rounded-full
                                ${lesson.completed ? 'bg-primary/60' : lesson.current ? 'border-2 border-primary' : 'border border-muted-foreground'}
                              `} />
                                <span className="text-sm">{lesson.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Add New Module Section */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-6">
                    + Add New Module
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Module</DialogTitle>
                    <DialogDescription>
                      Create a new module and add its submodules. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="module-name" className="text-sm font-medium">
                        Module Name
                      </label>
                      <input
                        id="module-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Enter module name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Submodules
                      </label>
                      <div className="space-y-2">
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Submodule 1"
                        />
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Submodule 2"
                        />
                        <Button variant="outline" className="w-full">
                          + Add Another Submodule
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Module</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Content Area */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Lexical Scope</h3>

                {/* Video Player */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-accent rounded-lg flex items-center justify-center">
                      <HeroVideoDialogDemoTopInBottomOut />
                    </div>
                  </CardContent>
                </Card>

                {/* Course Materials */}
                <Card className="mb-6">
                  <CardHeader className="text-center">
                    <Card className="p-4">
                      <div className="text-center">
                        <CardTitle className="text-base">Course Materials</CardTitle>
                      </div>
                    </Card>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="space-y-4 w-full max-w-md">
                      <Card className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            <span>Notes.pdf</span>
                          </div>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Link className="h-5 w-5" />
                            <span>Additional Resources</span>
                          </div>
                          <Button variant="outline" size="sm">Visit</Button>
                        </div>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Quiz */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-base">Knowledge Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Card className="p-6">
                        <div className="space-y-4">
                          <Card className="p-4">
                            <div className="font-medium">Question 1</div>
                            <div className="text-sm mt-2">What is the main purpose of closures in JavaScript?</div>
                          </Card>

                          <Card className="p-4">
                            <RadioGroup className="space-y-3">
                              <Card className="p-3 hover:bg-accent transition-colors">
                                <div className="flex items-center space-x-2">
                                  <RadioGroup value="a" id="a" />
                                  <Label htmlFor="a">Data privacy and encapsulation</Label>
                                </div>
                              </Card>
                              <Card className="p-3 hover:bg-accent transition-colors">
                                <div className="flex items-center space-x-2">
                                  <RadioGroup value="b" id="b" />
                                  <Label htmlFor="b">Memory optimization</Label>
                                </div>
                              </Card>
                              <Card className="p-3 hover:bg-accent transition-colors">
                                <div className="flex items-center space-x-2">
                                  <RadioGroup value="c" id="c" />
                                  <Label htmlFor="c">Code organization</Label>
                                </div>
                              </Card>
                            </RadioGroup>
                          </Card>

                          <Card className="p-4">
                            <div className="flex justify-between items-center gap-4">
                              <Input placeholder="feedback" className="max-w-xs" />
                              <Button>Submit Answer</Button>
                            </div>
                          </Card>
                        </div>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Admin editing view - contains the original implementation
  const AdminCourseView = ({ courses }: { courses: any[] }) => {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Course: Advanced JavaScript Concepts</CardTitle>
            <Badge variant="secondary">Progress: 45%</Badge>
          </div>
        </CardHeader>


        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Course Content Navigation */}
            <div className="md:col-span-1 flex flex-col h-full">
              <div className="font-semibold mb-4">Course Modules</div>
              <ScrollArea className="flex-grow pr-4">
                <div className="relative">
                  {/* Vertical line connecting modules */}
                  <div className="absolute left-[18px] top-6 bottom-6 w-0.5 bg-border" />

                  {[
                    {
                      title: "Introduction to Advanced JS",
                      completed: true,
                      lessons: [
                        { name: "Course Overview", completed: true, current: false, url: "/lessons/course-overview" },
                        { name: "Setting Up Environment", completed: true, current: false, url: "/lessons/setup" }
                      ]
                    },
                    {
                      title: "Closures & Scope",
                      completed: false,
                      current: true,
                      lessons: [
                        { name: "Understanding Closures", completed: true, current: false, url: "/lessons/closures" },
                        { name: "Lexical Scope", completed: false, current: true, url: "/lessons/lexical-scope" },
                        { name: "Practical Applications", completed: false, current: false, url: "/lessons/practical-closures" }
                      ]
                    },
                    {
                      title: "Prototypes & Inheritance",
                      completed: false,
                      lessons: [
                        { name: "Prototype Chain", completed: false, current: false, url: "/lessons/prototype-chain" },
                        { name: "Inheritance Patterns", completed: false, current: false, url: "/lessons/inheritance" }
                      ]
                    },
                    {
                      title: "Asynchronous JavaScript",
                      completed: false,
                      lessons: [
                        { name: "Promises Deep Dive", completed: false, current: false, url: "/lessons/promises" },
                        { name: "Async/Await Patterns", completed: false, current: false, url: "/lessons/async-await" },
                        { name: "Error Handling", completed: false, current: false, url: "/lessons/error-handling" }
                      ]
                    },
                    {
                      title: "Design Patterns",
                      completed: false,
                      lessons: [
                        { name: "Singleton Pattern", completed: false, current: false, url: "/lessons/singleton" },
                        { name: "Factory Pattern", completed: false, current: false, url: "/lessons/factory" },
                        { name: "Observer Pattern", completed: false, current: false, url: "/lessons/observer" },
                        { name: "Module Pattern", completed: false, current: false, url: "/lessons/module-pattern" }
                      ]
                    },
                    {
                      title: "Performance Optimization",
                      completed: false,
                      lessons: [
                        { name: "Memory Management", completed: false, current: false, url: "/lessons/memory" },
                        { name: "Code Splitting", completed: false, current: false, url: "/lessons/code-splitting" },
                        { name: "Lazy Loading", completed: false, current: false, url: "/lessons/lazy-loading" }
                      ]
                    }
                  ].map((module, i) => {
                    // Check if all lessons are completed
                    const isModuleCompleted = module.lessons.every(lesson => lesson.completed);

                    const handleLessonClick = async (lessonUrl: string, moduleIndex: number, lessonIndex: number) => {
                      try {
                        // Mark the lesson as completed
                        const response = await fetch('/api/course/progress', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            moduleIndex,
                            lessonIndex,
                            completed: true
                          })
                        });

                        if (!response.ok) {
                          throw new Error('Failed to update lesson progress');
                        }

                        // Navigate to lesson content
                        window.location.href = lessonUrl;
                      } catch (error) {
                        console.error('Error updating lesson progress:', error);
                      }
                    };

                    return (
                      <div key={i} className="mb-6 relative">
                        <div className={`
                        border rounded-lg p-4
                        ${module.current ? 'border-primary bg-accent shadow-sm' : 'border-border'}
                      `}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`
                            w-5 h-5 rounded-full z-10 flex items-center justify-center
                            ${isModuleCompleted ? 'bg-primary' : module.current ? 'border-2 border-primary' : 'border-2 border-muted-foreground'}
                          `}>
                              {isModuleCompleted && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className="font-medium">{module.title}</span>
                          </div>

                          <div className="space-y-2 ml-6 border-l-2 pl-4 border-border">
                            {module.lessons.map((lesson, j) => (
                              <button
                                key={j}
                                onClick={() => handleLessonClick(lesson.url, i, j)}
                                className={`
                                block w-full text-left flex items-center gap-2 p-2 rounded-md 
                                transition-all duration-200 ease-in-out
                                hover:bg-accent/50 hover:text-primary hover:-translate-y-0.5
                                hover:underline hover:decoration-primary hover:decoration-2
                                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                                ${lesson.current ? 'bg-accent/50 text-primary font-medium' : ''}
                                ${lesson.completed ? 'text-muted-foreground' : ''}
                              `}
                              >
                                <div className={`
                                w-3 h-3 rounded-full
                                ${lesson.completed ? 'bg-primary/60' : lesson.current ? 'border-2 border-primary' : 'border border-muted-foreground'}
                              `} />
                                <span className="text-sm">{lesson.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Add New Module Section */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-6">
                    + Add New Module
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Module</DialogTitle>
                    <DialogDescription>
                      Create a new module and add its submodules. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="module-name" className="text-sm font-medium">
                        Module Name
                      </label>
                      <input
                        id="module-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Enter module name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Submodules
                      </label>
                      <div className="space-y-2">
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Submodule 1"
                        />
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Submodule 2"
                        />
                        <Button variant="outline" className="w-full">
                          + Add Another Submodule
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Module</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Lexical Scope</h3>

                {/* Video Player */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-accent rounded-lg flex items-center justify-center">
                      <HeroVideoDialogDemoTopInBottomOut />
                    </div>
                  </CardContent>
                </Card>

                {/* Content Upload Section */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base">Course Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Upload Video Content</label>
                          <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            <input type="file" accept="video/*" className="hidden" id="video-upload" />
                            <label htmlFor="video-upload" className="cursor-pointer">
                              <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Click to upload video</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Upload Documents</label>
                          <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="doc-upload" />
                            <label htmlFor="doc-upload" className="cursor-pointer">
                              <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Click to upload documents</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">External Resources</label>
                        <input
                          type="url"
                          placeholder="Enter Google Drive or external link"
                          className="w-full rounded-md border border-input px-3 py-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quiz Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Knowledge Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Question</label>
                          <input
                            type="text"
                            placeholder="Enter your question"
                            className="w-full rounded-md border border-input px-3 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Answer Type</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select answer type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="radio">Single Choice (Radio)</SelectItem>
                              <SelectItem value="checkbox">Multiple Choice (Checkbox)</SelectItem>
                              <SelectItem value="short">Short Text</SelectItem>
                              <SelectItem value="long">Long Text</SelectItem>
                              <SelectItem value="truefalse">True/False</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <label className="block text-sm font-medium">Answer Options</label>

                          <div className="space-y-3">
                            {/* Dynamic answer options based on type */}
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Enter answer option"
                                className="flex-1 rounded-md border border-input px-3 py-2"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="correct-1"
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="correct-1" className="text-sm">
                                  Correct
                                </label>
                              </div>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Answer Option
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Feedback</label>
                          <textarea
                            placeholder="Enter feedback for correct/incorrect answers"
                            className="w-full rounded-md border border-input px-3 py-2 min-h-[80px]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Question
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview Quiz
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Quiz Preview</DialogTitle>
                                <DialogDescription>
                                  This is how students will see the quiz
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6 py-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Knowledge Check Quiz</CardTitle>
                                    <CardDescription>Test your understanding of the concepts covered</CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                      <div className="font-medium">Question 1</div>
                                      <div className="text-sm">What is the main purpose of closures in JavaScript?</div>
                                      <RadioGroup className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <RadioGroup value="a" id="a" />
                                          <Label htmlFor="a">Data privacy and encapsulation</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroup value="b" id="b" />
                                          <Label htmlFor="b">Memory optimization</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroup value="c" id="c" />
                                          <Label htmlFor="c">Code organization</Label>
                                        </div>
                                      </RadioGroup>
                                    </div>
                                  </CardContent>
                                  <CardFooter>
                                    <Button className="w-full">Submit Answer</Button>
                                  </CardFooter>
                                </Card>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">Questions</h3>
                          <Button variant="outline" size="sm">
                            <Settings2 className="h-4 w-4 mr-2" />
                            Quiz Settings
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {/* Question list/preview */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">Question 1</div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Multiple Choice • 4 Options
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>

      </Card>
    );
  };


  const ConnectView = () => {
    const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
    const [showProfileDialog, setShowProfileDialog] = useState(false);

    type CommunityMember = {
      email: any;
      id: number;
      name: string;
      role: string;
      type: 'mentor' | 'member';
      company?: string;
      expertise: string[];
      bio: string;
      yearsOfExperience: number;
      interests: string[];
      socials: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        website?: string;
      };
      achievements: string[];
      availability?: string[];
      languages?: string[];
      location?: string;
      timezone?: string;
      rating?: number;
      reviews?: {
        author: string;
        text: string;
        rating: number;
      }[];
    };

    const communityMembers: CommunityMember[] = [
      {
        id: 2,
        name: "Alex Rivera",
        role: "Frontend Developer",
        type: "member",
        company: "Startup XYZ",
        expertise: ["React", "TypeScript", "UI/UX"],
        bio: "Passionate about creating beautiful and accessible web experiences. Always eager to learn and share knowledge.",
        yearsOfExperience: 3,
        interests: ["Web Accessibility", "Design Systems", "JavaScript"],
        socials: {
          github: "github.com/arivera",
          twitter: "@arivera_dev"
        },
        achievements: [
          "Created popular React component library",
          "Regular speaker at local tech meetups"
        ],
        location: "Austin, TX",
        timezone: "CST",
        email: undefined
      },
      {
        id: 3,
        name: "Emily Chen",
        role: "Machine Learning Engineer",
        type: "mentor",
        company: "Tesla",
        expertise: ["AI/ML", "Python", "Data Science"],
        bio: "Working on cutting-edge ML applications. Love to mentor aspiring data scientists and ML engineers.",
        yearsOfExperience: 8,
        interests: ["AI Ethics", "Neural Networks", "Computer Vision"],
        socials: {
          linkedin: "linkedin.com/in/emilychen",
          github: "github.com/echen"
        },
        achievements: [
          "Published ML research papers",
          "Built autonomous systems used in production"
        ],
        availability: ["Tue 10-6 EST", "Thu 1-5 EST"],
        languages: ["English", "Mandarin"],
        location: "Boston, MA",
        timezone: "EST",
        rating: 4.8,
        email: undefined
      },
      {
        id: 4,
        name: "Marcus Johnson",
        role: "DevOps Engineer",
        type: "mentor",
        company: "Amazon",
        expertise: ["Kubernetes", "AWS", "CI/CD", "Docker"],
        bio: "Specializing in cloud infrastructure and DevOps practices. Love helping teams improve their deployment processes.",
        yearsOfExperience: 10,
        interests: ["Infrastructure as Code", "Site Reliability", "Automation"],
        socials: {
          linkedin: "linkedin.com/in/marcusj",
          github: "github.com/mjohnson"
        },
        achievements: [
          "AWS Certified Solutions Architect",
          "Kubernetes Certified Administrator",
          "Built scalable infrastructure for unicorn startups"
        ],
        availability: ["Mon-Thu 6-9pm GMT"],
        languages: ["English"],
        location: "London, UK",
        timezone: "GMT",
        rating: 4.7,
        email: undefined
      }
    ];

    return (
      <div className="max-w-7xl mx-auto space-y-6 pt-10">
        <Card>
          <CardHeader>
            <Card className="p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <CardTitle>Community Members</CardTitle>
                <CardDescription>Connect with mentors and fellow developers in our community</CardDescription>
              </div>
            </Card>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-xl">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        {member.company && (
                          <p className="text-sm text-muted-foreground">at {member.company}</p>
                        )}
                        <div className="flex gap-2 items-center">
                          <Badge variant={member.type === 'mentor' ? 'default' : 'secondary'}>
                            {member.type === 'mentor' ? 'Mentor' : 'Member'}
                          </Badge>
                          {member.rating && (
                            <Badge variant="outline">
                              ⭐ {member.rating}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 h-[80px]">
                      <h4 className="font-medium mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-2 h-[48px] overflow-hidden">
                        {member.expertise.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    {member.location && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{member.location}</span>
                      </div>
                    )}

                    <Button
                      className="w-full mt-4"
                      onClick={() => {
                        setSelectedMember(member);
                        setShowProfileDialog(true);
                      }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="w-[95vw] max-w-7xl">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                {selectedMember?.name}
                {selectedMember?.type === 'mentor' && (
                  <Badge variant="secondary">Mentor</Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-lg flex items-center gap-2">
                <span>{selectedMember?.role}</span>
                {selectedMember?.company && (
                  <>
                    <span>•</span>
                    <span>{selectedMember.company}</span>
                  </>
                )}
                {selectedMember?.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedMember.location}
                    </span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* About Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{selectedMember?.bio}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedMember?.yearsOfExperience} years experience
                      </div>
                      {selectedMember?.timezone && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {selectedMember.timezone}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills & Expertise Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedMember?.expertise.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                    {selectedMember?.languages && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.languages.map((language, i) => (
                            <Badge key={i} variant="outline">{language}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Objectives & Goals Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Objectives & Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedMember?.interests.map((interest, i) => (
                        <Badge key={i} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                    {selectedMember?.achievements && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Achievements</h4>
                        {selectedMember.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <Menubar className="border-none bg-transparent p-0">
                  <MenubarMenu>
                    <MenubarTrigger className="flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm font-medium outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-50">
                      Actions
                    </MenubarTrigger>
                    <MenubarContent className="min-w-[12rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50">
                      {Object.entries(selectedMember?.socials || {}).map(([platform, url]) => (
                        url && (
                          <MenubarItem
                            key={platform}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50"
                            onClick={() => window.open(url, '_blank')}
                          >
                            <div className="flex items-center gap-2">
                              {platform === 'github' && <Github className="h-4 w-4" />}
                              {platform === 'twitter' && <Twitter className="h-4 w-4" />}
                              {platform === 'linkedin' && <Linkedin className="h-4 w-4" />}
                              {platform === 'website' && <Globe className="h-4 w-4" />}
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </div>
                          </MenubarItem>
                        )
                      ))}
                      <MenubarSeparator className="-mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-800" />
                      <MenubarSub>
                        <MenubarSubTrigger>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Options
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                          <MenubarItem
                            onClick={() => {
                              // Handle direct message
                              if (selectedMember) {
                                toast({
                                  title: "Message Started",
                                  description: `Starting chat with ${selectedMember.name}`,
                                  duration: 3000,
                                })
                              }
                            }}
                          >
                            Direct Message
                          </MenubarItem>
                          <MenubarItem
                            onClick={() => {
                              // Handle email
                              if (selectedMember?.email) {
                                window.location.href = `mailto:${selectedMember.email}`
                              }
                            }}
                          >
                            Send Email
                          </MenubarItem>
                        </MenubarSubContent>
                      </MenubarSub>
                      <MenubarSub>
                        <MenubarSubTrigger>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Mentorship
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                          <MenubarItem
                            onClick={() => {
                              if (selectedMember) {
                                toast({
                                  title: "Mentorship Request Sent",
                                  description: `Your request has been sent to ${selectedMember.name}`,
                                  duration: 3000,
                                })
                              }
                            }}
                          >
                            Request Mentorship
                          </MenubarItem>
                          <MenubarItem
                            onClick={() => {
                              if (selectedMember) {
                                toast({
                                  title: "Schedule Meeting",
                                  description: "Opening calendar to schedule a meeting",
                                  duration: 3000,
                                })
                              }
                            }}
                          >
                            Schedule Meeting
                          </MenubarItem>
                        </MenubarSubContent>
                      </MenubarSub>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };


  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block w-64 border-r">
        <Sidebar />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="md:hidden p-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 p-6">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'spaces' && <SpacesView />}
        {currentView === 'schedule' && <ScheduleView />}
        {currentView === 'resources' && <ResourcesView />}
        {currentView === 'course' && <CourseView />}
        {currentView === 'connect' && <ConnectView />}
        {currentView === 'youtube' && <YoutubeView />}
        {currentView === 'tiktok' && <TikTokView />}
        {currentView === 'twitter' && <TwitterView />}
        {currentView === 'instagram' && <InstagramView />}
      </div>
    </div>
  );
}
