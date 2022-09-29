import { useState, useEffect } from 'react';

const getWindowHeight = () => {
  const { innerHeight: height } = window;
  return height;
};

const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState(getWindowHeight());

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(getWindowHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowHeight;
};

export default useWindowHeight;
