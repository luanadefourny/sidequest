import './TestComponent.css';
import { useEffect, useRef } from 'react';
import { initMap } from '../../services/mapService';

function TestComponent () {
  /*const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      initMap(mapContainerRef.current).catch(console.error);
    }
  }, []);
  */
  return (
    <div className="testComponent-container">
    </div>
  );
}

export default TestComponent;