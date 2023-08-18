import { Moment } from 'moment';
import { ConversionRequestItems } from '@poss-web/shared/models';

export interface ConversionApprovalRequestsListingPayload {
  reqDocNo: number;
  locationCode: string;
  status: string;
  pageNumber: number;
  pageSize: number;
}

export interface ConversionApprovalsItem {
  id: number;
  reqDocNo: number;
  requestDate: Moment;
  locationCode: string;
  variantCode: string;
  productDescription: string;
  currencyCode: string;
  totalQuantity: number;
  totalValue: number;
  totalWeight: string;
  weightUnit: string;
  status: string;
}
export interface ConversionApprovalListingResponsePayload {
  approvalRequestsList: ConversionApprovalsItem[];
  approvalRequestsLength: number;
}

export interface SelectedRequestPayload {
  id: number;
  requestType: string;
}
export interface SelectedRequestDetailsResponse {
  id: number;
  reqDocNo: number;
  status: string;
  createdDate: Moment;
  totalRequestedQuantity: number;
  totalRequestedWeight: number;
  totalRequestedValue: number;
  otherDetails: ConversionRequestItems[];
  locationCode: string;
  requestRemarks: string;
  approvalRemarks: string;
}

export interface SelectedRequestDataResponse {
  conversionRequestItems: ConversionRequestItems[];
  itemIds: string[];
}
export interface UpdateApprovalRequestStatusPayload {
  id: number;
  requestType: string;
  requestUpdateDto: {
    itemIds: string[];
    remarks: string;
    status: string;
  };
}
