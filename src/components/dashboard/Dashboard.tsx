
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Phone, Bell, AlertTriangle, Heart } from 'lucide-react';
import EmergencyAlert from './EmergencyAlert';
import { useToast } from '@/hooks/use-toast';

interface User {
  fullName: string;
  email: string;
  phone: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const Dashboard = ({ user, onLogout, onOpenProfile }: DashboardProps) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [driverStatus, setDriverStatus] = useState<'awake' | 'drowsy' | 'asleep'>('awake');
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const { toast } = useToast();

  // Simulate driver monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Simulate random status changes for demo
      const statuses: ('awake' | 'drowsy' | 'asleep')[] = ['awake', 'awake', 'awake', 'drowsy', 'asleep'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setDriverStatus(randomStatus);

      if (randomStatus === 'asleep') {
        // Trigger emergency alert after 3 seconds of sleep detection
        setTimeout(() => {
          setShowEmergencyAlert(true);
        }, 3000);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const handleEmergencyResponse = (responded: boolean) => {
    setShowEmergencyAlert(false);
    if (!responded) {
      // Emergency protocol activated
      toast({
        title: "Emergency Protocol Activated",
        description: "Location sent to nearby hospitals and emergency contacts notified.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = () => {
    switch (driverStatus) {
      case 'awake': return 'bg-green-500';
      case 'drowsy': return 'bg-yellow-500';
      case 'asleep': return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (driverStatus) {
      case 'awake': return 'Alert & Safe';
      case 'drowsy': return 'Drowsiness Detected';
      case 'asleep': return 'Sleep Detected - DANGER';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {showEmergencyAlert && (
        <EmergencyAlert onResponse={handleEmergencyResponse} />
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Safe Drive Guardian</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.fullName}</span>
            <Button variant="outline" onClick={onOpenProfile}>
              Profile
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Monitoring Status */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Driver Monitoring Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor()}`}></div>
                  <span className="text-lg font-semibold">{getStatusText()}</span>
                </div>
                <Badge variant={driverStatus === 'awake' ? 'default' : 'destructive'}>
                  {driverStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`w-full ${isMonitoring ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>
                {isMonitoring && (
                  <div className="text-sm text-gray-600 text-center">
                    🔴 Active monitoring - Your safety is being tracked
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Test Alert Sent", description: "Emergency contacts have been notified." })}
              >
                <Bell className="h-4 w-4 mr-2" />
                Test Emergency Alert
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Location Shared", description: "Current location sent to emergency contacts." })}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Share Location
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Emergency Call", description: "Calling primary emergency contact..." })}
              >
                <Phone className="h-4 w-4 mr-2" />
                Emergency Call
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">GPS Connection</span>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Heart Rate Monitor</span>
                <Badge variant="default" className="bg-green-600">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Emergency Contacts</span>
                <Badge variant="secondary">3 Configured</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nearby Hospitals</span>
                <Badge variant="secondary">5 Found</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Safe driving session completed</p>
                    <p className="text-xs text-gray-500">2 hours ago - No incidents detected</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Drowsiness alert triggered</p>
                    <p className="text-xs text-gray-500">Yesterday - Driver responded within 10 seconds</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">System health check completed</p>
                    <p className="text-xs text-gray-500">2 days ago - All systems operational</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
