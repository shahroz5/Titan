import {
  CODetailsResponse,
  COMOrders,
  CreateCOResponse,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';

export class CustomerOrderState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  fetchedCOItems: COMOrders[];
  createCORes: CreateCOResponse;
  viewCORes: CODetailsResponse;
  updateCORes: CODetailsResponse;
  partialUpdateCORes: CODetailsResponse;
  deleteCoRes: boolean;
  minCOvalue: number;
  relationshipTypes: Lov[];
  frozenCOOrder: boolean;
  frozenCOOrderAmount: number;
  bestRateCOOrder: boolean;
}
