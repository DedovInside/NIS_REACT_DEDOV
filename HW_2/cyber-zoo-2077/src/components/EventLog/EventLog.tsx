import React from 'react';
import { 
  Drawer, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button,
  Box
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useEventLog } from '../../hooks/useEventLog';

interface EventLogProps {
  open: boolean;
  onClose: () => void;
}

const EventLog: React.FC<EventLogProps> = ({ open, onClose }) => {
  const { events, clearEvents } = useEventLog();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 350,
          backgroundColor: '#1a1a2e',
          color: 'white'
        }
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          height: '100%', 
          backgroundColor: 'transparent',
          padding: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#00f5ff',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AnalyticsIcon />
            System Events
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={clearEvents}
            sx={{ 
              borderColor: '#ff4757', 
              color: '#ff4757',
              '&:hover': {
                borderColor: '#ff3838',
                backgroundColor: 'rgba(255, 71, 87, 0.1)'
              }
            }}
          >
            Clear
          </Button>
        </Box>

        <List sx={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
          {events.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No events yet..."
                sx={{ color: '#888' }}
              />
            </ListItem>
          ) : (
            events.map((event, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  borderBottom: '1px solid #333',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 245, 255, 0.05)'
                  }
                }}
              >
                <ListItemText 
                  primary={event}
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontSize: '0.875rem',
                      color: index === 0 ? '#00f5ff' : 'white'
                    }
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Drawer>
  );
};

export default EventLog;
