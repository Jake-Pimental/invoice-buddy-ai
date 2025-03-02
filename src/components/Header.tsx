
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  SearchIcon,
  Menu,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onUploadClick: () => void;
}

const Header = ({ onUploadClick }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          )}
          
          <Link to="/" className="font-semibold text-xl tracking-tight mr-4 text-blue-600">
            InvoiceAI
          </Link>
          
          {!isMobile && (
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/"
                className={cn(
                  "transition-colors hover:text-blue-600",
                  isActive("/") ? "text-blue-600" : "text-gray-600"
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/invoices"
                className={cn(
                  "transition-colors hover:text-blue-600",
                  isActive("/invoices") ? "text-blue-600" : "text-gray-600"
                )}
              >
                Invoices
              </Link>
              <Link
                to="/clients"
                className={cn(
                  "transition-colors hover:text-blue-600",
                  isActive("/clients") ? "text-blue-600" : "text-gray-600"
                )}
              >
                Clients
              </Link>
              <Link
                to="/analytics"
                className={cn(
                  "transition-colors hover:text-blue-600",
                  isActive("/analytics") ? "text-blue-600" : "text-gray-600"
                )}
              >
                Analytics
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {!isMobile && (
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Search..."
                className="w-64 rounded-md border border-gray-200 bg-white py-2 pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
          
          <Button
            onClick={onUploadClick}
            className="hidden md:flex"
            size="sm"
          >
            Upload Invoice
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
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
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircleIcon className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 animate-slide-down">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/") ? "text-blue-600 bg-blue-50" : ""
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/invoices"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/invoices") ? "text-blue-600 bg-blue-50" : ""
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Invoices
            </Link>
            <Link
              to="/clients"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/clients") ? "text-blue-600 bg-blue-50" : ""
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Clients
            </Link>
            <Link
              to="/analytics"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/analytics") ? "text-blue-600 bg-blue-50" : ""
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <div className="relative mt-3">
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="search"
                placeholder="Search..."
                className="block w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={() => {
                onUploadClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-3"
            >
              Upload Invoice
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
