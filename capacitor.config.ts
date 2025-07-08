
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.39b15849cf96447cbb50614cb2ad6d05',
  appName: 'safe-drive-alert-guardian',
  webDir: 'dist',
  server: {
    url: 'https://39b15849-cf96-447c-bb50-614cb2ad6d05.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;
