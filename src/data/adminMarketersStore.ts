import { useEffect, useState } from "react";
import { buildMarketers, marketerSchema, type Marketer } from "./adminMarketers";

const KEY = "mukafaty:external-marketers-mock:v1";
let records: Marketer[] | null = null;
const listeners = new Set<() => void>();
function readMarketers() {
  if (records) return records;
  try {
    const parsed = marketerSchema.array().safeParse(JSON.parse(localStorage.getItem(KEY) ?? "null"));
    if (parsed.success && parsed.data.length === 286 && new Set(parsed.data.map(m => m.id)).size === 286) records = parsed.data;
  } catch { /* Fall back to isolated mock data if storage is unavailable. */ }
  records ??= buildMarketers();
  return records;
}
export function useMockMarketers() {
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => { setMarketers([...readMarketers()]); setReady(true); };
    const storageSync = (e: StorageEvent) => { if (e.key === KEY) { records = null; sync(); } };
    sync(); listeners.add(sync); window.addEventListener("storage", storageSync);
    return () => { listeners.delete(sync); window.removeEventListener("storage", storageSync); };
  }, []);
  const update = (fn: (current: Marketer[]) => Marketer[]) => {
    const next = fn(readMarketers());
    localStorage.setItem(KEY, JSON.stringify(next));
    records = next; listeners.forEach(fn => fn());
  };
  return { marketers, update, ready };
}