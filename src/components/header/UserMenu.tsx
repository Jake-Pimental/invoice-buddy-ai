
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
  HelpCircleIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";

const UserMenu = () => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-600 dark:text-gray-300"
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
            aria-label="Account menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200">
                JD
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800 dark:border-gray-700">
          <DropdownMenuLabel className="dark:text-gray-200">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:border-gray-700" />
          <DropdownMenuItem className="dark:text-gray-200 dark:focus:bg-gray-700">
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="dark:text-gray-200 dark:focus:bg-gray-700">
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            <span>Help</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:border-gray-700" />
          <DropdownMenuItem className="text-red-600 dark:text-red-400 dark:focus:bg-gray-700">
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
