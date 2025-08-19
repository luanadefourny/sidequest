import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface DistanceSliderProps {
  radius: number; // radius in meters
  setRadius: (value: number) => void;
}

function valuetext(value: number) {
  return `${value}km`;
}

export default function DistanceSlider({ radius, setRadius }: DistanceSliderProps) {
  const sliderValue = Math.round(radius / 1000);

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Always visible"
        value={sliderValue}
        min={0}
        max={50}
        getAriaValueText={valuetext}
        step={1}
        marks={[
          { value: 0, label: '0km' },
          { value: 50, label: '50km' },
        ]}
        valueLabelDisplay="on"
        onChange={(_, value) => setRadius((value as number) * 1000)}
      />
    </Box>
  );
}