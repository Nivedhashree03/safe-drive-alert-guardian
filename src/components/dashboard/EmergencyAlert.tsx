
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

  // Create and play emergency sound
  useEffect(() => {
    const playEmergencySound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create urgent alarm sound
        const createAlarmTone = () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Create alternating high-pitched alarm
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(1500, audioContext.currentTime + 0.5);
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 1);
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 1.5);
        };

        // Play alarm repeatedly while alert is active
        const playAlarm = () => {
          if (isActive && countdown > 0) {
            createAlarmTone();
            setTimeout(playAlarm, 1000); // Repeat every second
          }
        };

        playAlarm();
      } catch (error) {
        console.error('Failed to play emergency sound:', error);
      }
    };

    if (isActive) {
      playEmergencySound();
    }
  }, [isActive, countdown]);

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
          
          <div className="text-6xl font-bold text-red-600 mb-6 animate-pulse">
            {countdown}
          </div>
          
          <p className="text-sm text-gray-700 mb-6 font-medium">
            ⚠️ AUTOMATIC EMERGENCY PROTOCOL WILL ACTIVATE:
          </p>
          
          <div className="space-y-3 text-sm text-left mb-8 bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-red-500" />
              <span className="font-medium">📍 GPS location sent to nearby hospitals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-red-500" />
              <span className="font-medium">📞 Emergency contacts will be called</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium">🚑 Ambulance dispatch notification</span>
            </div>
          </div>
          
          <Button 
            onClick={handleResponse}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg animate-pulse"
            size="lg"
          >
            ✋ I'M AWAKE - CANCEL EMERGENCY
          </Button>
          
          <p className="text-xs text-gray-600 mt-4">
            Respond immediately to prevent emergency protocol activation
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyAlert;
