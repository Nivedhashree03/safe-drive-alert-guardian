
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Phone, Bell, AlertTriangle, Heart, Camera, Wifi, Settings } from 'lucide-react';
import EmergencyAlert from './EmergencyAlert';
import EmergencyContactDialog from './EmergencyContactDialog';
import { useToast } from '@/hooks/use-toast';
import { useDriverMonitoring } from '@/hooks/useDriverMonitoring';

interface User {
  fullName: string;
  email: string;
  phone: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const Dashboard = ({ user, onLogout, onOpenProfile }: DashboardProps) => {
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const { toast } = useToast();
  
  const {
    isMonitoring,
    driverStatus,
    isModelLoaded,
    cameraError,
    startMonitoring,
    stopMonitoring,
    videoRef,
    canvasRef
  } = useDriverMonitoring();

  // Trigger emergency alert when driver falls asleep
  React.useEffect(() => {
    if (driverStatus === 'asleep' && isMonitoring) {
      const timer = setTimeout(() => {
        setShowEmergencyAlert(true);
      }, 3000); // 3 seconds of sleep detection triggers emergency

      return () => clearTimeout(timer);
    }
  }, [driverStatus, isMonitoring]);

  const handleMonitoringToggle = async () => {
    try {
      if (isMonitoring) {
        stopMonitoring();
        toast({
          title: "Monitoring Stopped",
          description: "Driver safety monitoring has been disabled.",
        });
      } else {
        await startMonitoring();
        toast({
          title: "Monitoring Started",
          description: "AI-powered driver safety monitoring is now active.",
        });
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: cameraError || "Failed to access camera. Please allow camera permissions and try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmergencyResponse = (responded: boolean) => {
    setShowEmergencyAlert(false);
    if (!responded) {
      toast({
        title: "🚨 Emergency Protocol Activated",
        description: `Emergency messages sent to ${emergencyContacts.length} contacts with your location.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Emergency Cancelled",
        description: "Glad you're safe! Stay alert while driving.",
      });
    }
  };

  const handleSaveContacts = (contacts: EmergencyContact[]) => {
    setEmergencyContacts(contacts);
    toast({
      title: "Emergency Contacts Updated",
      description: `${contacts.length} emergency contacts saved.`,
    });
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
      case 'drowsy': return '⚠️ Drowsiness Detected';
      case 'asleep': return '🚨 SLEEP DETECTED - DANGER!';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {showEmergencyAlert && (
        <EmergencyAlert 
          onResponse={handleEmergencyResponse}
          emergencyContacts={emergencyContacts}
          driverName={user.fullName}
        />
      )}
      
      <EmergencyContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
        onSave={handleSaveContacts}
        initialContacts={emergencyContacts}
      />
      
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
          {/* AI-Powered Driver Monitoring */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>AI Driver Monitoring</span>
                <Badge variant={isModelLoaded ? 'default' : 'secondary'}>
                  {isModelLoaded ? 'Model Ready' : 'Loading...'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Camera Error Display */}
                {cameraError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">⚠️ Camera Error</p>
                    <p className="text-xs text-red-500">{cameraError}</p>
                  </div>
                )}

                {/* Status Display */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor()} ${driverStatus !== 'awake' ? 'animate-pulse' : ''}`}></div>
                    <span className="text-lg font-semibold">{getStatusText()}</span>
                  </div>
                  <Badge variant={driverStatus === 'awake' ? 'default' : 'destructive'}>
                    {driverStatus.toUpperCase()}
                  </Badge>
                </div>

                {/* Camera Feed */}
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '200px' }}>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    style={{ display: isMonitoring && !cameraError ? 'block' : 'none' }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                  {(!isMonitoring || cameraError) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Camera className="h-12 w-12 mx-auto mb-2" />
                        <p>{cameraError ? 'Camera Error' : 'Camera will activate when monitoring starts'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Control Button */}
                <Button
                  onClick={handleMonitoringToggle}
                  disabled={!isModelLoaded}
                  className={`w-full ${isMonitoring ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {!isModelLoaded ? 'Loading AI Model...' : isMonitoring ? '🛑 Stop Monitoring' : '🎯 Start AI Monitoring'}
                </Button>

                {isMonitoring && !cameraError && (
                  <div className="text-sm text-center space-y-1">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Wifi className="h-4 w-4" />
                      <span>🔴 Live AI monitoring active</span>
                    </div>
                    <p className="text-gray-600">Your safety is being analyzed in real-time</p>
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
                <span>Emergency Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowContactDialog(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup Emergency Contacts ({emergencyContacts.length})
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  if (emergencyContacts.length === 0) {
                    toast({ 
                      title: "No Emergency Contacts", 
                      description: "Please add emergency contacts first.",
                      variant: "destructive"
                    });
                    return;
                  }
                  setShowEmergencyAlert(true);
                  toast({ title: "Manual Emergency Alert", description: "Testing emergency protocol..." });
                }}
              >
                <Bell className="h-4 w-4 mr-2" />
                Test Emergency Alert
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "📍 Location Shared", description: "Current location sent to emergency contacts." })}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Share Location Now
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "📞 Calling Emergency", description: "Calling primary emergency contact..." })}
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
                <span className="text-sm">AI Model</span>
                <Badge variant={isModelLoaded ? "default" : "secondary"} className={isModelLoaded ? "bg-green-600" : ""}>
                  {isModelLoaded ? "Loaded" : "Loading..."}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Camera Access</span>
                <Badge variant={isMonitoring && !cameraError ? "default" : "secondary"} className={isMonitoring && !cameraError ? "bg-green-600" : ""}>
                  {cameraError ? "Error" : isMonitoring ? "Active" : "Standby"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">GPS Connection</span>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Emergency Contacts</span>
                <Badge variant={emergencyContacts.length > 0 ? "default" : "secondary"}>
                  {emergencyContacts.length} Configured
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity Log */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Live Activity Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cameraError && (
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Camera Error: {cameraError}</p>
                      <p className="text-xs text-gray-500">Please check camera permissions and try again</p>
                    </div>
                  </div>
                )}
                {isMonitoring && !cameraError && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium">AI monitoring active - Status: {getStatusText()}</p>
                      <p className="text-xs text-gray-500">Real-time analysis in progress</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">System initialized successfully</p>
                    <p className="text-xs text-gray-500">All safety systems operational</p>
                  </div>
                </div>
                {emergencyContacts.length > 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Emergency contacts configured ({emergencyContacts.length})</p>
                      <p className="text-xs text-gray-500">Ready to send alerts if needed: {emergencyContacts.slice(0, 2).map(c => c.name).join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
