import { useQuery } from "@tanstack/react-query";
import { useTenant, useAuth } from "@gaqno-development/frontcore/contexts";
import { financeApi } from "@/lib/finance-api";
import type { IDashboardMetrics } from "@gaqno-development/types/finance";

export const useDashboardMetrics = () => {
  const { tenantId } = useTenant();
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery<IDashboardMetrics>({
    queryKey: ["finance-dashboard-metrics", tenantId ?? "no-tenant"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      return financeApi.dashboard.getMetrics();
    },
    enabled: !!user,
    refetchInterval: 60_000,
  });

  return {
    metrics: data,
    isLoading,
    refetch,
  };
};
