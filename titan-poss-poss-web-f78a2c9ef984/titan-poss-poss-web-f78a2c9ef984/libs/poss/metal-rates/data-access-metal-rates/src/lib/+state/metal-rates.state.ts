import { CustomErrors } from '@poss-web/shared/models';

export const metalRatesFeatureKey = 'metalRates';

export class MetalRatesState {
  errors?: CustomErrors;
  isLoading: boolean;
  goldRateAvailableForBusinessDay: boolean;
  bodBusinessDate: number;
  eodBusinessDate: number;
  metalRatesUpdatedInBoutique: boolean;
}
