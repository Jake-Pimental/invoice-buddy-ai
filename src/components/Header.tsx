
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
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
