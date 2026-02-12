import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ScienceIcon from '@mui/icons-material/Science';
import type { Pet } from '../PetCard/types';
import { getAnimalImagePath } from '../../utils/imageMapper';

interface PetDetailsModalProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
}

// Функция для форматирования названий полей
const formatFieldName = (field: string): string => {
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ pet, open, onClose }) => {
  if (!pet) return null;

  const imagePath = getAnimalImagePath(pet);
  const hasCharacteristics = pet.characteristics && Object.keys(pet.characteristics).length > 0;
  const hasTaxonomy = pet.taxonomy && Object.keys(pet.taxonomy).length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#1a1a2e',
          backgroundImage: 'linear-gradient(145deg, #1a1a2e, #16213e)',
          color: 'white',
          border: '2px solid #ff00e1',
          boxShadow: '0 0 40px rgba(255, 0, 225, 0.3)'
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#ff00e1', 
        textAlign: 'center',
        fontFamily: 'SK Cuber',
        fontSize: '1.8rem',
        textShadow: '0 0 10px rgba(255, 0, 225, 0.5)'
      }}>
        {pet.name}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Изображение и основная информация */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            <Box sx={{ flex: '0 0 200px' }}>
              <img
                src={imagePath}
                alt={pet.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  border: '2px solid #ff00e1',
                  boxShadow: '0 0 20px rgba(255, 0, 225, 0.4)'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#00f5ff', 
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <InfoIcon />
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#888' }}>Original Name:</Typography>
                  <Chip 
                    label={pet.originalName || 'Unknown'} 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 0, 225, 0.2)',
                      color: '#ff00e1'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#888' }}>Scientific Class:</Typography>
                  <Chip 
                    label={pet.species} 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(0, 245, 255, 0.2)',
                      color: '#00f5ff'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#888' }}>Current Level:</Typography>
                  <Chip 
                    label={`Level ${pet.level}`} 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(123, 237, 159, 0.2)',
                      color: '#7bed9f'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#888' }}>Energy:</Typography>
                  <Chip 
                    label={`${pet.energy}/100`} 
                    size="small"
                    sx={{ 
                      backgroundColor: pet.energy > 50 ? 'rgba(123, 237, 159, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                      color: pet.energy > 50 ? '#7bed9f' : '#ff4757'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#888' }}>Mood:</Typography>
                  <Chip 
                    label={pet.mood} 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255, 218, 121, 0.2)',
                      color: '#ffda79'
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ backgroundColor: '#333' }} />

          {/* Характеристики */}
          {hasCharacteristics && (
            <>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#ff00e1', 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <InfoIcon /> Characteristics
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(pet.characteristics || {}).map(([key, value]) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={key}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 0, 225, 0.2)'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ color: '#888', mb: 0.5, fontSize: '0.75rem' }}
                        >
                          {formatFieldName(key)}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'white', 
                            fontWeight: 'bold',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            hyphens: 'auto'
                          }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ backgroundColor: '#333' }} />
            </>
          )}

          {/* Таксономия */}
          {hasTaxonomy && (
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#00f5ff', 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ScienceIcon /> Taxonomy
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(pet.taxonomy || {}).map(([key, value]) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={key}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 245, 255, 0.2)'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ color: '#888', mb: 0.5, fontSize: '0.75rem' }}
                      >
                        {formatFieldName(key)}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {!hasCharacteristics && !hasTaxonomy && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: '#888' }}>
                No additional information available for this pet
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#ff00e1',
            color: 'white',
            fontFamily: 'SK Cuber',
            '&:hover': {
              backgroundColor: '#ff33e6',
              boxShadow: '0 4px 12px rgba(255, 0, 225, 0.4)'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PetDetailsModal;
