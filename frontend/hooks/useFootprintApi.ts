import { api } from "@/api/axios";
import { IEcoTrackFormValue } from "@/components/form/carbon-calculation-form";
import { useFootprintStore } from "@/state/useFootprintStore";
import { IApiResponse } from "@/types/api.type";
import {
  ICarbpnCalculationData,
  IMonthlyFootprintAnalytics,
} from "@/types/footprintApi.type";
import {
  handleApiError,
  handleApiSuccess,
  HookResponse,
} from "@/utils/api.utils";
import { useCallback } from "react";
import { toast } from "sonner";

export const useFootprintApi = () => {
  // Destructure global state actions from Zustand
  const { setDashboardData, setLoading, setLastResult, isLoading, resetStore } =
    useFootprintStore();

  // 1. Create Footprint (POST)
  const createCarbonFootprintApi = useCallback(
    async (
      activityData: IEcoTrackFormValue["activityData"]
    ): Promise<HookResponse<ICarbpnCalculationData>> => {
      setLoading(true);
      try {
        const now = new Date();
        const currentPeriod = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

        const payload = { activityData, period: currentPeriod };

        const response = await api.post<IApiResponse<ICarbpnCalculationData>>(
          "/footprints/calculate",
          payload
        );

        if (response.data.success) {
          // Update the "Last Result" in the store for the success view
          setLastResult(response.data.data);
          toast.success(response.data.message);
        }

        return handleApiSuccess(response);
      } catch (error) {
        const errorData = handleApiError(error);
        toast.error(errorData.message);
        return errorData;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setLastResult]
  );

  // 2. Refresh Dashboard (Bulk GET)
  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [historyRes, analyticsRes] = await Promise.all([
        api.get<IApiResponse<ICarbpnCalculationData[]>>("/footprints/history"),
        api.get<IApiResponse<IMonthlyFootprintAnalytics[]>>(
          "/footprints/analytics"
        ),
      ]);

      if (historyRes.data.success && analyticsRes.data.success) {
        // Push both history and analytics to Zustand store at once
        setDashboardData(historyRes.data.data, analyticsRes.data.data);
        
      }
    } catch (error) {
      resetStore()
      const {message} = handleApiError(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [setDashboardData, setLoading]);

  return {
    isLoading, // Export the global loading state
    createCarbonFootprintApi,
    refreshDashboard,
  };
};
