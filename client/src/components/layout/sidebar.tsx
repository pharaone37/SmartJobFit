import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Video, 
  BarChart3, 
  Settings, 
  User,
  Bell,
  BookOpen,
  Target,
  TrendingUp,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location === '/dashboard'
    },
    {
      name: 'Job Search',
      href: '/jobs',
      icon: Search,
      current: location === '/jobs'
    },
    {
      name: 'Resume Optimizer',
      href: '/resume',
      icon: FileText,
      current: location === '/resume'
    },
    {
      name: 'Interview Prep',
      href: '/interview',
      icon: Video,
      current: location === '/interview'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: location === '/analytics'
    },
  ];

  const secondaryNavigation = [
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      current: location === '/profile'
    },
    {
      name: 'Subscription',
      href: '/pricing',
      icon: Settings,
      current: location === '/pricing'
    },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Logo */}
      <div className="flex items-center space-x-2 p-6">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold gradient-text">JobMatch AI</span>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                item.current && "bg-primary text-primary-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h4 className="px-3 text-sm font-medium text-muted-foreground">
            Settings
          </h4>
          {secondaryNavigation.map((item) => (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                item.current && "bg-primary text-primary-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="px-3 text-sm font-medium text-muted-foreground">
            Quick Actions
          </h4>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Target className="mr-2 h-4 w-4" />
            Job Alerts
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <TrendingUp className="mr-2 h-4 w-4" />
            Salary Insights
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            Interview Questions
          </Button>
        </div>
      </ScrollArea>

      {/* Bottom section */}
      <div className="p-3 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-muted-foreground">All systems operational</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
