import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "",
      forceCodeForRefreshToken: true
    }
  },

  appId: 'com.ortizsoft.bodega_la_fe',
  appName: 'Bodega La Fe',
  webDir: 'dist/bodega-la-fe',
  server: {
    androidScheme: 'https'
  }
};

export default config;
