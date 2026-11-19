import { useEffect, useState } from 'react';
import { buildAdRecords, type AdRecord } from './adminAds';
const KEY = 'mukafaty:admin-ads-mock:v1';
let records: AdRecord[] | null = null;
const listeners = new Set<() => void>();
export function readMockAds(): AdRecord[] {
  if (records) return records;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed: AdRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(a => typeof a.id === 'string' && Array.isArray(a.cities))) {
        records = parsed.map(a => ({...a, createdAt: new Date(a.createdAt)}));
      }
    }
  } catch { /* local storage unavailable or outdated: use initial mock */ }
  records ??= buildAdRecords(new Date());
  return records;
}
export function writeMockAds(next: AdRecord[]) {
  // Do not persist temporary blob URLs as uploaded media.
  const json = JSON.stringify(next, (_key, value) => typeof value === 'string' && value.startsWith('blob:') ? '' : value);
  localStorage.setItem(KEY, json); // Throw on failure; callers must not announce success.
  records = next;
  listeners.forEach(fn => fn());
}
export function useMockAds() {
  const [ads, setAds] = useState<AdRecord[]>([]);
  useEffect(() => {
    const sync = () => setAds([...readMockAds()]);
    sync(); listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);
  return [ads, (update: AdRecord[] | ((ads: AdRecord[]) => AdRecord[])) => writeMockAds(typeof update === 'function' ? update(readMockAds()) : update)] as const;
}