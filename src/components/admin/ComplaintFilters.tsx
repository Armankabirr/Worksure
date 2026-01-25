import { ComplaintFilters, COMPLAINT_CATEGORIES, ComplaintPriority, ComplaintStatus } from '@/types/complaint';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Calendar } from 'lucide-react';

interface ComplaintFiltersComponentProps {
  filters: ComplaintFilters;
  onFiltersChange: (filters: ComplaintFilters) => void;
  onClearFilters: () => void;
}

export default function ComplaintFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: ComplaintFiltersComponentProps) {
  const handleFilterChange = (key: keyof ComplaintFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const categories = Object.keys(COMPLAINT_CATEGORIES);
  const subCategories = filters.category && filters.category !== 'all' 
    ? COMPLAINT_CATEGORIES[filters.category as keyof typeof COMPLAINT_CATEGORIES] || []
    : [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="ID, booking, user, worker..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => {
                onFiltersChange({ ...filters, category: value, subCategory: 'all' });
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="subCategory">Sub-Category</Label>
            <Select
              value={filters.subCategory}
              onValueChange={(value) => handleFilterChange('subCategory', value)}
              disabled={!filters.category || filters.category === 'all'}
            >
              <SelectTrigger id="subCategory">
                <SelectValue placeholder="All Sub-Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub-Categories</SelectItem>
                {subCategories.map((subCategory) => (
                  <SelectItem key={subCategory} value={subCategory}>
                    {subCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={filters.priority}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Raised By Filter
          <div className="space-y-2">
            <Label htmlFor="raisedBy">Raised By</Label>
            <Select
              value={filters.raisedBy}
              onValueChange={(value) => handleFilterChange('raisedBy', value)}
            >
              <SelectTrigger id="raisedBy">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="worker">Worker</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Date From
          <div className="space-y-2">
            <Label htmlFor="dateFrom">Date From</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="pl-9"
              />
            </div>
          </div> */}

          {/* Date To
          <div className="space-y-2">
            <Label htmlFor="dateTo">Date To</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="pl-9"
              />
            </div>
          </div> */}

          {/* Clear Filters Button */}
          <div className="space-y-2 flex items-end">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
