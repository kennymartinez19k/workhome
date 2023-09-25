import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'bodega-la-fe',
  webDir: 'dist/bodega-la-fe',
  server: {
    androidScheme: 'https'
  }
};

export default config;
