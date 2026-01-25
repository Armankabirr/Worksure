import { Complaint, ComplaintStatus, ComplaintPriority } from '@/types/complaint';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  MoreVertical,
  UserPlus,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';

interface ComplaintTableProps {
  complaints: Complaint[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onViewDetails: (complaint: Complaint) => void;
  onChangeStatus: (complaint: Complaint) => void;
  onAssignAdmin: (complaint: Complaint) => void;
  onAddNote: (complaint: Complaint) => void;
  onResolve: (complaint: Complaint) => void;
  onReject: (complaint: Complaint) => void;
}

export default function ComplaintTable({
  complaints,
  isLoading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onViewDetails,
  onChangeStatus,
  onAssignAdmin,
  onAddNote,
  onResolve,
  onReject,
}: ComplaintTableProps) {
  const getStatusBadge = (status: ComplaintStatus) => {
    const statusConfig = {
      open: { label: 'Open', className: 'bg-orange-100 text-orange-800 border-orange-300' },
      under_review: { label: 'Under Review', className: 'bg-purple-100 text-purple-800 border-purple-300' },
      awaiting_response: { label: 'Awaiting Response', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800 border-green-300' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-300' },
      closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800 border-gray-300' },
    };

    const config = statusConfig[status] || statusConfig.open;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ComplaintPriority) => {
    const priorityConfig = {
      high: { label: 'High', className: 'bg-red-100 text-red-800 border-red-300' },
      medium: { label: 'Medium', className: 'bg-orange-100 text-orange-800 border-orange-300' },
      low: { label: 'Low', className: 'bg-green-100 text-green-800 border-green-300' },
    };

    const config = priorityConfig[priority] || priorityConfig.low;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (complaints.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Complaints Found</h3>
          <p className="text-gray-600">No complaints match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sub-Category</TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Raised By</TableHead>
                <TableHead>Against</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-xs">
                    {complaint.complaintId || complaint.id.substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium">{complaint.category}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {complaint.subCategory}
                  </TableCell>
                  <TableCell>
                    {complaint.booking ? (
                      <span className="font-mono text-xs">{complaint.booking.id}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{complaint.raisedBy.name}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {complaint.raisedBy.role}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{complaint.against.name}</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {complaint.against.role}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                  <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(complaint.updatedAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewDetails(complaint)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onChangeStatus(complaint)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAssignAdmin(complaint)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddNote(complaint)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Add Note
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onResolve(complaint)}
                          disabled={complaint.status === 'resolved' || complaint.status === 'closed'}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Resolve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onReject(complaint)}
                          disabled={complaint.status === 'rejected' || complaint.status === 'closed'}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalCount)} of{' '}
            {totalCount} complaints
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
