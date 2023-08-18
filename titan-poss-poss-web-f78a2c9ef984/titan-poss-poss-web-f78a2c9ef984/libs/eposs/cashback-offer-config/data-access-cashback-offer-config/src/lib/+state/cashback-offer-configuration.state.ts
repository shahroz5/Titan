import {
  CustomErrors,
  BankDetailsPayload,
  CashbackOffer,
  PayerBankList,
  OfferDetails,
  ProductGroupMappingOption,
  CardDetails,
  CardDetailsUploadResponse
} from '@poss-web/shared/models';

export interface CashbackOfferConfigurationState {
  bankDetails: BankDetailsPayload;
  excludeCashback: boolean;
  totalElements: number;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
  error: CustomErrors;
  cashbackOfferList: CashbackOffer[];
  payerBank: PayerBankList[];
  offerDetails: OfferDetails[];
  isCleared: boolean;
  isCashAmount: boolean;
  selectedProductGroup: ProductGroupMappingOption[];
  isProductGroupUpdated: boolean;
  cardDetails: CardDetails[];
  fileResponse: CardDetailsUploadResponse;
  offerDetailsUpdated: boolean;
  errorLog: any;
}
