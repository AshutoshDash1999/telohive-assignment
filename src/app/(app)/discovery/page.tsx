import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { spacesQueryKey } from "@/lib/api/spaces";
import { parseSpacesQueryFromRecord } from "@/lib/discovery/query-state";
import { fetchSpacesOnServer } from "@/lib/server/spaces-api";

import { DiscoveryClient } from "./DiscoveryClient";

interface DiscoveryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DiscoveryPage({ searchParams }: DiscoveryPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialQuery = parseSpacesQueryFromRecord(resolvedSearchParams);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: spacesQueryKey(initialQuery),
    queryFn: () => fetchSpacesOnServer(initialQuery),
  });

  return (
    <section>
      <h1 className="text-2xl font-semibold text-zinc-900">Discovery</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Discover and filter available spaces.
      </p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DiscoveryClient initialQuery={initialQuery} />
      </HydrationBoundary>
    </section>
  );
}
