
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

const DesktopNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link
          to="/"
          className={cn(
            "transition-colors hover:text-blue-500 dark:hover:text-blue-400",
            isActive("/") 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-300"
          )}
        >
          Dashboard
        </Link>
        <Link
          to="/invoices"
          className={cn(
            "transition-colors hover:text-blue-500 dark:hover:text-blue-400",
            isActive("/invoices") 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-300"
          )}
        >
          Invoices
        </Link>
        <Link
          to="/clients"
          className={cn(
            "transition-colors hover:text-blue-500 dark:hover:text-blue-400",
            isActive("/clients") 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-300"
          )}
        >
          Clients
        </Link>
        <Link
          to="/inbox"
          className={cn(
            "transition-colors hover:text-blue-500 dark:hover:text-blue-400",
            isActive("/inbox") 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-300"
          )}
        >
          <div className="flex items-center">
            Inbox
            <div className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 rounded-full text-xs">3</div>
          </div>
        </Link>
        <Link
          to="/analytics"
          className={cn(
            "transition-colors hover:text-blue-500 dark:hover:text-blue-400",
            isActive("/analytics") 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-300"
          )}
        >
          Analytics
        </Link>
        <Link
          to="/workflow"
          className={cn(
            "transition-colors hover:text-blue-500 dark:hover:text-blue-400",
            isActive("/workflow") 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-gray-600 dark:text-gray-300"
          )}
        >
          Workflow
        </Link>
      </div>
      
      <div className="relative hidden md:block">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <input
          type="search"
          placeholder="Search..."
          className="w-64 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-gray-200 dark:placeholder:text-gray-400"
        />
      </div>
    </>
  );
};

export default DesktopNav;
