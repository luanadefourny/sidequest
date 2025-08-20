import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const MAX_RADIUS_KM = 25;

interface DistanceSliderProps {
  radius: number; // meters
  setRadius: (value: number) => void;
}

function valuetext(value: number) {
  return `${value} km`;
}

const marks = [0, 5, 10, 15, 20, 25].map((v) => ({ value: v, label: `${v} km` }));

export default function DistanceSlider({ radius, setRadius }: DistanceSliderProps) {
  const [uIRadius, setUIRadius] = useState<number>(Math.round(radius / 1000));

  useEffect(() => {
    setUIRadius(Math.round(radius / 1000));
  }, [radius]);

  const handleApply = () => {
    setRadius(uIRadius * 1000);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 460,
        mx: 'auto',
        px: 3,
        py: 3,
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
        Search radius
      </Typography>

      <Typography variant="subtitle2" sx={{ fontWeight:400, color: '#374151' }}>
        Set how far from your chosen location you want to search (in km)
      </Typography>

      <Box sx={{ width: '100%', px: 1 }}>
        <Slider
          aria-label="Distance in km"
          value={uIRadius}
          min={1}
          max={MAX_RADIUS_KM}
          step={1}
          marks={marks}
          getAriaValueText={valuetext}
          valueLabelDisplay="on"
          valueLabelFormat={(v) => `${v} km`}
          onChange={(_, value) => setUIRadius(value as number)}
          sx={{
            mt: 1,
            '& .MuiSlider-track': {
              height: 8,
              borderRadius: 8,
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
            },
            '& .MuiSlider-rail': {
              height: 8,
              borderRadius: 8,
              bgcolor: 'rgba(15,23,42,0.06)',
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              bgcolor: '#ffffff',
              border: '4px solid #10b981',
              boxShadow: '0 8px 20px rgba(16,185,129,0.18)',
              '&:hover': {
                boxShadow: '0 10px 28px rgba(16,185,129,0.22)'
              },
            },
            '& .MuiSlider-valueLabel': {
              background: '#059669',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 6,
              transform: 'translateY(-14px) !important',
              '& *': { background: 'transparent' },
            },
            '& .MuiSlider-markLabel': {
              color: 'rgba(15,23,42,0.45)',
              fontSize: '0.72rem',
            },
          }}
        />
      </Box>

      <div className="w-full flex items-center justify-between px-2 mt-1">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">Selected</span>
          <span className="text-xs text-gray-600">{uIRadius} km • {uIRadius * 1000} m</span>
        </div>

        <div>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-emerald-700 transition-transform transform hover:-translate-y-0.5"
          >
            Apply
          </button>
        </div>
      </div>
    </Box>
  );
}
