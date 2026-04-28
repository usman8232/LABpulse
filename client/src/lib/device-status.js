export function getDeviceFreshness(device) {
  if (!device?.lastSeenAt) {
    return {
      label: 'Unknown',
      tone: 'warning',
      summary: 'No heartbeat recorded yet',
    };
  }

  const ageMs = Date.now() - new Date(device.lastSeenAt).getTime();
  const ageSeconds = Math.max(0, Math.round(ageMs / 1000));

  if (!device.isOnline || ageSeconds > 90) {
    return {
      label: 'Offline',
      tone: 'danger',
      summary: `Last seen ${formatRelativeAge(ageSeconds)} ago`,
    };
  }

  if (ageSeconds > 30) {
    return {
      label: 'Stale',
      tone: 'warning',
      summary: `Last seen ${formatRelativeAge(ageSeconds)} ago`,
    };
  }

  return {
    label: 'Live',
    tone: 'success',
    summary: `Last seen ${formatRelativeAge(ageSeconds)} ago`,
  };
}

export function formatRelativeAge(totalSeconds) {
  if (totalSeconds < 5) return 'just now';
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
}

export function getDeviceHealthTone(device) {
  if (!device.isOnline || device.currentAlertState === 'CRITICAL') return 'danger';
  if (device.currentAlertState === 'WARNING') return 'warning';
  return 'success';
}
