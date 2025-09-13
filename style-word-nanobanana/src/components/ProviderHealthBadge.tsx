"use client";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ProviderHealthBadge() {
  const { data } = useSWR('/api/provider-health', fetcher, { refreshInterval: 15000 });
  const healthy = data?.providers?.every((p: any) => p.healthy);
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs">
      <span className={`h-2 w-2 rounded-full ${healthy ? 'bg-green-500' : 'bg-yellow-500'}`} />
      <span>Providers</span>
    </div>
  );
}

