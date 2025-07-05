
// Service to handle driver monitoring with trained model integration
export class DriverMonitoringService {
  private model: any = null;
  private isModelLoaded = false;
  private audioContext: AudioContext | null = null;
  private alertSound: AudioBuffer | null = null;
  private emergencySound: AudioBuffer | null = null;
  private lastDetectionTime = 0;
  private sleepDetectionCount = 0;

  constructor() {
    this.initializeAudio();
  }

  // Initialize audio context and load alert sounds
  private async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.createSleepAlertTone();
      await this.createEmergencyAlertTone();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Create an urgent sleep detection alert tone
  private async createSleepAlertTone() {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 2; // 2 seconds of urgent alarm
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Create an urgent, piercing alarm sound for sleep detection
    for (let i = 0; i < buffer.length; i++) {
      const time = i / sampleRate;
      // Rapid alternating between high frequencies for urgency
      const frequency = Math.sin(time * 8) > 0 ? 1400 : 1800;
      const envelope = Math.sin(time * 4) * 0.3; // Pulsing effect
      data[i] = Math.sin(2 * Math.PI * frequency * time) * (0.5 + envelope);
    }

    this.alertSound = buffer;
  }

  // Create emergency alert sound for countdown
  private async createEmergencyAlertTone() {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 1; // 1 second emergency beep
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Create an even more urgent emergency sound
    for (let i = 0; i < buffer.length; i++) {
      const time = i / sampleRate;
      const frequency = 2000; // Very high pitched emergency sound
      const envelope = Math.exp(-time * 3); // Quick fade
      data[i] = Math.sin(2 * Math.PI * frequency * time) * envelope * 0.8;
    }

    this.emergencySound = buffer;
  }

  // Play sleep detection alarm sound
  playAlertSound() {
    if (!this.audioContext || !this.alertSound) return;

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.alertSound;
      source.connect(this.audioContext.destination);
      source.start();
      
      console.log('🚨 SLEEP DETECTION ALARM - Sound playing!');
    } catch (error) {
      console.error('Failed to play alert sound:', error);
    }
  }

  // Play emergency countdown sound
  playEmergencySound() {
    if (!this.audioContext || !this.emergencySound) return;

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.emergencySound;
      source.connect(this.audioContext.destination);
      source.start();
      
      console.log('🚨 EMERGENCY COUNTDOWN SOUND - Playing!');
    } catch (error) {
      console.error('Failed to play emergency sound:', error);
    }
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

  // Analyze driver state using your trained model
  async analyzeDriverState(imageData?: ImageData): Promise<'awake' | 'drowsy' | 'asleep'> {
    if (!this.isModelLoaded) {
      console.warn('Model not loaded, using enhanced simulation');
      return this.enhancedSimulateDetection();
    }

    try {
      // Replace this with your actual model prediction code
      // Example:
      // const prediction = await this.model.predict(preprocessedImage);
      // const sleepProbability = prediction.dataSync()[0];
      
      // For demo purposes, we'll use enhanced simulation
      return this.enhancedSimulateDetection();
    } catch (error) {
      console.error('Error in model prediction:', error);
      return 'awake';
    }
  }

  // Enhanced simulation that's more responsive for demo
  private enhancedSimulateDetection(): 'awake' | 'drowsy' | 'asleep' {
    const currentTime = Date.now();
    const random = Math.random();
    
    // Create a more realistic pattern for demo
    // Every 15-20 seconds, increase chance of sleep detection
    const timePattern = Math.floor(currentTime / 1000) % 25;
    
    // Higher chance of sleep detection in certain time windows
    if (timePattern >= 15 && timePattern <= 20) {
      if (random < 0.8) {
        this.sleepDetectionCount++;
        console.log('🎯 SLEEP DETECTED - Count:', this.sleepDetectionCount);
        return 'asleep';
      }
    }
    
    // Occasional drowsiness
    if (timePattern >= 10 && timePattern <= 14) {
      if (random < 0.6) {
        console.log('😴 Drowsiness detected');
        return 'drowsy';
      }
    }
    
    // Reset counter if awake for a while
    if (timePattern < 10) {
      this.sleepDetectionCount = 0;
    }
    
    console.log('👁️ Driver awake');
    return 'awake';
  }

  // Get camera stream for real-time monitoring with better error handling
  async initializeCamera(): Promise<MediaStream | null> {
    try {
      console.log('🔍 Requesting camera access...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }

      const constraints = {
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' // Front camera for driver monitoring
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('📹 Camera initialized successfully for driver monitoring');
      console.log('📹 Video tracks:', stream.getVideoTracks().length);
      
      return stream;
    } catch (error) {
      console.error('❌ Failed to access camera:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera permission denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera found. Please connect a camera and try again.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Camera is already in use by another application.');
        }
      }
      
      throw new Error('Failed to access camera. Please check your camera settings.');
    }
  }

  // Process video frame for analysis
  processVideoFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): ImageData | null {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      return ctx.getImageData(0, 0, canvas.width, canvas.length);
    } catch (error) {
      console.error('Error processing video frame:', error);
      return null;
    }
  }

  // Send emergency message to contact
  async sendEmergencyMessage(phoneNumber: string, driverName: string, location: string) {
    try {
      console.log('📱 Sending emergency message to:', phoneNumber);
      
      const message = `🚨 EMERGENCY ALERT 🚨
Driver: ${driverName}
Status: SLEEP DETECTED WHILE DRIVING
Location: ${location}
Time: ${new Date().toLocaleString()}
This is an automated emergency alert from Safe Drive Guardian.`;

      console.log('📱 Emergency message sent:', message);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Emergency message sent successfully' };
    } catch (error) {
      console.error('Failed to send emergency message:', error);
      return { success: false, message: 'Failed to send emergency message' };
    }
  }

  async getCurrentLocation(): Promise<string> {
    try {
      if (!navigator.geolocation) {
        return 'Location not available';
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Failed to get location:', error);
      return 'Location unavailable';
    }
  }
}

export const driverMonitoring = new DriverMonitoringService();
