import { api } from "@/api/axios";
import { useAdminStore } from "@/state/adminStore";
import { IAdminSummary } from "@/types/admin.type"; // Ensure this is exported from your types
import { IApiResponse } from "@/types/api.type";
import {
  handleApiError,
  handleApiSuccess,
  HookResponse,
} from "@/utils/api.utils";
import { useCallback } from "react";
import { toast } from "sonner";

/**
 * @description Custom hook for Admin-level telemetry and governance data.
 * Adheres to the Service-Repository pattern by abstracting API logic.
 */
export const useAdminApi = () => {
  // Destructure store actions from your adminState
  const { setSummary, setIsLoading, isLoading } = useAdminStore();

  /**
   * @description Fetches global platform summary for the Global Audit view.
   * @returns {Promise<HookResponse<IAdminSummary>>}
   */
  const fetchAdminSummary = useCallback(async (): Promise<
    HookResponse<IAdminSummary>
  > => {
    setIsLoading(true);
    try {
      // 1. Execute GET request to the validated admin route
      const response = await api.get<IApiResponse<IAdminSummary>>(
        "/admin/summary"
      );

      const result = handleApiSuccess<IAdminSummary>(response);

      if (result.success && result.data) {
        // 2. Synchronize the global admin state
        setSummary(result.data);
      }

      return result;
    } catch (error) {
      // 3. Centralized error handling for programmatic or server errors
      const errorData = handleApiError(error);
      toast.error(errorData.message);
      return errorData;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setSummary]);

  /**
   * @description Fetches detailed aggregated footprint logs with filters.
   * Useful for the Node_Validation_Registry table.
   */
  const fetchAggregatedLogs = useCallback(
    async (filters: object = {}) => {
      setIsLoading(true);
      try {
        const response = await api.get<IApiResponse<any[]>>(
          "/admin/footprints",
          {
            params: filters, // Matches backend queryOptions
          }
        );
        return handleApiSuccess(response);
      } catch (error) {
        const errorData = handleApiError(error);
        toast.error(errorData.message);
        return errorData;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading]
  );

  return {
    fetchAdminSummary,
    fetchAggregatedLogs,
    isLoading,
  };
};
