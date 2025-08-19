import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useEffect, useState } from 'react';

const maxRadius = 25; //change here
interface DistanceSliderProps {
  radius: number; // radius in meters
  setRadius: (value: number) => void;
}

function valuetext(value: number) {
  return `${value}km`;
}

export default function DistanceSlider({ radius, setRadius }: DistanceSliderProps) {
  const [uIRadius, setUIRadius] = useState(Math.round(radius/1000));
  // const sliderValue = Math.round(radius / 1000);

  useEffect(() => {
    setUIRadius(Math.round(radius/1000));
  }, [radius]);

  return (
    <Box sx={{ width: 400, display: 'flex', alignItems: 'center', gap: 8 }}>
      <Slider
        aria-label="Always visible"
        value={uIRadius}
        min={0}
        max={maxRadius}
        getAriaValueText={valuetext}
        step={1}
        marks={[
          { value: 0, label: '0km' },
          { value: maxRadius, label: `${maxRadius}km` },
        ]}
        valueLabelDisplay="on"
        onChange={(_, value) => setUIRadius((value as number))} // ui only
      />
      <button
        type="button"
        onClick={() => {
          setRadius(uIRadius * 1000);
        }}
        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
      >
        Apply
      </button>
    </Box>
  );
}