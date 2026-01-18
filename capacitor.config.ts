import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sidequest.app',
  appName: 'Side Quest',
  webDir: 'out',
  server: {
    url: 'http://10.121.244.31:3000/dashboard', // <--- Updated IP
    cleartext: true
  }
};

export default config;