import { AppProviders } from './providers/AppProviders';
import { AppRouterProvider } from './router/AppRouterProvider';

export function App() {
  return (
    <AppProviders>
      <AppRouterProvider />
    </AppProviders>
  );
}
