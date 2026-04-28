import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || undefined;

export function useSocket(onDeviceUpdate, onAlertUpdate) {
  useEffect(() => {
    const socket = SOCKET_URL ? io(SOCKET_URL) : io();

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
