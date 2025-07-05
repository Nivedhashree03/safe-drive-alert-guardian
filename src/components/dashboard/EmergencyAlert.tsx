
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Phone } from 'lucide-react';

interface EmergencyAlertProps {
  onResponse: (responded: boolean) => void;
}

const EmergencyAlert = ({ onResponse }: EmergencyAlertProps) => {
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || countdown === 0) {
      if (countdown === 0) {
        onResponse(false); // Auto-trigger emergency protocol
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isActive, onResponse]);

  const handleResponse = () => {
    setIsActive(false);
    onResponse(true);
  };

  if (!isActive && countdown > 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-red-500 border-2 animate-pulse">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            EMERGENCY ALERT
          </h2>
          
          <p className="text-lg mb-4">
            Sleep detected while driving!
          </p>
          
          <div className="text-4xl font-bold text-red-600 mb-6">
            {countdown}
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            If you don't respond, emergency protocols will activate automatically:
          </p>
          
          <div className="space-y-2 text-sm text-left mb-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>Location sent to nearby hospitals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-red-500" />
              <span>Emergency contacts will be notified</span>
            </div>
          </div>
          
          <Button 
            onClick={handleResponse}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
            size="lg"
          >
            I'M AWAKE - CANCEL ALERT
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyAlert;
