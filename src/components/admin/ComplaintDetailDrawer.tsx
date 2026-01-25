import { useState } from 'react';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  User,
  Briefcase,
  CreditCard,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { format } from 'date-fns';
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

interface ComplaintDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint | null;
  onStatusUpdate: (complaintId: string, status: ComplaintStatus, reason?: string) => void;
  onAddNote: (complaintId: string, note: string) => void;
  onResolve: (complaintId: string, resolution: string) => void;
  onReject: (complaintId: string, reason: string) => void;
}

export default function ComplaintDetailDrawer({
  open,
  onOpenChange,
  complaint,
  onStatusUpdate,
  onAddNote,
  onResolve,
  onReject,
}: ComplaintDetailDrawerProps) {
  const [newNote, setNewNote] = useState('');
  const [resolution, setResolution] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    type: 'resolve' | 'reject' | 'close' | null;
  }>({ isOpen: false, type: null });

  if (!complaint) return null;

  const getStatusBadge = (status: ComplaintStatus) => {
    const statusConfig = {
      open: { label: 'Open', className: 'bg-orange-100 text-orange-800' },
      under_review: { label: 'Under Review', className: 'bg-purple-100 text-purple-800' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
      closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status] || statusConfig.open;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { label: 'High', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Medium', className: 'bg-orange-100 text-orange-800' },
      low: { label: 'Low', className: 'bg-green-100 text-green-800' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(complaint.id, newNote);
      setNewNote('');
    }
  };

  const handleResolve = () => {
    if (resolution.trim()) {
      onResolve(complaint.id, resolution);
      setResolution('');
      setActionDialog({ isOpen: false, type: null });
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(complaint.id, rejectionReason);
      setRejectionReason('');
      setActionDialog({ isOpen: false, type: null });
    }
  };

  const canChangeStatus = !['resolved', 'rejected', 'closed'].includes(complaint.status);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Complaint Details
            </SheetTitle>
            <SheetDescription>
              Complaint ID: {complaint.complaintId}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Status and Priority */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(complaint.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Priority:</span>
                {getPriorityBadge(complaint.priority)}
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="parties">Parties</TabsTrigger>
                <TabsTrigger value="booking">Booking</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500">Category</Label>
                    <p className="font-medium">{complaint.category}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Sub-Category</Label>
                    <p className="font-medium">{complaint.subCategory}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Subject</Label>
                    <p className="font-medium">{complaint.subject}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Description</Label>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {complaint.description}
                    </p>
                  </div>

                  {complaint.attachments && complaint.attachments.length > 0 && (
                    <div>
                      <Label className="text-xs text-gray-500">Attachments</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {complaint.attachments.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border rounded-lg p-2 hover:bg-gray-50 flex items-center justify-center"
                          >
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-xs text-gray-500">Created</Label>
                      <p>{format(new Date(complaint.createdAt), 'PPp')}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Last Updated</Label>
                      <p>{format(new Date(complaint.updatedAt), 'PPp')}</p>
                    </div>
                    {complaint.resolvedAt && (
                      <div>
                        <Label className="text-xs text-gray-500">Resolved At</Label>
                        <p>{format(new Date(complaint.resolvedAt), 'PPp')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Parties Tab */}
              <TabsContent value="parties" className="space-y-4">
                {/* Raised By */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold">Raised By</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={complaint.raisedBy.avatar} />
                      <AvatarFallback>
                        {complaint.raisedBy.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{complaint.raisedBy.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{complaint.raisedBy.role}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">{complaint.raisedBy.email}</p>
                    <p className="text-gray-600">{complaint.raisedBy.phone}</p>
                  </div>
                </div>

                {/* Against */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <h4 className="font-semibold">Against</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={complaint.against.avatar} />
                      <AvatarFallback>
                        {complaint.against.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{complaint.against.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{complaint.against.role}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">{complaint.against.email}</p>
                    <p className="text-gray-600">{complaint.against.phone}</p>
                  </div>
                </div>
              </TabsContent>

              {/* Booking Tab */}
              <TabsContent value="booking" className="space-y-4">
                {complaint.booking ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500">Booking ID</Label>
                        <p className="font-mono text-sm">{complaint.booking.id}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Status</Label>
                        <Badge variant="outline">{complaint.booking.status}</Badge>
                      </div>
                    </div>

                    {complaint.booking.serviceName && (
                      <div>
                        <Label className="text-xs text-gray-500">Service</Label>
                        <p className="font-medium">{complaint.booking.serviceName}</p>
                      </div>
                    )}

                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Scheduled Time
                      </Label>
                      <p>{format(new Date(complaint.booking.scheduledTime), 'PPp')}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Address
                      </Label>
                      <p className="text-sm">{complaint.booking.address}</p>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Amount
                      </Label>
                      <p className="font-semibold text-lg">৳{complaint.booking.totalAmount}</p>
                    </div>

                    {complaint.booking.description && (
                      <div>
                        <Label className="text-xs text-gray-500">Description</Label>
                        <p className="text-sm text-gray-700">{complaint.booking.description}</p>
                      </div>
                    )}

                    {complaint.payment && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment Details
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <Label className="text-xs text-gray-500">Amount</Label>
                              <p>৳{complaint.payment.amount}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">Status</Label>
                              <Badge variant="outline">{complaint.payment.status}</Badge>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">Method</Label>
                              <p>{complaint.payment.method}</p>
                            </div>
                            {complaint.payment.transactionId && (
                              <div>
                                <Label className="text-xs text-gray-500">Transaction ID</Label>
                                <p className="font-mono text-xs">{complaint.payment.transactionId}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No booking information available</p>
                  </div>
                )}
              </TabsContent>

              {/* Admin Tab */}
              <TabsContent value="admin" className="space-y-4">
                {/* Admin Notes */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Internal Notes</Label>
                  {/* <div className="space-y-3 mb-4">
                    {complaint.adminNotes && complaint.adminNotes.length > 0 ? (
                      complaint.adminNotes.map((note) => (
                        <div key={note.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-xs text-gray-600">
                              {note.adminName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(note.createdAt), 'PPp')}
                            </span>
                          </div>
                          <p className="text-gray-700">{note.note}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">No notes yet</p>
                    )}
                  </div> */}
                  {
                    complaint.adminNotes &&
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs text-gray-600">
                            {complaint.adminNotes}
                          </span>
                        </div>
                      </div>
                    </div>
                  }

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add internal note (visible only to admins)..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()} size="sm">
                      Add Note
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Resolution */}
                {complaint.resolution && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <Label className="text-sm font-semibold text-green-800 mb-2 block">
                      Resolution
                    </Label>
                    <p className="text-sm text-green-900">{complaint.resolution}</p>
                  </div>
                )}

                {/* Rejection Reason */}
                {complaint.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <Label className="text-sm font-semibold text-red-800 mb-2 block">
                      Rejection Reason
                    </Label>
                    <p className="text-sm text-red-900">{complaint.rejectionReason}</p>
                  </div>
                )}

                {/* Timeline */}
                {complaint.timeline && complaint.timeline.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Timeline
                    </Label>
                    <div className="space-y-3">
                      {complaint.timeline.map((event) => (
                        <div key={event.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-600" />
                            <div className="h-full w-px bg-gray-300" />
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-sm">{event.action}</p>
                            <p className="text-xs text-gray-600">{event.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              By {event.performedBy} • {format(new Date(event.createdAt), 'PPp')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            {canChangeStatus && (
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => onStatusUpdate(complaint.id, 'under_review')}
                  disabled={complaint.status === 'under_review'}
                  size="sm"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark Under Review
                </Button>
                <Button
                  onClick={() => setActionDialog({ isOpen: true, type: 'resolve' })}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setActionDialog({ isOpen: true, type: 'reject' })}
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Resolve Dialog */}
      <AlertDialog
        open={actionDialog.isOpen && actionDialog.type === 'resolve'}
        onOpenChange={(open) => !open && setActionDialog({ isOpen: false, type: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resolve Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a resolution summary for this complaint.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Enter resolution details..."
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            rows={4}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResolve} disabled={!resolution.trim()}>
              Resolve Complaint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog
        open={actionDialog.isOpen && actionDialog.type === 'reject'}
        onOpenChange={(open) => !open && setActionDialog({ isOpen: false, type: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this complaint.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Complaint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
