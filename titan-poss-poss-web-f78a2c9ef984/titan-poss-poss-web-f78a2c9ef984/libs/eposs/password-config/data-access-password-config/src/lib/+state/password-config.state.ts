import {
  CustomErrors,
  LocationSummaryList,
  TransactionTypes,
  MetalRates,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateBoutiquePasswordForGoldRateResponse,
  GenerateCashDepositPasswordResponse
} from '@poss-web/shared/models';

export class PasswordConfigState {
  hasError?: CustomErrors;
  isLoading?: boolean;

  locationCodes: LocationSummaryList[];
  documentTypes: TransactionTypes[];
  materialPrices: MetalRates[];
  generateBoutiquePasswordResponseForManualBill: GenerateBoutiquePasswordForManualBillResponse;
  generateBoutiquePasswordResponseForGoldRate: GenerateBoutiquePasswordForGoldRateResponse;
  generateCashDepostPasswordResponse: GenerateCashDepositPasswordResponse;
}
