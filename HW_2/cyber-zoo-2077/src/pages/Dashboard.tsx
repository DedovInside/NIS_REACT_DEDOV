import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Container, 
  Grid, 
  AppBar, 
  Toolbar, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Button,
  Skeleton,
  Box
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PetsIcon from '@mui/icons-material/Pets';
import PetCard from '../components/PetCard/PetCard';
import EventLog from '../components/EventLog/EventLog';
import type { Pet } from '../components/PetCard/types';
import { useEventLog } from '../hooks/useEventLog';
import { petsData } from '../data/pets';

const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSpecies, setFilterSpecies] = useState<string>('all');
  const [logOpen, setLogOpen] = useState(false);
  const { logPetAction } = useEventLog();

  useEffect(() => {
    // Симулируем задержку загрузки данных
    const loadPets = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPets(petsData); // Используем данные из .ts файла с originalName
      setLoading(false);
    };

    loadPets();
  }, []);

  const filteredPets = useMemo(() => {
    if (filterSpecies === 'all') return pets;
    return pets.filter(pet => pet.species === filterSpecies);
  }, [pets, filterSpecies]);

  const uniqueSpecies = useMemo(() => {
    return [...new Set(pets.map(pet => pet.species))];
  }, [pets]);

  const handlePetAction = useCallback((petId: string, action: string) => {
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      logPetAction(pet.name, action);
    }
  }, [pets, logPetAction]);

  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
          <Skeleton 
            variant="rectangular" 
            height={400} 
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)' 
            }} 
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#0f0f23',
          backgroundImage: 'linear-gradient(135deg, #0f0f23, #1a1a2e)'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: '#ff00e1',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <PetsIcon sx={{ fontSize: '2rem' }} />
            Cyber Zoo 2077
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => setLogOpen(true)}
            sx={{ 
              backgroundColor: 'rgba(255, 0, 225, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 225, 0.2)'
              },
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <AnalyticsIcon />
            Event Log
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'white' }}>Filter by Species</InputLabel>
            <Select
              value={filterSpecies}
              label="Filter by Species"
              onChange={(e) => setFilterSpecies(e.target.value)}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff00e1',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff00e1',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff00e1',
                },
                '.MuiSvgIcon-root': {
                  color: 'white',
                }
              }}
            >
              <MenuItem value="all">All Species</MenuItem>
              {uniqueSpecies.map(species => (
                <MenuItem key={species} value={species}>
                  {species.charAt(0).toUpperCase() + species.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ color: '#ff00e1' }}>
            {loading ? 'Loading...' : `${filteredPets.length} pets found`}
          </Typography>
        </Box>

        {loading ? renderSkeletons() : (
          <Grid container spacing={3}>
            {filteredPets.map(pet => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pet.id}>
                <PetCard pet={pet} onAction={handlePetAction} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <EventLog open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
};

export default Dashboard;
