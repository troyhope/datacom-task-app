import { useState, useCallback } from "react";

type UseApiOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>, options: UseApiOptions<T> = {}) => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiCall();
        options.onSuccess?.(data);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An error occurred");
        setError(error);
        options.onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    execute,
  };
}
