
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./header/Logo";
import MobileMenu from "./header/MobileMenu";
import DesktopNav from "./header/DesktopNav";
import UserMenu from "./header/UserMenu";

interface HeaderProps {
  onUploadClick: () => void;
}

const Header = ({ onUploadClick }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock unread count - in a real app, this would come from an API or context
  const unreadCount = 2;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {isMobile && (
            <MobileMenu 
              isOpen={isMobileMenuOpen} 
              setIsOpen={setIsMobileMenuOpen} 
              onUploadClick={onUploadClick}
            />
          )}
          
          <Logo />
          
          {!isMobile && <DesktopNav />}
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/inbox" className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600"
              title="Smart Inbox"
            >
              <Inbox className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Link>
          
          {!isMobile && (
            <Button
              onClick={onUploadClick}
              className="hidden md:flex"
              size="sm"
            >
              Upload Invoice
            </Button>
          )}
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
