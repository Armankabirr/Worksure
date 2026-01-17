import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApiServiceRequest } from "@/types/workerDashboard";

interface RequestDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: ApiServiceRequest | null;
  actionLoading: boolean;
  onAccept: (id: string) => void;
  onCancel: (id: string) => void;
}

export const RequestDetailsDialog = ({
  open,
  onOpenChange,
  selectedRequest,
  actionLoading,
  onAccept,
  onCancel,
}: RequestDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center text-orange-500">
            Service Request Details
          </DialogTitle>
        </DialogHeader>

        {selectedRequest ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                {(selectedRequest.users_orders_client_idTousers?.select?.profile_picture ||
                  selectedRequest.users_orders_client_idTousers?.profile_picture) && (
                  <img
                    src={
                      selectedRequest.users_orders_client_idTousers?.select?.profile_picture ||
                      selectedRequest.users_orders_client_idTousers?.profile_picture
                    }
                    alt={
                      selectedRequest.users_orders_client_idTousers?.select?.full_name ||
                      "Client"
                    }
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedRequest.users_orders_client_idTousers?.select?.full_name ||
                    selectedRequest.users_orders_client_idTousers?.full_name ||
                    "Client"}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedRequest.users_orders_client_idTousers?.select?.email ||
                    selectedRequest.users_orders_client_idTousers?.email ||
                    "-"}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedRequest.users_orders_client_idTousers?.select?.phone ||
                    selectedRequest.users_orders_client_idTousers?.phone ||
                    "-"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Description</h4>
              <p className="text-sm text-gray-900">{selectedRequest.description || "-"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Address</h4>
                <p className="text-sm text-gray-900">{selectedRequest.address || "-"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Amount</h4>
                <p className="text-sm text-gray-900">
                  {selectedRequest.total_amount != null
                    ? `৳${selectedRequest.total_amount}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Selected Time</h4>
                <p className="text-sm text-gray-900">
                  {selectedRequest.selected_time || "-"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Status</h4>
                <p className="text-sm text-gray-900">{selectedRequest.status || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">No request selected</div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => selectedRequest && onAccept(selectedRequest.id)}
              disabled={actionLoading || selectedRequest?.status === "Confirmed"}
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              className="text-red-600 border border-red-200"
              onClick={() => selectedRequest && onCancel(selectedRequest.id)}
              disabled={actionLoading || selectedRequest?.status === "Cancelled"}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog;
