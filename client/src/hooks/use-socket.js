import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000';

export function useSocket(onDeviceUpdate, onAlertUpdate) {
  useEffect(() => {
    const socket = io(SOCKET_URL);

    if (onDeviceUpdate) {
      socket.on('device:update', onDeviceUpdate);
    }

    if (onAlertUpdate) {
      socket.on('alert:update', onAlertUpdate);
    }

    return () => {
      socket.disconnect();
    };
  }, [onAlertUpdate, onDeviceUpdate]);
}
