
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Camera, Shield, Smartphone, AlertTriangle, Zap, Code, Database } from 'lucide-react';

const PresentationContent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Title Slide */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-8 text-center">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Safe Drive Guardian</h1>
          <p className="text-xl text-gray-700 mb-6">AI-Powered Driver Safety Monitoring System</p>
          <div className="flex justify-center space-x-4">
            <Badge variant="default" className="bg-red-600">Real-time AI Detection</Badge>
            <Badge variant="default" className="bg-blue-600">Emergency Response</Badge>
            <Badge variant="default" className="bg-green-600">Mobile Ready</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Problem Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <span>Problem Statement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Drowsy Driving Statistics</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 328,000 drowsy driving crashes annually</li>
                <li>• 6,400 deaths from drowsy driving crashes</li>
                <li>• 50,000 injuries from driver fatigue</li>
                <li>• $12.5 billion in monetary losses</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Current Solutions Limitations</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Most systems only detect after drowsiness occurs</li>
                <li>• Limited emergency response capabilities</li>
                <li>• No real-time monitoring integration</li>
                <li>• Expensive hardware requirements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solution Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <span>Our AI-Powered Solution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Camera className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-time Detection</h3>
              <p className="text-sm text-gray-600">AI analyzes facial features and eye patterns to detect drowsiness in real-time</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Instant Alerts</h3>
              <p className="text-sm text-gray-600">Immediate audio alarms and visual warnings when sleep is detected</p>
            </div>
            <div className="text-center">
              <Smartphone className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Emergency Response</h3>
              <p className="text-sm text-gray-600">Automatic SMS and calls to emergency contacts with GPS location</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-indigo-500" />
            <span>Technical Architecture</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">Frontend</span>
                  React + TypeScript
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>React 18:</strong> Modern UI with hooks and context</li>
                  <li>• <strong>TypeScript:</strong> Type-safe development</li>
                  <li>• <strong>Tailwind CSS:</strong> Responsive design system</li>
                  <li>• <strong>Shadcn/UI:</strong> Professional component library</li>
                  <li>• <strong>Capacitor:</strong> Mobile app deployment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">Backend</span>
                  Supabase
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Authentication:</strong> User management and security</li>
                  <li>• <strong>PostgreSQL:</strong> Relational data storage</li>
                  <li>• <strong>Edge Functions:</strong> Serverless API endpoints</li>
                  <li>• <strong>Real-time API:</strong> Live data synchronization</li>
                  <li>• <strong>Storage:</strong> File and media management</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Model Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <span>AI Model Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Computer Vision Pipeline</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-purple-200 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">1</div>
                  <p className="text-sm font-medium">Camera Capture</p>
                  <p className="text-xs text-gray-600">Real-time video stream</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-200 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">2</div>
                  <p className="text-sm font-medium">Frame Processing</p>
                  <p className="text-xs text-gray-600">Extract facial features</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-200 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">3</div>
                  <p className="text-sm font-medium">AI Analysis</p>
                  <p className="text-xs text-gray-600">Drowsiness detection</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-200 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">4</div>
                  <p className="text-sm font-medium">Alert System</p>
                  <p className="text-xs text-gray-600">Instant response</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Detection Features</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Eye closure duration analysis</li>
                  <li>• Blink frequency monitoring</li>
                  <li>• Head position tracking</li>
                  <li>• Facial landmark detection</li>
                  <li>• Micro-sleep episode identification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Model Architecture</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Convolutional Neural Networks (CNN)</li>
                  <li>• Real-time inference optimization</li>
                  <li>• Browser-based computation</li>
                  <li>• WebGL acceleration support</li>
                  <li>• Lightweight model deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detection Algorithm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <span>How Detection Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Three-Stage Detection System</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Badge variant="default" className="bg-green-600 mt-1">Awake</Badge>
                  <div>
                    <p className="font-medium">Normal Alertness</p>
                    <p className="text-sm text-gray-600">Eyes open, normal blink rate, upright posture</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="default" className="bg-yellow-600 mt-1">Drowsy</Badge>
                  <div>
                    <p className="font-medium">Early Warning</p>
                    <p className="text-sm text-gray-600">Slow blinks, heavy eyelids, slight head nods - Visual warning only</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="destructive" className="mt-1">Asleep</Badge>
                  <div>
                    <p className="font-medium">Critical Alert</p>
                    <p className="text-sm text-gray-600">Eyes closed >2 seconds, head dropping - <strong>ALARM + Emergency Protocol</strong></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-semibold text-red-800 mb-2">Emergency Response Protocol</h4>
              <div className="text-sm text-red-700">
                <p className="mb-2"><strong>When Sleep Detected:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Immediate loud alarm to wake driver</li>
                  <li>5-second countdown for driver response</li>
                  <li>If no response: GPS location captured</li>
                  <li>Emergency SMS sent to all contacts</li>
                  <li>Automatic emergency call initiated</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features & Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Core Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Real-time AI-powered drowsiness detection</li>
                <li>✅ Progressive alert system (visual → audio → emergency)</li>
                <li>✅ Automatic emergency contact notification</li>
                <li>✅ GPS location sharing</li>
                <li>✅ Mobile app support (iOS/Android)</li>
                <li>✅ User-friendly dashboard</li>
                <li>✅ Configurable emergency contacts</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Technical Benefits</h3>
              <ul className="space-y-2 text-gray-700">
                <li>🔧 No additional hardware required</li>
                <li>🔧 Works with any device camera</li>
                <li>🔧 Browser-based AI processing</li>
                <li>🔧 Offline capability for core functions</li>
                <li>🔧 Scalable cloud backend</li>
                <li>🔧 Real-time data synchronization</li>
                <li>🔧 Enterprise-ready security</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-500" />
            <span>Complete Technology Stack</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-blue-800">Frontend Technologies</h3>
              <ul className="space-y-1 text-sm">
                <li>• React 18 + TypeScript</li>
                <li>• Tailwind CSS + Shadcn/UI</li>
                <li>• WebRTC Camera API</li>
                <li>• Canvas API for image processing</li>
                <li>• Web Audio API for alerts</li>
                <li>• Geolocation API</li>
                <li>• Service Workers (PWA)</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-green-800">Backend & AI</h3>
              <ul className="space-y-1 text-sm">
                <li>• Supabase (PostgreSQL)</li>
                <li>• Supabase Edge Functions</li>
                <li>• Row Level Security (RLS)</li>
                <li>• TensorFlow.js (Browser AI)</li>
                <li>• Computer Vision algorithms</li>
                <li>• Real-time data sync</li>
                <li>• Twilio SMS/Voice API</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-purple-800">Mobile & Deployment</h3>
              <ul className="space-y-1 text-sm">
                <li>• Capacitor for mobile apps</li>
                <li>• Progressive Web App (PWA)</li>
                <li>• iOS & Android support</li>
                <li>• Push notifications</li>
                <li>• Background processing</li>
                <li>• App store deployment</li>
                <li>• Cross-platform compatibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Instructions */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Live Demo Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">To Test the System:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click "Start AI Monitoring" button</li>
                <li>Allow camera access when prompted</li>
                <li>Set up emergency contacts in the Emergency Actions panel</li>
                <li>System will analyze your face in real-time</li>
                <li>Close your eyes for 3+ seconds to trigger sleep detection</li>
                <li>Emergency alert will appear with 5-second countdown</li>
                <li>SMS and location will be sent to emergency contacts (simulated)</li>
              </ol>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> For the presentation, real SMS/calling requires Supabase backend integration with Twilio. Currently showing simulated emergency responses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresentationContent;
