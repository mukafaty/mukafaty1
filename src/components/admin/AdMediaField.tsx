import { useId, useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LocalMedia } from '@/data/adminAds';
import { validateMediaFile } from '@/data/adminAdForm';
export function AdMediaField({ label, preferred, ratio, video = false, value, onChange, error }: {label: string; preferred: string; ratio: number; video?: boolean; value?: LocalMedia | undefined; onChange: (value?: LocalMedia) => void; error?: string | undefined}) {
  const id = useId(); const [issue, setIssue] = useState(''); const [busy, setBusy] = useState(false);
  async function pick(file?: File) {
    if (!file) return;
    const invalid = validateMediaFile(file, video); if (invalid) { setIssue(invalid); return; }
    setBusy(true); setIssue(''); const url = URL.createObjectURL(file);
    try {
      const meta = await new Promise<{width: number; height: number; duration?: number}>((resolve,reject) => {
        if (video) { const el = document.createElement('video'); el.preload = 'metadata'; el.onloadedmetadata = () => resolve({width: el.videoWidth, height: el.videoHeight, duration: el.duration}); el.onerror = reject; el.src = url; }
        else { const el = new Image(); el.onload = () => resolve({width: el.width, height: el.height}); el.onerror = reject; el.src = url; }
      });
      if (value?.url) URL.revokeObjectURL(value.url);
      onChange({url, name: file.name, size: file.size, ...meta, title: value?.title ?? '', description: value?.description ?? ''});
    } catch { URL.revokeObjectURL(url); setIssue('تعذر قراءة الملف، اختر ملفًا صالحًا'); } finally { setBusy(false); }
  }
  const mismatch = value && Math.abs(value.width / value.height - ratio) > 0.02;
  return <div className="min-w-0 space-y-2 rounded-xl border border-border bg-admin-canvas/60 p-3">
    <div className="text-center text-sm font-bold">{label}</div><p className="text-center text-xs text-muted-foreground" dir="ltr">{preferred}</p>
    <div className="grid aspect-square w-full place-items-center overflow-hidden rounded-lg bg-admin-sidebar">
      {value?.url ? video ? <video src={value.url} controls className="h-full w-full object-contain" /> : <img src={value.url} alt={label} className="h-full w-full object-contain" /> : <Upload className="text-admin-blue" size={28} />}
    </div>
    {value && <div className="space-y-1 text-xs"><p className="break-all">{value.name}</p><p dir="ltr">{value.width} × {value.height} · {(value.size / 1048576).toFixed(2)} MB{value.duration !== undefined ? ` · ${Math.round(value.duration)} sec` : ''}</p></div>}
    {mismatch && <p className="text-xs text-muted-foreground">الأبعاد تختلف عن المقاس المفضل؛ ستُحفظ دون قص.</p>}
    <input id={id} aria-label={label} type="file" className="hidden" accept={video ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp'} onChange={e => { void pick(e.target.files?.[0]); e.target.value = ''; }} />
    <div className="flex justify-center gap-1"><Button asChild variant="outline" size="sm"><label htmlFor={id} className="cursor-pointer"><Upload />{busy ? 'جارٍ القراءة' : value ? 'استبدال' : 'اختيار ملف'}</label></Button>{value && <Button variant="ghost" size="icon" type="button" aria-label={`إزالة ${label}`} title="إزالة الملف" onClick={() => { if (value.url) URL.revokeObjectURL(value.url); onChange(undefined); }}><Trash2 /></Button>}</div>
    {(issue || error) && <p role="alert" className="text-xs text-destructive">{issue || error}</p>}
    {video && <><input className="h-9 w-full rounded-lg border border-input bg-card px-2 text-xs" aria-label={`عنوان ${label}`} placeholder="عنوان الفيديو (اختياري)" value={value?.title ?? ''} disabled={!value} onChange={e => value && onChange({...value,title:e.target.value})} /><textarea className="w-full rounded-lg border border-input bg-card p-2 text-xs" aria-label={`وصف ${label}`} placeholder="وصف الفيديو (اختياري)" value={value?.description ?? ''} disabled={!value} onChange={e => value && onChange({...value,description:e.target.value})} /></>}
  </div>;
}