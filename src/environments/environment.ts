import { AppEnvironment } from '../app/core/models';

export const environment: AppEnvironment = {
  production: false,
  dataMode: 'local',        // 'local' = read from assets/profiles/*.json | 'api' = fetch from backend
  apiUrl: 'http://localhost:3000/api',
  defaultProfile: 'dinil',
  defaultTheme: 'midnight',
  defaultLocale: 'en',
  analyticsId: '',
};
