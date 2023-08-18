import {
  CustomErrors,
  GrnReqDetails,
  ConfirmGrnSuccessPayload,
  GrnInitResponse,
  GrnApproverSuccessList,
  GrnSendForAprovalSuccess,
  GrnHistoryDetails,
  Lov,
  GrnPriceDetailsSuccess,
  TcsCollectedResponse,
  GrnHistoryPayload,
  GrnProductDetails
} from '@poss-web/shared/models';
import { GrnRequestItemEntity } from './grn.entity';

export interface GrnSate {
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  isLoading: boolean;
  totalElements: number;
  grnReqStatus: GrnRequestItemEntity;
  grnDetails: GrnReqDetails;
  grnConfirmResponse: ConfirmGrnSuccessPayload;
  customerId: string;
  totalReturnProduct: number;
  totalReturnGrn: number;
  status: string;
  grnInitiateResponse: GrnInitResponse;
  itemDetails: GrnProductDetails;
  reqId: string;
  locationCodes: any;
  approvers: GrnApproverSuccessList[];
  sendForApprovalResponse: GrnSendForAprovalSuccess;
  sendForApprovalSuccess: GrnSendForAprovalSuccess;
  grnHistory: GrnHistoryDetails[];
  totalGrnHistoryReq: number;
  grnReasons: Lov[];
  finalPriceDetails: GrnPriceDetailsSuccess;
  tcsAmountCollected: TcsCollectedResponse;
  focDeductionAmount?: any;
  historySearchParamDetails: GrnHistoryPayload;
}
