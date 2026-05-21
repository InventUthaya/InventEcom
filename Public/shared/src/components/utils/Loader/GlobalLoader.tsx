import React, { useEffect, useState } from 'react';
import Loader from './Loader';

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleEnd = () => setIsLoading(false);

    window.addEventListener('api_load_start', handleStart);
    window.addEventListener('api_load_end', handleEnd);

    return () => {
      window.removeEventListener('api_load_start', handleStart);
      window.removeEventListener('api_load_end', handleEnd);
    };
  }, []);

  if (!isLoading) return null;

  return <Loader />;
}
