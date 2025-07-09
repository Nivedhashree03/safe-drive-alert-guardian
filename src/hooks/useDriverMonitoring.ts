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
  const previousStatusRef = useRef<'awake' | 'drowsy' | 'asleep'>('awake');

  // Load the trained model on component mount
  useEffect(() => {
    const loadModel = async () => {
      const loaded = await driverMonitoring.loadModel();
      setIsModelLoaded(loaded);
    };
    loadModel();
  }, []);

  // Monitor driver status changes and handle alarm accordingly
  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    
    if (driverStatus === 'awake' && previousStatus !== 'awake') {
      // Driver became awake - stop any alarm
      driverMonitoring.stopAlarm();
      console.log('✅ Driver is awake - Alarm stopped');
    } else if (driverStatus === 'asleep') {
      // Driver is asleep - play alarm
      driverMonitoring.playAlertSound('asleep');
      console.log('🚨 SLEEP DETECTED - Playing alarm!');
    } else if (driverStatus === 'drowsy') {
      // Driver is drowsy - no alarm, just warning
      console.log('⚠️ DROWSINESS DETECTED - Warning only (no alarm)');
    }
    
    previousStatusRef.current = driverStatus;
  }, [driverStatus]);

  // Start monitoring function with improved camera handling
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

      // Request user interaction first for better permission handling
      console.log('📱 Please allow camera access when prompted...');
      
      // Initialize camera with improved error handling
      const stream = await driverMonitoring.initializeCamera();
      if (!stream) {
        throw new Error('Failed to access camera - please allow camera permissions');
      }

      console.log('📹 Camera stream obtained successfully');
      setCameraStream(stream);
      
      // Set up video element with proper error handling
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        
        // Wait for video to be ready before starting monitoring
        await new Promise<void>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('Video loading timeout'));
          }, 15000); // 15 second timeout
          
          const onLoadedMetadata = () => {
            console.log('📹 Video metadata loaded');
            console.log('📹 Video dimensions:', video.videoWidth, 'x', video.videoHeight);
            clearTimeout(timeoutId);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          };
          
          const onError = (error: Event) => {
            console.error('Video error:', error);
            clearTimeout(timeoutId);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('Video loading failed'));
          };
          
          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);
          
          // Start playing with user gesture consideration
          const playPromise = video.play();
          if (playPromise) {
            playPromise.catch((playError) => {
              console.warn('Video play failed:', playError);
              // Try to play again after a short delay
              setTimeout(() => {
                video.play().catch(reject);
              }, 100);
            });
          }
        });
      }

      setIsMonitoring(true);
      console.log('🎯 Starting monitoring loop...');

      // Start monitoring loop with better error handling
      monitoringIntervalRef.current = setInterval(async () => {
        if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
          try {
            // Check if video is still playing
            if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
              console.warn('⚠️ Video dimensions are 0, skipping frame analysis');
              return;
            }

            const imageData = driverMonitoring.processVideoFrame(
              videoRef.current,
              canvasRef.current
            );
            
            if (imageData) {
              const status = await driverMonitoring.analyzeDriverState(imageData);
              setDriverStatus(status);
              console.log('🔍 Driver status analyzed:', status);
            }
          } catch (error) {
            console.error('Error in monitoring loop:', error);
          }
        } else {
          console.log('⏳ Waiting for video to be ready...');
        }
      }, 1500); // Analyze every 1.5 seconds

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

    // Stop any playing alarm when monitoring stops
    driverMonitoring.stopAlarm();

    setIsMonitoring(false);
    setDriverStatus('awake');
    setCameraError(null);
    previousStatusRef.current = 'awake';
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
      driverMonitoring.stopAlarm();
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
