import { useState, useEffect, useMemo } from 'react';
import { Complaint, ComplaintFilters, ComplaintStats, ComplaintStatus } from '@/types/complaint';
import { complaintService } from '@/services/complaintService';
import ComplaintStatsCards from '@/components/admin/ComplaintStatsCards';
import ComplaintFiltersComponent from '@/components/admin/ComplaintFilters';
import ComplaintTable from '@/components/admin/ComplaintTable';
import ComplaintDetailDrawer from '@/components/admin/ComplaintDetailDrawer';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * AdminComplaints Component
 * 
 * Comprehensive complaints management page for administrators.
 * Features include filtering, searching, status management, and detailed complaint views.
 */
const AdminComplaints = () => {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<ComplaintFilters>({
    search: '',
    status: 'all',
    category: 'all',
    subCategory: 'all',
    priority: 'all',
    raisedBy: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // Client-side filtering for search, sub-category, raisedBy, and dates
  const filteredComplaints = useMemo(() => {
    let filtered = complaints;

    // Search filter (client-side)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.complaintId.toLowerCase().includes(searchLower) ||
          c.booking?.id.toLowerCase().includes(searchLower) ||
          c.raisedBy.name.toLowerCase().includes(searchLower) ||
          c.against.name.toLowerCase().includes(searchLower)
      );
    }

    // Sub-category filter (client-side)
    if (filters.subCategory && filters.subCategory !== 'all') {
      filtered = filtered.filter((c) => c.subCategory === filters.subCategory);
    }

    // Raised by filter (client-side)
    if (filters.raisedBy && filters.raisedBy !== 'all') {
      filtered = filtered.filter((c) => c.raisedBy.role === filters.raisedBy);
    }

    // Date range filter (client-side)
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((c) => new Date(c.createdAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((c) => new Date(c.createdAt) <= toDate);
    }

    return filtered;
  }, [complaints, filters]);

  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    type: 'status' | 'assign' | 'note' | null;
    complaint: Complaint | null;
  }>({ isOpen: false, type: null, complaint: null });

  const [dialogInputs, setDialogInputs] = useState({
    status: 'under_review' as ComplaintStatus,
    reason: '',
    note: '',
    adminId: '',
  });

  // Fetch complaints and stats from API
  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Fetching complaints from API...');
      
      // Fetch complaints with only the filters supported by API
      const complaintsResponse = await complaintService.getAllComplaints(filters, currentPage, 10);

      console.log('✅ API Response:', complaintsResponse);

      if (complaintsResponse.success) {
        console.log('📊 Setting complaints:', complaintsResponse.data?.length, 'items');
        const complaintsData = complaintsResponse.data || [];
        setComplaints(complaintsData);
        setTotalPages(complaintsResponse.pagination?.totalPages || 1);
        setTotalCount(complaintsResponse.pagination?.totalCount || 0);

        // Calculate stats from complaints data
        const calculatedStats: ComplaintStats = {
          total: complaintsData.length,
          open: complaintsData.filter(c => c.status === 'open').length,
          underReview: complaintsData.filter(c => c.status === 'under_review').length,
          awaitingResponse: complaintsData.filter(c => c.status === 'awaiting_response').length,
          resolved: complaintsData.filter(c => c.status === 'resolved').length,
          rejected: complaintsData.filter(c => c.status === 'rejected').length,
          closed: complaintsData.filter(c => c.status === 'closed').length,
        };
        setStats(calculatedStats);
      } else {
        throw new Error(complaintsResponse.message || 'Failed to fetch complaints');
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch complaints',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // View complaint details - now fetches full details from API
  const handleViewDetails = async (complaint: Complaint) => {
    try {
      const response = await complaintService.getComplaintById(complaint.id);
      if (response.success && response.data) {
        setSelectedComplaint(response.data);
        setDetailDrawerOpen(true);
      } else {
        // Fallback to the complaint from list if detail fetch fails
        setSelectedComplaint(complaint);
        setDetailDrawerOpen(true);
      }
    } catch (error) {
      // Fallback to the complaint from list if detail fetch fails
      setSelectedComplaint(complaint);
      setDetailDrawerOpen(true);
    }
  };

  const handleFilterChange = (newFilters: ComplaintFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleStatusChange = (complaint: Complaint) => {
    setActionDialog({ isOpen: true, type: 'status', complaint });
    setDialogInputs({ ...dialogInputs, status: complaint.status });
  };

  const handleAssign = (complaint: Complaint) => {
    setActionDialog({ isOpen: true, type: 'assign', complaint });
  };

  const handleAddNote = (complaint: Complaint) => {
    setActionDialog({ isOpen: true, type: 'note', complaint });
  };

  const handleCloseActionDialog = () => {
    setActionDialog({ isOpen: false, type: null, complaint: null });
    setDialogInputs({
      status: 'under_review',
      reason: '',
      note: '',
      adminId: '',
    });
  };

  const confirmAction = async () => {
    if (!actionDialog.complaint) return;

    try {
      let response;

      switch (actionDialog.type) {
        case 'status':
          response = await complaintService.updateComplaintStatus(
            actionDialog.complaint.id,
            dialogInputs.status,
            dialogInputs.reason || undefined
          );
          break;

        case 'assign':
          response = await complaintService.assignComplaint(
            actionDialog.complaint.id,
            dialogInputs.adminId
          );
          break;

        case 'note':
          response = await complaintService.addAdminNote(
            actionDialog.complaint.id,
            dialogInputs.note,
            actionDialog.complaint.status
          );
          break;

        default:
          return;
      }

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Action completed successfully',
        });
        await fetchComplaints(); // Refresh the list
        handleCloseActionDialog();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to complete action',
        variant: 'destructive',
      });
    }
  };

  const handleExportData = () => {
    // Export functionality would go here
    toast({
      title: 'Export Started',
      description: 'Your data export is being prepared...',
    });
  };

  useEffect(() => {
    fetchComplaints();
  }, [filters.status, filters.category, filters.priority, currentPage]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and resolve user and worker complaints
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchComplaints}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ComplaintStatsCards stats={stats} isLoading={isLoading} />

      {/* Filters */}
      <ComplaintFiltersComponent
        filters={filters}
        onFiltersChange={handleFilterChange}
        onClearFilters={() => {
          setFilters({
            search: '',
            status: 'all',
            category: 'all',
            subCategory: 'all',
            priority: 'all',
            raisedBy: 'all',
            dateFrom: '',
            dateTo: '',
          });
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      <ComplaintTable
        complaints={filteredComplaints}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onChangeStatus={handleStatusChange}
        onAssignAdmin={handleAssign}
        onAddNote={handleAddNote}
        onResolve={(complaint) => {
          // This would typically open a dialog for resolution text
          handleStatusChange(complaint);
        }}
        onReject={(complaint) => {
          // This would typically open a dialog for rejection reason
          handleStatusChange(complaint);
        }}
      />

      {/* Detail Drawer */}
      <ComplaintDetailDrawer
        complaint={selectedComplaint}
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        onStatusUpdate={async (complaintId, status, reason) => {
          const response = await complaintService.updateComplaintStatus(complaintId, status, reason);
          if (response.success) {
            toast({ title: 'Success', description: 'Status updated successfully' });
            await fetchComplaints();
            setDetailDrawerOpen(false);
          } else {
            toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
          }
        }}
        onAddNote={async (complaintId, note) => {
          const complaint = complaints.find(c => c.id === complaintId);
          if (complaint) {
            const response = await complaintService.addAdminNote(complaintId, note, complaint.status);
            if (response.success) {
              toast({ title: 'Success', description: 'Note added successfully' });
              await fetchComplaints();
            } else {
              toast({ title: 'Error', description: 'Failed to add note', variant: 'destructive' });
            }
          }
        }}
        onResolve={async (complaintId, resolution) => {
          const response = await complaintService.resolveComplaint(complaintId, resolution);
          if (response.success) {
            toast({ title: 'Success', description: 'Complaint resolved successfully' });
            await fetchComplaints();
            setDetailDrawerOpen(false);
          } else {
            toast({ title: 'Error', description: 'Failed to resolve complaint', variant: 'destructive' });
          }
        }}
        onReject={async (complaintId, reason) => {
          const response = await complaintService.rejectComplaint(complaintId, reason);
          if (response.success) {
            toast({ title: 'Success', description: 'Complaint rejected successfully' });
            await fetchComplaints();
            setDetailDrawerOpen(false);
          } else {
            toast({ title: 'Error', description: 'Failed to reject complaint', variant: 'destructive' });
          }
        }}
      />

      {/* Action Dialog */}
      <AlertDialog open={actionDialog.isOpen} onOpenChange={handleCloseActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.type === 'status' && 'Update Complaint Status'}
              {actionDialog.type === 'assign' && 'Assign Complaint'}
              {actionDialog.type === 'note' && 'Add Admin Note'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.type === 'status' && 'Change the complaint status and optionally add a reason.'}
              {actionDialog.type === 'assign' && 'Assign this complaint to an admin for review.'}
              {actionDialog.type === 'note' && 'Add an internal note for admin reference.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {actionDialog.type === 'status' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={dialogInputs.status}
                    onValueChange={(value) =>
                      setDialogInputs({ ...dialogInputs, status: value as ComplaintStatus })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="awaiting_response">Awaiting Response</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain why the status is being changed..."
                    value={dialogInputs.reason}
                    onChange={(e) =>
                      setDialogInputs({ ...dialogInputs, reason: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {actionDialog.type === 'assign' && (
              <div className="space-y-2">
                <Label htmlFor="adminId">Assign to Admin</Label>
                <Input
                  id="adminId"
                  placeholder="Enter admin ID"
                  value={dialogInputs.adminId}
                  onChange={(e) =>
                    setDialogInputs({ ...dialogInputs, adminId: e.target.value })
                  }
                />
              </div>
            )}

            {actionDialog.type === 'note' && (
              <div className="space-y-2">
                <Label htmlFor="note">Admin Note</Label>
                <Textarea
                  id="note"
                  placeholder="Enter your note here..."
                  value={dialogInputs.note}
                  onChange={(e) =>
                    setDialogInputs({ ...dialogInputs, note: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminComplaints;
