
import { useState, useEffect, useRef, useCallback } from 'react';
import { driverMonitoring } from '@/services/driverMonitoringService';

export const useDriverMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [driverStatus, setDriverStatus] = useState<'awake' | 'drowsy' | 'asleep'>('awake');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load the trained model on component mount
  useEffect(() => {
    const loadModel = async () => {
      const loaded = await driverMonitoring.loadModel();
      setIsModelLoaded(loaded);
    };
    loadModel();
  }, []);

  // Start monitoring function
  const startMonitoring = useCallback(async () => {
    try {
      // Initialize camera
      const stream = await driverMonitoring.initializeCamera();
      if (!stream) {
        throw new Error('Failed to access camera');
      }

      setCameraStream(stream);
      
      // Set up video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsMonitoring(true);

      // Start monitoring loop
      monitoringIntervalRef.current = setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
          const imageData = driverMonitoring.processVideoFrame(
            videoRef.current,
            canvasRef.current
          );
          
          const status = await driverMonitoring.analyzeDriverState(imageData || undefined);
          setDriverStatus(status);

          // Play alert sound for critical states
          if (status === 'asleep' || status === 'drowsy') {
            driverMonitoring.playAlertSound();
          }
        }
      }, 2000); // Analyze every 2 seconds

      console.log('🎯 Driver monitoring started');
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      throw error;
    }
  }, []);

  // Stop monitoring function
  const stopMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }

    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsMonitoring(false);
    setDriverStatus('awake');
    console.log('⏹️ Driver monitoring stopped');
  }, [cameraStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    isMonitoring,
    driverStatus,
    isModelLoaded,
    startMonitoring,
    stopMonitoring,
    videoRef,
    canvasRef,
    cameraStream
  };
};
