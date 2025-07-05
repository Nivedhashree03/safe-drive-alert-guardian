import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone } from 'lucide-react';
import { driverMonitoring } from '@/services/driverMonitoringService';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

interface EmergencyAlertProps {
  onResponse: (responded: boolean) => void;
  emergencyContacts: EmergencyContact[];
  driverName: string;
}

const EmergencyAlert = ({ onResponse, emergencyContacts, driverName }: EmergencyAlertProps) => {
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [isSendingMessages, setIsSendingMessages] = useState(false);

  // Play emergency sound every second during countdown
  useEffect(() => {
    if (isActive && countdown > 0) {
      // Play emergency sound immediately when alert shows
      driverMonitoring.playEmergencySound();
      
      const soundInterval = setInterval(() => {
        if (countdown > 0) {
          driverMonitoring.playEmergencySound();
        }
      }, 1000);

      return () => clearInterval(soundInterval);
    }
  }, [isActive, countdown]);

  useEffect(() => {
    if (!isActive || countdown === 0) {
      if (countdown === 0 && !isSendingMessages) {
        handleAutomaticEmergency();
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isActive, isSendingMessages]);

  const handleAutomaticEmergency = async () => {
    setIsSendingMessages(true);
    console.log('🚨 Automatic emergency protocol activated');
    
    try {
      const location = await driverMonitoring.getCurrentLocation();
      console.log('📍 Current location:', location);
      
      const messagePromises = emergencyContacts.map(contact => 
        driverMonitoring.sendEmergencyMessage(contact.phone, driverName, location)
      );
      
      const results = await Promise.all(messagePromises);
      console.log('📱 Message results:', results);
      
      onResponse(false);
    } catch (error) {
      console.error('Failed to send emergency messages:', error);
      onResponse(false);
    }
  };

  const handleResponse = () => {
    setIsActive(false);
    onResponse(true);
  };

  if (!isActive && countdown > 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-red-500 border-4 animate-pulse shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-20 w-20 text-red-500 animate-bounce" />
          </div>
          
          <h2 className="text-3xl font-bold text-red-600 mb-4 animate-pulse">
            🚨 EMERGENCY ALERT 🚨
          </h2>
          
          <p className="text-xl mb-4 font-semibold">
            SLEEP DETECTED WHILE DRIVING!
          </p>
          
          {countdown > 0 ? (
            <>
              <div className="text-6xl font-bold text-red-600 mb-6 animate-pulse">
                {countdown}
              </div>
              
              <p className="text-sm text-gray-700 mb-6 font-medium">
                ⚠️ AUTOMATIC EMERGENCY PROTOCOL WILL ACTIVATE:
              </p>
              
              <div className="space-y-3 text-sm text-left mb-8 bg-red-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <span className="font-medium">📍 GPS location will be sent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-red-500" />
                  <span className="font-medium">📞 {emergencyContacts.length} emergency contacts will be notified</span>
                </div>
                {emergencyContacts.slice(0, 2).map(contact => (
                  <div key={contact.id} className="ml-7 text-xs text-gray-600">
                    • {contact.name} ({contact.phone})
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleResponse}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg animate-pulse"
                size="lg"
              >
                ✋ I'M AWAKE - CANCEL EMERGENCY
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-red-600">
                {isSendingMessages ? 'Sending emergency messages...' : 'Emergency protocol activated!'}
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            </div>
          )}
          
          <p className="text-xs text-gray-600 mt-4">
            Respond immediately to prevent emergency protocol activation
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyAlert;
