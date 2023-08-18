import { BinCodes, BinRequestResponse,CustomErrors, HistoryFiltersData} from '@poss-web/shared/models';
import { ItemEntity } from './in-stock.entity';




export interface InStockState {

  binCodes: BinCodes[];
  loaded: boolean;
  error: CustomErrors;
  isLoading: boolean;
  docNo: number;
  isBinCodeReset: boolean;
  isDocNoReset: boolean;
  binCodeCount: number;
  hasRequestedFailure: boolean;
  isRequestedBinSuccess: boolean;
  isRequestingBin: boolean;
  binRequestResponse: BinRequestResponse;

  binHistoryResponse:ItemEntity;
  isHistoryLoading:boolean;
  binHistoryCount:number;
  binHistoryError: CustomErrors;
  searchBinHistory:ItemEntity;
  isSearchHistoryLoading: boolean;
  searchHistoryError: CustomErrors;
  advancedFilter: HistoryFiltersData;


}



