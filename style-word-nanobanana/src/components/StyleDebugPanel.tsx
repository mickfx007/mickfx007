"use client";
import useSWR from 'swr';

type Props = {
  descriptor?: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function StyleDebugPanel({ descriptor }: Props) {
  const { data } = useSWR('/api/provider-health', fetcher, { refreshInterval: 15000 });

  return (
    <div className="rounded-lg border bg-white p-4 text-sm">
      <div className="mb-2 font-medium">Style Debug</div>
      <div className="text-neutral-700 whitespace-pre-wrap">{descriptor || 'No descriptor yet.'}</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {data?.providers?.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 rounded-md border p-2">
            <span className={`h-2 w-2 rounded-full ${p.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-neutral-500">{p.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

