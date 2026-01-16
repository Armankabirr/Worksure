import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ExtraItem, CompleteFormData } from "@/types/workerDashboard";

interface CompleteWorkDialogFullProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completeForm: CompleteFormData;
  setCompleteForm: (form: CompleteFormData) => void;
  extraItems: ExtraItem[];
  newExtraItem: { name: string; quantity: number; unitPrice: number };
  setNewExtraItem: (item: { name: string; quantity: number; unitPrice: number }) => void;
  extraItemsLoading: boolean;
  actionLoading: boolean;
  onAddExtraItem: () => void;
  onRemoveExtraItem: (itemId: string) => void;
  onUpdateExtraItem: (itemId: string, field: keyof ExtraItem, value: string | number) => void;
  onConfirmComplete: () => void;
  onClose: () => void;
}

export const CompleteWorkDialogFull = ({
  open,
  onOpenChange,
  completeForm,
  setCompleteForm,
  extraItems,
  newExtraItem,
  setNewExtraItem,
  extraItemsLoading,
  actionLoading,
  onAddExtraItem,
  onRemoveExtraItem,
  onUpdateExtraItem,
  onConfirmComplete,
  onClose,
}: CompleteWorkDialogFullProps) => {
  const hasPendingExtraItems = extraItems.some((item) => item.status === "pending");

  const calculateExtraItemsTotal = () => {
    return extraItems.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            Complete Work
          </DialogTitle>
          <DialogDescription>
            Add work details and any extra items before submitting for user
            confirmation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Work Time Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Work Duration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workStartTime">Start Time *</Label>
                <Input
                  id="workStartTime"
                  type="time"
                  value={completeForm.workStartTime}
                  onChange={(e) =>
                    setCompleteForm({ ...completeForm, workStartTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workEndTime">End Time *</Label>
                <Input
                  id="workEndTime"
                  type="time"
                  value={completeForm.workEndTime}
                  onChange={(e) =>
                    setCompleteForm({ ...completeForm, workEndTime: e.target.value })
                  }
                />
              </div>
            </div>

            {completeForm.workStartTime && completeForm.workEndTime && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Duration:{" "}
                  {(() => {
                    const start = completeForm.workStartTime.split(":").map(Number);
                    const end = completeForm.workEndTime.split(":").map(Number);
                    const startMins = start[0] * 60 + start[1];
                    const endMins = end[0] * 60 + end[1];
                    const diff = endMins - startMins;
                    if (diff <= 0) return "Invalid time range";
                    const hours = Math.floor(diff / 60);
                    const mins = diff % 60;
                    return `${hours > 0 ? `${hours}h ` : ""}${mins}m`;
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Extra Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Extra Items / Materials
              </h3>
              {extraItemsLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>

            {/* Add New Extra Item Form */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <Label className="text-xs">Item Name</Label>
                  <Input
                    placeholder="e.g., Wire, Switch"
                    value={newExtraItem.name}
                    onChange={(e) =>
                      setNewExtraItem({ ...newExtraItem, name: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newExtraItem.quantity}
                    onChange={(e) =>
                      setNewExtraItem({
                        ...newExtraItem,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Unit Price (৳)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newExtraItem.unitPrice}
                    onChange={(e) =>
                      setNewExtraItem({
                        ...newExtraItem,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2 flex items-end">
                  <Button
                    type="button"
                    size="sm"
                    onClick={onAddExtraItem}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Extra Items List */}
            {extraItems.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Item</th>
                      <th className="text-center px-3 py-2 font-medium">Qty</th>
                      <th className="text-right px-3 py-2 font-medium">Unit Price</th>
                      <th className="text-right px-3 py-2 font-medium">Total</th>
                      <th className="text-center px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {extraItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          {item.status === "pending" ? (
                            <Input
                              value={item.name}
                              onChange={(e) =>
                                onUpdateExtraItem(item.id, "name", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          ) : (
                            <span>{item.name}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.status === "pending" ? (
                            <Input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                onUpdateExtraItem(
                                  item.id,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="h-8 text-sm w-16 mx-auto text-center"
                            />
                          ) : (
                            <span>{item.quantity}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.status === "pending" ? (
                            <Input
                              type="number"
                              min={0}
                              value={item.unitPrice}
                              onChange={(e) =>
                                onUpdateExtraItem(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="h-8 text-sm w-24 ml-auto text-right"
                            />
                          ) : (
                            <span>৳{item.unitPrice.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          ৳{(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              item.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : item.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.status === "pending"
                              ? "Pending"
                              : item.status === "approved"
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {item.status === "pending" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveExtraItem(item.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-medium">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right">
                        Extra Items Total:
                      </td>
                      <td className="px-3 py-2 text-right text-orange-600">
                        ৳{calculateExtraItemsTotal().toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Pending Items Warning */}
            {hasPendingExtraItems && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Extra items are pending approval. You can still submit for
                  completion, but the final amount may change after user approval.
                </p>
              </div>
            )}
          </div>

          {/* Completion Notes */}
          <div className="space-y-2">
            <Label htmlFor="completionNotes">Completion Notes (Optional)</Label>
            <Textarea
              id="completionNotes"
              value={completeForm.completionNotes}
              onChange={(e) =>
                setCompleteForm({ ...completeForm, completionNotes: e.target.value })
              }
              placeholder="Add any notes about the completed work..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onConfirmComplete}
            disabled={
              actionLoading ||
              !completeForm.workStartTime ||
              !completeForm.workEndTime
            }
          >
            {actionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit for Confirmation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteWorkDialogFull;
