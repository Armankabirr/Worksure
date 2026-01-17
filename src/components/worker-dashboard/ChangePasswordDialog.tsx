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
import { Lock, Save } from "lucide-react";
import { PasswordFormData } from "@/types/workerDashboard";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passwordForm: PasswordFormData;
  setPasswordForm: (form: PasswordFormData) => void;
  passwordError: string;
  isPasswordSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export const ChangePasswordDialog = ({
  open,
  onOpenChange,
  passwordForm,
  setPasswordForm,
  passwordError,
  isPasswordSaving,
  onSave,
  onReset,
}: ChangePasswordDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        onOpenChange(openState);
        if (!openState) {
          onReset();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center text-orange-500">
            <Lock className="h-5 w-5 mr-2" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Update your password to keep your account secure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Re-enter new password"
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-600" role="alert">
              {passwordError}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onReset();
            }}
            disabled={isPasswordSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isPasswordSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isPasswordSaving ? "Saving..." : "Save Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
