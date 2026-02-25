import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './app/store/store';
import AppRouter from './app/router/AppRouter';
import ThemeProvider from './app/providers/ThemeProvider';
import ErrorBoundary from './app/providers/ErrorBoundary';
import './shared/config/i18n';
import AuthInit from './app/providers/AuthInit';

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthInit>
              <AppRouter />
            </AuthInit>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
