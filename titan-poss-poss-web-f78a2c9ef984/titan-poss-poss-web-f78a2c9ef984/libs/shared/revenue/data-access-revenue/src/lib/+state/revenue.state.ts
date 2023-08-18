import {
  CustomErrors,
  RevenueResponse,
  TodayRevenueResponse
} from '@poss-web/shared/models';

export const REVENUE_FEATURE_KEY = 'revenues';

export interface RevenueState {
  isLoading: boolean;
  error: CustomErrors;
  revenueData: RevenueResponse;
  todayRevenue: TodayRevenueResponse;
  ghsRevenue: TodayRevenueResponse;
  serviceRevenue: TodayRevenueResponse;
}
