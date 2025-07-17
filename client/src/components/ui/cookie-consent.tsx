import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cookie, Shield, BarChart3, Target, X, Settings, Check } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  onAccept: (preferences: CookiePreferences) => void;
  onDecline: () => void;
}

export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('smartjobfit-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('smartjobfit-cookie-consent', JSON.stringify(allPreferences));
    onAccept(allPreferences);
    setShowBanner(false);
  };

  const handleDeclineAll = () => {
    const minimalPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('smartjobfit-cookie-consent', JSON.stringify(minimalPreferences));
    onDecline();
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('smartjobfit-cookie-consent', JSON.stringify(preferences));
    onAccept(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  We value your privacy
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                  By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="w-full sm:w-auto"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Preferences
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeclineAll}
                className="w-full sm:w-auto"
              >
                Decline All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              Cookie Preferences
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose which cookies you want to accept. You can change these settings at any time.
            </p>

            <Tabs defaultValue="necessary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="necessary">Necessary</TabsTrigger>
                <TabsTrigger value="functional">Functional</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              <TabsContent value="necessary" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <Label className="text-base font-medium">Necessary Cookies</Label>
                    <Badge variant="secondary">Always Active</Badge>
                  </div>
                  <Switch checked={true} disabled />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are essential for the website to function properly. They enable core functionality 
                  such as security, authentication, and load balancing. The website cannot function properly without these cookies.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Examples:</strong> Session cookies, authentication tokens, CSRF protection
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="functional" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <Label className="text-base font-medium">Functional Cookies</Label>
                  </div>
                  <Switch
                    checked={preferences.functional}
                    onCheckedChange={(checked) => updatePreference('functional', checked)}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies enable enhanced functionality and personalization. They may be set by us or by 
                  third-party providers whose services we use on our site.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Examples:</strong> Language preferences, theme settings, saved job searches
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <Label className="text-base font-medium">Analytics Cookies</Label>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => updatePreference('analytics', checked)}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously. This helps us improve the website experience.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Examples:</strong> Google Analytics, page views, user behavior tracking
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="marketing" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    <Label className="text-base font-medium">Marketing Cookies</Label>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => updatePreference('marketing', checked)}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are used to deliver personalized advertisements and track the effectiveness of 
                  advertising campaigns. They may also be used to limit the number of times you see an advertisement.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Examples:</strong> Social media tracking, retargeting ads, conversion tracking
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="border-t pt-4">
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeclineAll}
                >
                  Decline All
                </Button>
                <Button onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('smartjobfit-cookie-consent');
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch {
        // Invalid JSON, reset to defaults
        localStorage.removeItem('smartjobfit-cookie-consent');
      }
    }
  }, []);

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('smartjobfit-cookie-consent', JSON.stringify(newPreferences));
  };

  return { preferences, updatePreferences };
}