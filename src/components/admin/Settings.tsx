import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      academyName: 'Kalyan Cricket Academy',
      email: 'info@kalyancricketacademy.com',
      phone: '+1-555-CRICKET',
      address: '123 Cricket Lane, Sports City, SC 12345',
      website: 'www.kalyancricketacademy.com',
      timezone: 'America/New_York',
      currency: 'INR'
    },
    notification: {
      emailNotifications: true,
      smsNotifications: false,
      newEnrollments: true,
      paymentReminders: true,
      coachAssignments: true,
      systemUpdates: false
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: false,
      bankTransferEnabled: true,
      lateFee: 2000,
      gracePeriod: 7,
      autoReminders: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      dataRetention: 365,
      backupFrequency: 'daily',
      logLevel: 'info'
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'notification', name: 'Notifications', icon: '🔔' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'system', name: 'System', icon: '💻' }
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const GeneralSettings = () => (
    <div className="space-y-6">
      <Card className="card-hover shadow-lg animate-slideInUp">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🏏</span>
            Academy Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academy Name</label>
              <input
                type="text"
                value={settings.general.academyName}
                onChange={(e) => handleSettingChange('general', 'academyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={settings.general.email}
                onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={settings.general.phone}
                onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={settings.general.website}
                onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                rows={3}
                value={settings.general.address}
                onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.general.timezone}
                onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={settings.general.currency}
                onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <Card className="card-hover shadow-lg animate-slideInUp">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🔔</span>
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Communication Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notification.emailNotifications}
                    onChange={(e) => handleSettingChange('notification', 'emailNotifications', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notification.smsNotifications}
                    onChange={(e) => handleSettingChange('notification', 'smsNotifications', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">SMS Notifications</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Event Notifications</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notification.newEnrollments}
                    onChange={(e) => handleSettingChange('notification', 'newEnrollments', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">New Enrollments</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notification.paymentReminders}
                    onChange={(e) => handleSettingChange('notification', 'paymentReminders', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Payment Reminders</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notification.coachAssignments}
                    onChange={(e) => handleSettingChange('notification', 'coachAssignments', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Coach Assignments</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notification.systemUpdates}
                    onChange={(e) => handleSettingChange('notification', 'systemUpdates', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">System Updates</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-6">
      <Card className="card-hover shadow-lg animate-slideInUp">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">💳</span>
            Payment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Payment Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.payment.stripeEnabled}
                    onChange={(e) => handleSettingChange('payment', 'stripeEnabled', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Stripe (Credit Cards)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.payment.paypalEnabled}
                    onChange={(e) => handleSettingChange('payment', 'paypalEnabled', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">PayPal</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.payment.bankTransferEnabled}
                    onChange={(e) => handleSettingChange('payment', 'bankTransferEnabled', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Bank Transfer</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Payment Rules</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee (₹)</label>
                  <input
                    type="number"
                    value={settings.payment.lateFee}
                    onChange={(e) => handleSettingChange('payment', 'lateFee', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (days)</label>
                  <input
                    type="number"
                    value={settings.payment.gracePeriod}
                    onChange={(e) => handleSettingChange('payment', 'gracePeriod', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  />
                </div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.payment.autoReminders}
                    onChange={(e) => handleSettingChange('payment', 'autoReminders', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Automatic Reminders</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <Card className="card-hover shadow-lg animate-slideInUp">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🔒</span>
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Authentication</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Password Policy</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                  <input
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SystemSettings = () => (
    <div className="space-y-6">
      <Card className="card-hover shadow-lg animate-slideInUp">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">💻</span>
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">System Status</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Maintenance Mode</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.system.debugMode}
                    onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
                    className="form-checkbox h-5 w-5 text-cricket-orange rounded focus:ring-cricket-orange"
                  />
                  <span className="text-sm text-gray-700">Debug Mode</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Data Management</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
                  <input
                    type="number"
                    value={settings.system.dataRetention}
                    onChange={(e) => handleSettingChange('system', 'dataRetention', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select
                    value={settings.system.backupFrequency}
                    onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
                  <select
                    value={settings.system.logLevel}
                    onChange={(e) => handleSettingChange('system', 'logLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cricket-orange focus:border-transparent"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralSettings />;
      case 'notification': return <NotificationSettings />;
      case 'payment': return <PaymentSettings />;
      case 'security': return <SecuritySettings />;
      case 'system': return <SystemSettings />;
      default: return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card className="card-hover shadow-lg animate-slideInUp">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-cricket-orange text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-cricket-orange hover:bg-cricket-orange/90 px-8 py-3 hover:scale-105 transition-all duration-200">
          💾 Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;