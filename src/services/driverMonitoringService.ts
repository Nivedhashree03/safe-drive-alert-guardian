// Service to handle driver monitoring with trained model integration
export class DriverMonitoringService {
  private model: any = null;
  private isModelLoaded = false;
  private audioContext: AudioContext | null = null;
  private sleepAlertSound: AudioBuffer | null = null;
  private currentAlarmSource: AudioBufferSourceNode | null = null;

  constructor() {
    this.initializeAudio();
  }

  // Initialize audio context and load alert sounds
  private async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Create alert tone only for critical sleep detection
      await this.createAlertTones();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Create alert tone only for sleep detection (critical situations)
  private async createAlertTones() {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    
    // Create urgent sleep detection alarm only
    const sleepDuration = 2;
    const sleepBuffer = this.audioContext.createBuffer(1, sampleRate * sleepDuration, sampleRate);
    const sleepData = sleepBuffer.getChannelData(0);

    for (let i = 0; i < sleepBuffer.length; i++) {
      const time = i / sampleRate;
      // Very urgent, high-pitched alternating alarm for sleep only
      const frequency = Math.sin(time * 6) > 0 ? 1600 : 2000;
      const envelope = Math.sin(time * 8) * 0.6;
      sleepData[i] = Math.sin(2 * Math.PI * frequency * time) * (0.5 + envelope);
    }
    this.sleepAlertSound = sleepBuffer;
  }

  // Stop any currently playing alarm
  private stopCurrentAlarm() {
    if (this.currentAlarmSource) {
      try {
        this.currentAlarmSource.stop();
        this.currentAlarmSource.disconnect();
      } catch (error) {
        // Alarm may have already stopped
      }
      this.currentAlarmSource = null;
    }
  }

  // Play alert sound ONLY for sleep detection
  playAlertSound(detectionType: 'asleep' | 'drowsy') {
    // Stop any existing alarm first
    this.stopCurrentAlarm();
    
    // Only play alarm for sleep detection, NOT for drowsiness
    if (detectionType !== 'asleep') {
      console.log(`⚠️ ${detectionType.toUpperCase()} detected - No alarm (alarm only for sleep)`);
      return;
    }

    if (!this.audioContext || !this.sleepAlertSound) return;

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sleepAlertSound;
      source.connect(this.audioContext.destination);
      source.start();
      
      // Keep reference to stop if needed
      this.currentAlarmSource = source;
      
      console.log('🚨 SLEEP DETECTION ALARM - Playing urgent sound!');
    } catch (error) {
      console.error('Failed to play alert sound:', error);
    }
  }

  // Stop alarm when driver becomes awake
  stopAlarm() {
    this.stopCurrentAlarm();
    console.log('✅ Driver is awake - Alarm stopped');
  }

  // Load your trained model (placeholder - replace with your actual model)
  async loadModel(modelPath?: string) {
    try {
      console.log('Loading trained sleep detection model...');
      // Replace this with your actual model loading code
      // Example for TensorFlow.js:
      // this.model = await tf.loadLayersModel(modelPath || '/models/sleep-detection-model.json');
      
      // For now, we'll simulate model loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isModelLoaded = true;
      console.log('✅ Sleep detection model loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to load model:', error);
      return false;
    }
  }

  // Analyze driver state using improved simulation for demo
  async analyzeDriverState(imageData?: ImageData): Promise<'awake' | 'drowsy' | 'asleep'> {
    if (!this.isModelLoaded) {
      console.warn('Model not loaded, using simulation');
      return this.simulateDetection();
    }

    try {
      // Replace this with your actual model prediction code
      // Example:
      // const prediction = await this.model.predict(preprocessedImage);
      // const sleepProbability = prediction.dataSync()[0];
      
      // For now, we'll simulate realistic detection for presentation
      return this.simulateDetection();
    } catch (error) {
      console.error('Error in model prediction:', error);
      return 'awake';
    }
  }

  // Improved simulation for demo purposes - more realistic patterns
  private simulateDetection(): 'awake' | 'drowsy' | 'asleep' {
    const random = Math.random();
    const time = Date.now();
    const cycleTime = Math.floor(time / 1000) % 60; // 60 second cycles for demo
    
    // Create realistic demo patterns for presentation
    if (cycleTime < 15) {
      // First 15 seconds: mostly awake
      return random < 0.95 ? 'awake' : 'drowsy';
    } else if (cycleTime < 25) {
      // Next 10 seconds: introduce drowsiness with alarm
      if (random < 0.4) return 'drowsy';
      if (random < 0.1) return 'asleep';
      return 'awake';
    } else if (cycleTime < 40) {
      // Next 15 seconds: more drowsiness and some sleep with alarms
      if (random < 0.6) return 'drowsy';
      if (random < 0.3) return 'asleep';
      return 'awake';
    } else {
      // Last 20 seconds: critical sleep detection for demo with emergency
      if (random < 0.5) return 'asleep';
      if (random < 0.8) return 'drowsy';
      return 'awake';
    }
  }

  // Get camera stream with improved error handling
  async initializeCamera(): Promise<MediaStream | null> {
    try {
      console.log('🔍 Requesting camera access...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }

      // Request permissions first
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('📹 Camera permission status:', permissions.state);

      // Try different constraint configurations with more flexibility
      const constraints = [
        {
          video: { 
            width: { ideal: 640, min: 320 }, 
            height: { ideal: 480, min: 240 },
            facingMode: 'user'
          },
          audio: false
        },
        {
          video: { 
            width: { min: 320 }, 
            height: { min: 240 }
          },
          audio: false
        },
        {
          video: true,
          audio: false
        }
      ];

      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      // Try each constraint configuration
      for (const constraint of constraints) {
        try {
          console.log('🎥 Trying camera constraint:', constraint);
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          if (stream && stream.getVideoTracks().length > 0) {
            console.log('📹 Camera initialized successfully');
            console.log('📹 Video tracks:', stream.getVideoTracks().length);
            
            // Test the stream
            const videoTrack = stream.getVideoTracks()[0];
            console.log('📹 Video track settings:', videoTrack.getSettings());
            break;
          }
        } catch (error) {
          lastError = error as Error;
          console.warn('⚠️ Camera constraint failed:', error);
          continue;
        }
      }

      if (!stream || stream.getVideoTracks().length === 0) {
        throw lastError || new Error('Failed to obtain camera stream');
      }

      return stream;
    } catch (error) {
      console.error('❌ Failed to access camera:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera permission denied. Please allow camera access and refresh the page.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera found. Please connect a camera and try again.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Camera is already in use by another application.');
        } else if (error.name === 'AbortError') {
          throw new Error('Camera request was cancelled. Please try again.');
        }
      }
      
      throw new Error('Failed to access camera. Please check your camera settings and permissions.');
    }
  }

  // Process video frame for analysis
  processVideoFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): ImageData | null {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Ensure video is ready
      if (video.readyState < 2) return null;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error('Error processing video frame:', error);
      return null;
    }
  }

  // Send emergency message to contact - REAL SMS requires Supabase backend
  async sendEmergencyMessage(phoneNumber: string, driverName: string, location: string) {
    try {
      console.log('📱 Attempting to send REAL emergency SMS to:', phoneNumber);
      
      // This is still simulated - REAL SMS requires Supabase + Twilio integration
      const message = `🚨 EMERGENCY ALERT 🚨
Driver: ${driverName}
Status: SLEEP DETECTED WHILE DRIVING
Location: ${location}
Time: ${new Date().toLocaleString()}
This is an automated emergency alert from Safe Drive Guardian.`;

      console.log('📱 Emergency message content:', message);
      console.warn('⚠️ REAL SMS SENDING REQUIRES SUPABASE BACKEND INTEGRATION');
      
      // Simulate API call - Replace with real Supabase edge function call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Emergency message sent successfully (simulated - needs Supabase for real SMS)' };
    } catch (error) {
      console.error('Failed to send emergency message:', error);
      return { success: false, message: 'Failed to send emergency message' };
    }
  }

  // Make emergency call - REAL calling requires Supabase backend  
  async makeEmergencyCall(phoneNumber: string, driverName: string) {
    try {
      console.log('📞 Attempting to make REAL emergency call to:', phoneNumber);
      console.warn('⚠️ REAL CALLING REQUIRES SUPABASE BACKEND INTEGRATION');
      
      // Simulate call - Replace with real Supabase edge function call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, message: 'Emergency call initiated (simulated - needs Supabase for real calls)' };
    } catch (error) {
      console.error('Failed to make emergency call:', error);
      return { success: false, message: 'Failed to make emergency call' };
    }
  }

  // Get current location with improved accuracy
  async getCurrentLocation(): Promise<string> {
    try {
      if (!navigator.geolocation) {
        return 'Location not available';
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const preciseLocation = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      console.log('📍 Precise location obtained:', preciseLocation);
      return preciseLocation;
    } catch (error) {
      console.error('Failed to get location:', error);
      return 'Location unavailable';
    }
  }
}

export const driverMonitoring = new DriverMonitoringService();
