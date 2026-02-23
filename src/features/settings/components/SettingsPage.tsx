import { User, Bell, Shield, Database } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Separator } from '../../../components/ui/separator';

interface SettingsPageProps {
  userName: string;
  userEmail: string;
}

export function SettingsPage({ userName, userEmail }: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto pt-4">
        <div className="mb-8">
          <h1 className="mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and application settings</p>
        </div>

        {/* Profile Settings */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <User className="size-6 text-indigo-600" />
            <h3>Profile Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={userName} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={userEmail} className="mt-1" />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="size-6 text-indigo-600" />
            <h3>Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive updates about your fact-checks via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fact Check Completion</p>
                <p className="text-sm text-gray-600">
                  Get notified when your fact-check is complete
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-gray-600">
                  Receive a weekly summary of your fact-checking activity
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="size-6 text-indigo-600" />
            <h3>Privacy & Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Save Search History</p>
                <p className="text-sm text-gray-600">Keep a record of your fact-checking history</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Anonymous Usage Data</p>
                <p className="text-sm text-gray-600">
                  Help improve our service by sharing anonymous usage data
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Database className="size-6 text-indigo-600" />
            <h3>Data Management</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-gray-600">Download all your fact-checking data</p>
              </div>
              <Button variant="outline">Export</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600">Delete Account</p>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="outline" className="text-red-600 hover:bg-red-50">
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
