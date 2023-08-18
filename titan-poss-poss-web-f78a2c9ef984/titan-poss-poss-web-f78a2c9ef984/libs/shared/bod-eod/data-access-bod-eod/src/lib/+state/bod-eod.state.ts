import { AvailableMetalRates, CustomErrors } from '@poss-web/shared/models';

export class BodEodState {
  errors?: CustomErrors;
  isLoading: boolean;

  currentDayBodStatus: string;
  openBusinessDate: number;
  eodBusinessDate: number;
  latestBusinessDate: number;
  availableMetalRates: AvailableMetalRates;
  isGoldRateAvailable: boolean;
  metalRatesAvailableStatus: string;
  bodEodStatus: string;
  fiscalYear: number;
}
