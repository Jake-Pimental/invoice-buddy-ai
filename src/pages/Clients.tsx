
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/EmptyState";
import { UserIcon, SearchIcon, PlusIcon, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  invoiceCount: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  avatar?: string;
}

const MOCK_CLIENTS: Client[] = [
  {
    id: "c1",
    name: "John Doe",
    email: "john@acmecorp.com",
    phone: "555-123-4567",
    company: "Acme Corporation",
    invoiceCount: 5,
    totalSpent: 12600,
    status: 'active'
  },
  {
    id: "c2",
    name: "Jane Smith",
    email: "jane@techstart.io",
    phone: "555-987-6543",
    company: "TechStart Inc.",
    invoiceCount: 3,
    totalSpent: 8400,
    status: 'active'
  },
  {
    id: "c3",
    name: "Robert Johnson",
    email: "robert@globaldesigns.com",
    company: "Global Designs",
    invoiceCount: 2,
    totalSpent: 3500,
    status: 'inactive'
  },
  {
    id: "c4",
    name: "Sarah Williams",
    email: "sarah@cityservices.net",
    phone: "555-456-7890",
    company: "City Services Ltd.",
    invoiceCount: 4,
    totalSpent: 9750,
    status: 'active'
  }
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'invoiceCount'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSortChange = (field: 'name' | 'totalSpent' | 'invoiceCount') => {
    if (sortBy === field) {
      // Toggle direction if the same field is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const filteredClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'totalSpent') {
        return sortDirection === 'asc' 
          ? a.totalSpent - b.totalSpent 
          : b.totalSpent - a.totalSpent;
      } else {
        return sortDirection === 'asc' 
          ? a.invoiceCount - b.invoiceCount 
          : b.invoiceCount - a.invoiceCount;
      }
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleUploadClick = () => {
    // In a real app, this would open a modal to add a new client
    console.log("Open add client modal");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onUploadClick={handleUploadClick} />
      
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="w-full animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">Clients</CardTitle>
                <CardDescription>
                  Manage your client relationships
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search clients..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleUploadClick()}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredClients.length === 0 ? (
              <EmptyState
                title="No clients found"
                description={
                  searchQuery 
                    ? "Try adjusting your search terms" 
                    : "Add your first client to get started"
                }
                buttonText="Add Client"
                buttonIcon={<PlusIcon className="h-4 w-4 mr-2" />}
                onButtonClick={handleUploadClick}
                illustration={<UserIcon className="h-12 w-12 text-gray-300" />}
              />
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          className="flex items-center font-medium text-gray-500"
                          onClick={() => handleSortChange('name')}
                        >
                          Client
                          {sortBy === 'name' && (
                            <ArrowUpDown className={cn(
                              "ml-1 h-4 w-4 text-gray-400",
                              sortDirection === 'asc' ? 'transform rotate-180' : ''
                            )} />
                          )}
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        <button 
                          className="flex items-center font-medium text-gray-500"
                          onClick={() => handleSortChange('invoiceCount')}
                        >
                          Invoices
                          {sortBy === 'invoiceCount' && (
                            <ArrowUpDown className={cn(
                              "ml-1 h-4 w-4 text-gray-400",
                              sortDirection === 'asc' ? 'transform rotate-180' : ''
                            )} />
                          )}
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          className="flex items-center justify-end font-medium text-gray-500"
                          onClick={() => handleSortChange('totalSpent')}
                        >
                          Total Spent
                          {sortBy === 'totalSpent' && (
                            <ArrowUpDown className={cn(
                              "ml-1 h-4 w-4 text-gray-400",
                              sortDirection === 'asc' ? 'transform rotate-180' : ''
                            )} />
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Avatar>
                                <AvatarImage src={client.avatar} alt={client.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {client.name.charAt(0) + (client.name.split(' ')[1]?.charAt(0) || '')}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{client.name}</div>
                              <div className="text-sm text-gray-500">{client.company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-900">{client.email}</div>
                          <div className="text-sm text-gray-500">{client.phone || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {client.invoiceCount}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(client.totalSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Clients;
