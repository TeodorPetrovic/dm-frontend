/**
 * Composable for search event tracking
 * Demonstrates ClickHouse's support for structured and semi-structured data
 */

import { useEventTracking } from './useShoppingCart';

export const useSearchTracking = () => {
  const { trackEvent } = useEventTracking();

  /**
   * Track a search event with rich metadata
   * This demonstrates ClickHouse's ability to store complex structured data
   * 
   * @param searchQuery - The search query string
   * @param productId - The product ID (can be 0 for no result)
   * @param metadata - Additional search context data
   */
  const trackSearch = async (
    searchQuery: string,
    productId: number = 0,
    metadata?: {
      resultsCount?: number;
      filters?: Record<string, any>;
      sortBy?: string;
      page?: number;
      clickedPosition?: number;
      timeSpent?: number;
      deviceType?: string;
      userAgent?: string;
      referrer?: string;
    }
  ) => {
    const searchMetadata = {
      query: searchQuery,
      timestamp: Date.now(),
      resultsCount: metadata?.resultsCount || 0,
      filters: metadata?.filters || {},
      sortBy: metadata?.sortBy || 'relevance',
      page: metadata?.page || 1,
      clickedPosition: metadata?.clickedPosition,
      timeSpent: metadata?.timeSpent,
      deviceType: metadata?.deviceType || getDeviceType(),
      userAgent: metadata?.userAgent || (import.meta.client ? navigator.userAgent : ''),
      referrer: metadata?.referrer || (import.meta.client ? document.referrer : ''),
    };

    await trackEvent('search', productId, searchMetadata);
  };

  /**
   * Track a filter application event
   */
  const trackFilter = async (
    productId: number,
    filterType: string,
    filterValue: any,
    appliedFilters: Record<string, any>
  ) => {
    const filterMetadata = {
      filterType,
      filterValue,
      appliedFilters,
      timestamp: Date.now(),
    };

    await trackEvent('filter_applied', productId, filterMetadata);
  };

  /**
   * Track a product comparison event
   */
  const trackComparison = async (
    productIds: number[],
    comparisonAttributes: string[]
  ) => {
    const comparisonMetadata = {
      productIds,
      comparisonAttributes,
      productCount: productIds.length,
      timestamp: Date.now(),
    };

    // Use the first product ID as the primary
    await trackEvent('product_comparison', productIds[0], comparisonMetadata);
  };

  // Helper to detect device type
  const getDeviceType = (): string => {
    if (!import.meta.client) return 'server';
    
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile')) return 'mobile';
    if (userAgent.includes('tablet')) return 'tablet';
    return 'desktop';
  };

  return {
    trackSearch,
    trackFilter,
    trackComparison,
  };
};
