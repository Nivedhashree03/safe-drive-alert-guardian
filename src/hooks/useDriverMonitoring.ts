
import { useState, useEffect, useRef, useCallback } from 'react';
import { driverMonitoring } from '@/services/driverMonitoringService';

export const useDriverMonitoring = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [driverStatus, setDriverStatus] = useState<'awake' | 'drowsy' | 'asleep'>('awake');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializingRef = useRef(false);

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
    if (isInitializingRef.current) {
      console.log('🔄 Already initializing, please wait...');
      return;
    }

    try {
      isInitializingRef.current = true;
      setCameraError(null);
      console.log('🎯 Starting camera initialization...');
      
      // Stop any existing streams first
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }

      // Clear any existing video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Initialize camera with better error handling
      const stream = await driverMonitoring.initializeCamera();
      if (!stream) {
        throw new Error('Failed to access camera - please allow camera permissions');
      }

      console.log('📹 Camera stream obtained successfully');
      setCameraStream(stream);
      
      // Set up video element with proper error handling
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready before starting monitoring
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error('Video element not available'));
            return;
          }
          
          const video = videoRef.current;
          
          const onLoadedMetadata = () => {
            console.log('📹 Video metadata loaded');
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          };
          
          const onError = (error: Event) => {
            console.error('Video error:', error);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('Video loading failed'));
          };
          
          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);
          
          // Start playing
          video.play().catch(reject);
        });
      }

      setIsMonitoring(true);
      console.log('🎯 Starting monitoring loop...');

      // Start monitoring loop
      monitoringIntervalRef.current = setInterval(async () => {
        if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
          try {
            const imageData = driverMonitoring.processVideoFrame(
              videoRef.current,
              canvasRef.current
            );
            
            const status = await driverMonitoring.analyzeDriverState(imageData || undefined);
            setDriverStatus(status);

            // Play alert sound for both sleep AND drowsiness
            if (status === 'asleep' || status === 'drowsy') {
              driverMonitoring.playAlertSound(status);
              console.log(`🚨 ${status.toUpperCase()} DETECTED - Playing alarm sound!`);
            }
          } catch (error) {
            console.error('Error in monitoring loop:', error);
          }
        }
      }, 1500); // Analyze every 1.5 seconds for better responsiveness

      console.log('✅ Driver monitoring started successfully');
      isInitializingRef.current = false;
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown camera error';
      setCameraError(errorMessage);
      
      // Clean up on error
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      
      isInitializingRef.current = false;
      throw error;
    }
  }, [cameraStream]);

  // Stop monitoring function
  const stopMonitoring = useCallback(() => {
    console.log('⏹️ Stopping driver monitoring...');
    
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }

    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop();
        console.log('📹 Camera track stopped:', track.kind);
      });
      setCameraStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsMonitoring(false);
    setDriverStatus('awake');
    setCameraError(null);
    console.log('⏹️ Driver monitoring stopped');
  }, [cameraStream]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array - only run on unmount

  return {
    isMonitoring,
    driverStatus,
    isModelLoaded,
    cameraError,
    startMonitoring,
    stopMonitoring,
    videoRef,
    canvasRef,
    cameraStream
  };
};
