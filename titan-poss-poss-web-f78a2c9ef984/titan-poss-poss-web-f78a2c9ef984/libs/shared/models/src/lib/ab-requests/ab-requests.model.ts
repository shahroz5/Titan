import { Moment } from 'moment';

export interface ABRequests {
  results: AB[];
  count: number;
}
export interface AB {
  approvedBy: string;
  invoiceNo: number;
  approvedDate: Moment;
  approverRemarks: string;
  docDate: Moment;
  docNo: number;
  fiscalYear: number;
  headerData: any;
  customerName: string;
  totalAmount: number;
  locationCode: string;
  mobileNumber: number;
  abDocNo: number;
  processId: string;
  requestedBy: string;
  requestedDate: any;
  requestorRemarks: string;
  taskId: string;
  taskName: string;
  workflowType: string;
}
