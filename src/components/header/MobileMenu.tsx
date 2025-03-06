
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, SearchIcon } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onUploadClick: () => void;
}

const MobileMenu = ({ isOpen, setIsOpen, onUploadClick }: MobileMenuProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close menu when changing route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 animate-slide-down absolute left-0 right-0 top-16 bg-white z-20">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/") ? "text-blue-600 bg-blue-50" : ""
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/invoices"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/invoices") ? "text-blue-600 bg-blue-50" : ""
              )}
            >
              Invoices
            </Link>
            <Link
              to="/clients"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/clients") ? "text-blue-600 bg-blue-50" : ""
              )}
            >
              Clients
            </Link>
            <Link
              to="/inbox"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/inbox") ? "text-blue-600 bg-blue-50" : ""
              )}
            >
              <div className="flex items-center">
                Inbox
                <div className="ml-1 bg-blue-100 text-blue-800 px-1.5 rounded-full text-xs">3</div>
              </div>
            </Link>
            <Link
              to="/analytics"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/analytics") ? "text-blue-600 bg-blue-50" : ""
              )}
            >
              Analytics
            </Link>
            <Link
              to="/workflow"
              className={cn(
                "block py-2 px-3 text-base font-medium rounded-md hover:bg-gray-50",
                isActive("/workflow") ? "text-blue-600 bg-blue-50" : ""
              )}
            >
              Workflow
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
                setIsOpen(false);
              }}
              className="w-full mt-3"
            >
              Upload Invoice
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
