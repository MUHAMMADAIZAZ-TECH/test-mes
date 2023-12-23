import { useState, useEffect } from 'react';

const useInternetConnectionMonitor = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOnline, setWasOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setWasOnline(isOnline);
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [isOnline]);

  return { isOnline, wasOnline };
};

export default useInternetConnectionMonitor;
