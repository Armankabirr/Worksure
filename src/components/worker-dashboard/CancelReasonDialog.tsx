import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancelReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  actionLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const CancelReasonDialog = ({
  open,
  onOpenChange,
  cancelReason,
  setCancelReason,
  actionLoading,
  onConfirm,
  onClose,
}: CancelReasonDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center text-red-600">
            Cancel Work Request
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for cancelling this work request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Reason for Cancellation *</Label>
            <Textarea
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please explain why you are cancelling this request..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
          >
            Go Back
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={actionLoading || !cancelReason.trim()}
          >
            {actionLoading ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelReasonDialog;
