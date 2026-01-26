import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingFilters } from '@/types/booking';
import { Search, X, Filter } from 'lucide-react';

interface BookingFiltersProps {
  filters: BookingFilters;
  onFiltersChange: (filters: BookingFilters) => void;
  onClearFilters: () => void;
}

const BookingFiltersComponent = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: BookingFiltersProps) => {
  const [showFilters, setShowFilters] = useState(true);

  // Validate date string format (YYYY-MM-DD)
  const isValidDate = (dateString: string): boolean => {
    // Check if date string matches YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    // Check if it's a valid date
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    // For date fields, only update if the date is valid or empty
    if (key === 'dateFrom' || key === 'dateTo') {
      if (value === '' || isValidDate(value)) {
        onFiltersChange({ ...filters, [key]: value });
      }
      // If invalid, don't update the filter (prevents malformed dates from being sent)
    } else {
      onFiltersChange({ ...filters, [key]: value });
    }
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.paymentStatus !== 'all' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Filters & Search</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Booking ID, User Name, Phone, or Worker Name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Booking Status */}
              <div>
                <label className="text-sm font-medium mb-1 block">Booking Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="awaiting">Awaiting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service Category */}
              <div>
                <label className="text-sm font-medium mb-1 block">Service Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="electrician">Electrician</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="babysitting">Babysitting</SelectItem>
                    <SelectItem value="pet-care">Pet Care</SelectItem>
                    <SelectItem value="ac-doctor">AC Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-sm font-medium mb-1 block">Payment Status</label>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) => handleFilterChange('paymentStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div>
                <label className="text-sm font-medium mb-1 block">From Date</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>

              {/* Date To */}
              <div>
                <label className="text-sm font-medium mb-1 block">To Date</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookingFiltersComponent;
