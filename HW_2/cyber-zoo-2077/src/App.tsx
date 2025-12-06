import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { EventProvider } from './context/EventContext';
import Dashboard from './pages/Dashboard';
import './styles/global.scss';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff00e1',
    },
    secondary: {
      main: '#7bed9f',
    },
    background: {
      default: '#0c0c0c',
      paper: '#1a1a2e',
    },
  },
  typography: {
    fontFamily: '"SK Cuber", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EventProvider>
        <Dashboard />
      </EventProvider>
    </ThemeProvider>
  );
}

export default App;
