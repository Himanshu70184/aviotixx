// React Hook for Flight Operations (Re-price, Seat Map, SSR)
import { useState, useCallback } from 'react';
import {
  rePriceFlight,
  getSeatMap,
  getSSR,
  type RePriceResponse,
  type SeatMapResponse,
  type SSRResponse,
} from '../services/backendApi';

export function useFlightOperations() {
  const [isRepricing, setIsRepricing] = useState(false);
  const [isFetchingSeatMap, setIsFetchingSeatMap] = useState(false);
  const [isFetchingSSR, setIsFetchingSSR] = useState(false);

  /**
   * Re-price a selected flight
   */
  const reprice = useCallback(async (
    journeyId: string,
    segmentId: string,
    traceId?: string
  ): Promise<RePriceResponse> => {
    setIsRepricing(true);
    try {
      const response = await rePriceFlight({ journeyId, segmentId, traceId });
      return response;
    } finally {
      setIsRepricing(false);
    }
  }, []);

  /**
   * Get seat map for a flight
   */
  const fetchSeatMap = useCallback(async (
    journeyId: string,
    segmentId: string,
    traceId?: string
  ): Promise<SeatMapResponse> => {
    setIsFetchingSeatMap(true);
    try {
      const response = await getSeatMap({ journeyId, segmentId, traceId });
      return response;
    } finally {
      setIsFetchingSeatMap(false);
    }
  }, []);

  /**
   * Get special service requests
   */
  const fetchSSR = useCallback(async (
    journeyId: string,
    segmentId: string,
    traceId?: string
  ): Promise<SSRResponse> => {
    setIsFetchingSSR(true);
    try {
      const response = await getSSR({ journeyId, segmentId, traceId });
      return response;
    } finally {
      setIsFetchingSSR(false);
    }
  }, []);

  return {
    reprice,
    isRepricing,
    fetchSeatMap,
    isFetchingSeatMap,
    fetchSSR,
    isFetchingSSR,
  };
}
