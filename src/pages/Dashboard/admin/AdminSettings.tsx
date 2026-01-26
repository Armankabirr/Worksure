import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Save,
  RotateCcw,
  AlertTriangle,
  Clock,
  User,
  CheckCircle,
  Info,
  History,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Settings {
  // General Settings
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  defaultTimezone: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // User & Worker Rules
  userVerificationRequired: boolean;
  workerOnboardingEnabled: boolean;
  requiredWorkerDocuments: {
    nid: boolean;
    license: boolean;
    certificate: boolean;
    photo: boolean;
  };
  maxActiveServicesPerWorker: number;
  workerSuspensionThreshold: number;
  workerAutoBanThreshold: number;

  // Booking & Cancellation
  bookingConfirmationTimeLimit: number;
  userCancellationWindow: number;
  workerCancellationWindow: number;
  cancellationFeePercentage: number;
  noShowHandling: string;

  // Pricing & Commission
  platformCommissionPercentage: number;
  minimumServicePrice: number;
  dynamicPricingEnabled: boolean;
  taxVatPercentage: number;

  // Review & Rating Rules
  minBookingCompletionTimeForReview: number;
  autoHideLowRatedReviewsThreshold: number;
  profanityFilterEnabled: boolean;
  adminApprovalRequired: boolean;

  // Notifications
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  adminAlertPreferences: string[];

  // Security & Access
  sessionTimeoutDuration: number;
  twoFactorAuthenticationEnabled: boolean;
  adminRoles: string[];

  // Integrations
  paymentGatewayKey: string;
  mapApiKey: string;
  emailServiceProvider: string;
  webhookEndpoint: string;
}

interface SettingsChange {
  id: string;
  key: string;
  oldValue: string;
  newValue: string;
  adminId: string;
  adminName: string;
  timestamp: string;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<{
    timestamp: string;
    admin: string;
  } | null>(null);

  const [settingsChanges, setSettingsChanges] = useState<SettingsChange[]>([
    {
      id: '1',
      key: 'platformCommissionPercentage',
      oldValue: '15%',
      newValue: '18%',
      adminId: 'admin_001',
      adminName: 'John Admin',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      key: 'maintenanceMode',
      oldValue: 'false',
      newValue: 'true',
      adminId: 'admin_002',
      adminName: 'Jane Moderator',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [settings, setSettings] = useState<Settings>({
    // General Settings
    platformName: 'Worksure',
    supportEmail: 'support@worksure.com',
    supportPhone: '+1-800-123-4567',
    defaultTimezone: 'UTC',
    defaultCurrency: 'USD',
    maintenanceMode: false,
    maintenanceMessage: '',

    // User & Worker Rules
    userVerificationRequired: true,
    workerOnboardingEnabled: true,
    requiredWorkerDocuments: {
      nid: true,
      license: true,
      certificate: false,
      photo: true,
    },
    maxActiveServicesPerWorker: 5,
    workerSuspensionThreshold: 3,
    workerAutoBanThreshold: 5,

    // Booking & Cancellation
    bookingConfirmationTimeLimit: 24,
    userCancellationWindow: 48,
    workerCancellationWindow: 24,
    cancellationFeePercentage: 15,
    noShowHandling: 'deduct-commission',

    // Pricing & Commission
    platformCommissionPercentage: 18,
    minimumServicePrice: 10,
    dynamicPricingEnabled: true,
    taxVatPercentage: 10,

    // Review & Rating Rules
    minBookingCompletionTimeForReview: 1,
    autoHideLowRatedReviewsThreshold: 2,
    profanityFilterEnabled: true,
    adminApprovalRequired: false,

    // Notifications
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: true,
    pushNotificationsEnabled: true,
    adminAlertPreferences: ['critical', 'fraud', 'system'],

    // Security & Access
    sessionTimeoutDuration: 30,
    twoFactorAuthenticationEnabled: true,
    adminRoles: ['Super Admin', 'Moderator', 'Support'],

    // Integrations
    paymentGatewayKey: '••••••••••••••••••••••••',
    mapApiKey: '••••••••••••••••••••••••',
    emailServiceProvider: 'SendGrid',
    webhookEndpoint: 'https://api.worksure.com/webhooks',
  });

  const [originalSettings, setOriginalSettings] = useState<Settings>(settings);

  useEffect(() => {
    // Simulate fetching last updated info
    setLastUpdated({
      timestamp: new Date().toISOString(),
      admin: 'Admin Dashboard',
    });
  }, []);

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleDocumentToggle = (
    doc: keyof Settings['requiredWorkerDocuments']
  ) => {
    setSettings((prev) => ({
      ...prev,
      requiredWorkerDocuments: {
        ...prev.requiredWorkerDocuments,
        [doc]: !prev.requiredWorkerDocuments[doc],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleAlertPreferenceToggle = (preference: string) => {
    setSettings((prev) => ({
      ...prev,
      adminAlertPreferences: prev.adminAlertPreferences.includes(preference)
        ? prev.adminAlertPreferences.filter((p) => p !== preference)
        : [...prev.adminAlertPreferences, preference],
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add change to history
      const changes: SettingsChange[] = [];
      Object.keys(settings).forEach((key) => {
        if (
          JSON.stringify(settings[key as keyof Settings]) !==
          JSON.stringify(originalSettings[key as keyof Settings])
        ) {
          changes.push({
            id: Date.now().toString(),
            key,
            oldValue: JSON.stringify(originalSettings[key as keyof Settings]),
            newValue: JSON.stringify(settings[key as keyof Settings]),
            adminId: 'current_admin',
            adminName: 'Current Admin',
            timestamp: new Date().toISOString(),
          });
        }
      });

      if (changes.length > 0) {
        setSettingsChanges((prev) => [...changes, ...prev]);
      }

      setOriginalSettings(settings);
      setHasUnsavedChanges(false);

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setHasUnsavedChanges(false);
    setShowResetDialog(false);

    toast({
      title: 'Reset',
      description: 'Settings reset to last saved values',
    });
  };

  const handleResetToDefault = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const defaultSettings: Settings = {
        platformName: 'Worksure',
        supportEmail: 'support@worksure.com',
        supportPhone: '+1-800-000-0000',
        defaultTimezone: 'UTC',
        defaultCurrency: 'USD',
        maintenanceMode: false,
        maintenanceMessage: '',
        userVerificationRequired: true,
        workerOnboardingEnabled: true,
        requiredWorkerDocuments: {
          nid: true,
          license: true,
          certificate: false,
          photo: true,
        },
        maxActiveServicesPerWorker: 5,
        workerSuspensionThreshold: 3,
        workerAutoBanThreshold: 5,
        bookingConfirmationTimeLimit: 24,
        userCancellationWindow: 48,
        workerCancellationWindow: 24,
        cancellationFeePercentage: 15,
        noShowHandling: 'deduct-commission',
        platformCommissionPercentage: 15,
        minimumServicePrice: 10,
        dynamicPricingEnabled: true,
        taxVatPercentage: 10,
        minBookingCompletionTimeForReview: 1,
        autoHideLowRatedReviewsThreshold: 2,
        profanityFilterEnabled: true,
        adminApprovalRequired: false,
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: true,
        pushNotificationsEnabled: true,
        adminAlertPreferences: ['critical', 'fraud', 'system'],
        sessionTimeoutDuration: 30,
        twoFactorAuthenticationEnabled: true,
        adminRoles: ['Super Admin', 'Moderator', 'Support'],
        paymentGatewayKey: '••••••••••••••••••••••••',
        mapApiKey: '••••••••••••••••••••••••',
        emailServiceProvider: 'SendGrid',
        webhookEndpoint: 'https://api.worksure.com/webhooks',
      };

      setSettings(defaultSettings);
      setOriginalSettings(defaultSettings);
      setHasUnsavedChanges(false);

      toast({
        title: 'Reset to Defaults',
        description: 'All settings have been reset to default values',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage system configuration, operational rules, and platform preferences
              </p>
            </div>
          </div>

          {lastUpdated && (
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  Last updated:{' '}
                  {format(new Date(lastUpdated.timestamp), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>By: {lastUpdated.admin}</span>
              </div>
            </div>
          )}
        </div>

        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">Unsaved changes</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setShowResetDialog(true)}
          disabled={!hasUnsavedChanges || isLoading}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Changes
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 bg-gray-300">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="user-worker">User & Worker</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform information and system-wide preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) =>
                      handleSettingChange('platformName', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      handleSettingChange('supportEmail', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) =>
                      handleSettingChange('supportPhone', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select
                    value={settings.defaultTimezone}
                    onValueChange={(value) =>
                      handleSettingChange('defaultTimezone', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Standard Time</SelectItem>
                      <SelectItem value="CST">Central Standard Time</SelectItem>
                      <SelectItem value="PST">Pacific Standard Time</SelectItem>
                      <SelectItem value="IST">Indian Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select
                    value={settings.defaultCurrency}
                    onValueChange={(value) =>
                      handleSettingChange('defaultCurrency', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Maintenance Mode */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">
                      Put the platform in maintenance mode to restrict user access
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange('maintenanceMode', checked)
                    }
                  />
                </div>

                {settings.maintenanceMode && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="maintenanceMsg">Maintenance Message</Label>
                    <Textarea
                      id="maintenanceMsg"
                      placeholder="Enter the message to display to users during maintenance..."
                      value={settings.maintenanceMessage}
                      onChange={(e) =>
                        handleSettingChange('maintenanceMessage', e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User & Worker Rules Tab */}
        <TabsContent value="user-worker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User & Worker Rules</CardTitle>
              <CardDescription>
                Configure requirements and rules for user and worker accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">User Settings</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-base">User Verification Required</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Require email verification for new user accounts
                    </p>
                  </div>
                  <Switch
                    checked={settings.userVerificationRequired}
                    onCheckedChange={(checked) =>
                      handleSettingChange('userVerificationRequired', checked)
                    }
                  />
                </div>
              </div>

              {/* Worker Settings */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-lg">Worker Settings</h3>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-base">Worker Onboarding Enabled</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Enable structured worker onboarding process
                    </p>
                  </div>
                  <Switch
                    checked={settings.workerOnboardingEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('workerOnboardingEnabled', checked)
                    }
                  />
                </div>

                {/* Required Documents */}
                <div className="space-y-3">
                  <Label className="text-base">Required Worker Documents</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(settings.requiredWorkerDocuments).map(
                      ([doc, required]) => (
                        <div
                          key={doc}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <Label className="capitalize">{doc} Document</Label>
                          <Switch
                            checked={required}
                            onCheckedChange={() =>
                              handleDocumentToggle(
                                doc as keyof Settings['requiredWorkerDocuments']
                              )
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Numeric Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                  <div className="space-y-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="flex items-center gap-2">
                            Max Active Services Per Worker
                            <Info className="h-4 w-4" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          Maximum number of concurrent services a worker can handle
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Input
                      type="number"
                      value={settings.maxActiveServicesPerWorker}
                      onChange={(e) =>
                        handleSettingChange(
                          'maxActiveServicesPerWorker',
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="flex items-center gap-2">
                            Worker Suspension Threshold
                            <Info className="h-4 w-4" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          Number of complaints before temporary suspension
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Input
                      type="number"
                      value={settings.workerSuspensionThreshold}
                      onChange={(e) =>
                        handleSettingChange(
                          'workerSuspensionThreshold',
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="flex items-center gap-2">
                            Worker Auto-Ban Threshold
                            <Info className="h-4 w-4" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          Number of complaints before permanent ban
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Input
                      type="number"
                      value={settings.workerAutoBanThreshold}
                      onChange={(e) =>
                        handleSettingChange(
                          'workerAutoBanThreshold',
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking & Cancellation Tab */}
        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking & Cancellation</CardTitle>
              <CardDescription>
                Configure booking confirmation and cancellation policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Booking Confirmation Time Limit (hours)
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Time given to worker to accept or reject a booking
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    value={settings.bookingConfirmationTimeLimit}
                    onChange={(e) =>
                      handleSettingChange(
                        'bookingConfirmationTimeLimit',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          User Cancellation Window (hours)
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Time available for users to cancel without penalty
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    value={settings.userCancellationWindow}
                    onChange={(e) =>
                      handleSettingChange(
                        'userCancellationWindow',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Worker Cancellation Window (hours)
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Time available for workers to cancel without penalty
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    value={settings.workerCancellationWindow}
                    onChange={(e) =>
                      handleSettingChange(
                        'workerCancellationWindow',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Cancellation Fee (%)
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Percentage of booking fee charged as cancellation penalty
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.cancellationFeePercentage}
                    onChange={(e) =>
                      handleSettingChange(
                        'cancellationFeePercentage',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="noShow">No-Show Handling</Label>
                  <Select
                    value={settings.noShowHandling}
                    onValueChange={(value) =>
                      handleSettingChange('noShowHandling', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deduct-commission">
                        Deduct Commission
                      </SelectItem>
                      <SelectItem value="full-refund">Full Refund to User</SelectItem>
                      <SelectItem value="suspend-worker">Suspend Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing & Commission Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Commission</CardTitle>
              <CardDescription>
                Configure platform commission, pricing rules, and tax settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Platform Commission (%)
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Percentage of each booking taken as platform commission
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.platformCommissionPercentage}
                    onChange={(e) =>
                      handleSettingChange(
                        'platformCommissionPercentage',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Minimum Service Price
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Minimum price allowed for any service on the platform
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    min="0"
                    value={settings.minimumServicePrice}
                    onChange={(e) =>
                      handleSettingChange(
                        'minimumServicePrice',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Tax/VAT (%)
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Tax or VAT percentage applied to service prices
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.taxVatPercentage}
                    onChange={(e) =>
                      handleSettingChange(
                        'taxVatPercentage',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-base">Dynamic Pricing Enabled</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Allow prices to adjust based on demand and availability
                    </p>
                  </div>
                  <Switch
                    checked={settings.dynamicPricingEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('dynamicPricingEnabled', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review & Rating Rules Tab */}
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review & Rating Rules</CardTitle>
              <CardDescription>
                Configure review policies and moderation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Min Booking Completion Time Before Review (hours)
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Minimum time after booking completion before review allowed
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    value={settings.minBookingCompletionTimeForReview}
                    onChange={(e) =>
                      handleSettingChange(
                        'minBookingCompletionTimeForReview',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Auto-Hide Low-Rated Reviews Threshold
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Reviews below this rating are automatically hidden
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    value={settings.autoHideLowRatedReviewsThreshold}
                    onChange={(e) =>
                      handleSettingChange(
                        'autoHideLowRatedReviewsThreshold',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-base">Profanity Filter</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Automatically filter and flag reviews with inappropriate language
                    </p>
                  </div>
                  <Switch
                    checked={settings.profanityFilterEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('profanityFilterEnabled', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-base">Admin Approval Required</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Require admin approval before reviews are published
                    </p>
                  </div>
                  <Switch
                    checked={settings.adminApprovalRequired}
                    onCheckedChange={(checked) =>
                      handleSettingChange('adminApprovalRequired', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system-wide notification channels and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Notification Channels</h3>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotificationsEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('emailNotificationsEnabled', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotificationsEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('smsNotificationsEnabled', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Send notifications via push notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotificationsEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('pushNotificationsEnabled', checked)
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Admin Alert Preferences</h3>
                <div className="space-y-2">
                  {['critical', 'fraud', 'system', 'user_complaints', 'worker_issues'].map(
                    (pref) => (
                      <div key={pref} className="flex items-center gap-3 p-2">
                        <input
                          type="checkbox"
                          id={pref}
                          checked={settings.adminAlertPreferences.includes(pref)}
                          onChange={() => handleAlertPreferenceToggle(pref)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={pref} className="capitalize text-sm cursor-pointer">
                          {pref.replace('_', ' ')}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Access Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>
                Configure security policies and admin access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Session Timeout Duration (minutes)
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Automatically log out admin sessions after this duration of inactivity
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="number"
                    value={settings.sessionTimeoutDuration}
                    onChange={(e) =>
                      handleSettingChange(
                        'sessionTimeoutDuration',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuthenticationEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange(
                        'twoFactorAuthenticationEnabled',
                        checked
                      )
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Admin Roles</h3>
                <div className="space-y-2">
                  {settings.adminRoles.map((role) => (
                    <div key={role} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">IP Allow/Deny List</h3>
                <Button variant="outline" className="w-full">
                  Manage IP Restrictions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Configure external service integrations and API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Payment Gateway Key
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        API key for payment processing (shown masked for security)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="password"
                    value={settings.paymentGatewayKey}
                    onChange={(e) =>
                      handleSettingChange('paymentGatewayKey', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center gap-2">
                          Map API Key
                          <Info className="h-4 w-4" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        API key for mapping and location services
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    type="password"
                    value={settings.mapApiKey}
                    onChange={(e) =>
                      handleSettingChange('mapApiKey', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailProvider">Email Service Provider</Label>
                  <Select
                    value={settings.emailServiceProvider}
                    onValueChange={(value) =>
                      handleSettingChange('emailServiceProvider', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SendGrid">SendGrid</SelectItem>
                      <SelectItem value="AWS SES">AWS SES</SelectItem>
                      <SelectItem value="Mailgun">Mailgun</SelectItem>
                      <SelectItem value="Twilio">Twilio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook">Webhook Endpoint</Label>
                  <Input
                    id="webhook"
                    type="url"
                    value={settings.webhookEndpoint}
                    onChange={(e) =>
                      handleSettingChange('webhookEndpoint', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Integration Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <span className="text-sm">Payment Gateway</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <span className="text-sm">Map Service</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings Change History</CardTitle>
              <CardDescription>
                Track all changes made to platform settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Setting Key</TableHead>
                      <TableHead>Old Value</TableHead>
                      <TableHead>New Value</TableHead>
                      <TableHead>Changed By</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settingsChanges.map((change) => (
                      <TableRow key={change.id}>
                        <TableCell className="font-mono text-sm">
                          {change.key}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {change.oldValue}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {change.newValue}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <p className="font-medium">{change.adminName}</p>
                            <p className="text-xs text-gray-500">{change.adminId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {format(new Date(change.timestamp), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reset Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will discard all unsaved changes and restore the last saved settings.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Reset Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSettings;
