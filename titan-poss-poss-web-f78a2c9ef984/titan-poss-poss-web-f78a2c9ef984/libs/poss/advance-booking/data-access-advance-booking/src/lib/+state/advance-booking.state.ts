import { ABEntity, ABRequestStatusListEntity } from './advance-booking.entity';
import {
  CustomErrors,
  SearchProductList,
  CashMemoTaxDetails,
  ProductPriceDetails,
  AdvanceBookingDetailsResponse,
  CashMemoItemDetailsResponse,
  ABRequestStatusDownValues,
  ABSearchValues,
  FileUploadLists,
  StatusTypesEnum
} from '@poss-web/shared/models';

export class AdvanceBookingState {
  hasError?: CustomErrors;
  isLoading?: boolean;

  //product grid
  searchProductList: SearchProductList[];
  searchProductListCount: number;
  productDetailsCount: number;
  RSODetails: string[];
  validateProductAndPriceDetails: ProductPriceDetails;
  taxDetails: CashMemoTaxDetails;
  createCashMemoResponse: AdvanceBookingDetailsResponse;
  minABvalue: number;
  status: StatusTypesEnum;
  frozenABOrder: boolean;
  frozenABOrderAmount: number;
  bestRateABOrder: boolean;
  searhABResponseCount: number;
  viewCashMemoResponse: AdvanceBookingDetailsResponse;
  searhABResponse: ABEntity;
  partialUpdateCashMemoResponse: AdvanceBookingDetailsResponse;
  updateCashMemoResponse: AdvanceBookingDetailsResponse;
  freezeAdvanceBookingResponse: AdvanceBookingDetailsResponse;
  ABRequestStatusList: ABRequestStatusListEntity;
  ABRequestStatusListCount: number;
  deleteCashMemoResponse: boolean;
  deleteItemFromCashMemoResponse: CashMemoItemDetailsResponse;
  selectedData: any;

  selectedLotNumber: string;
  searchValues: ABSearchValues;
  requestStausDropDownValues: ABRequestStatusDownValues;
  orderNumber: { order: number; status: string };
  uploadFileResponse: boolean;
  uploadFileListResponse: FileUploadLists[];
  downloadFileUrl: string;
  searchABDetails: {
    isABSearchDone: boolean;
    searchABResponseCount: number;
  };

  isMetalRateValidated: boolean;
}
