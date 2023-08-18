import {
  AdvanceBookingDetailsResponse,
  ApprovalRequest,
  CashMemoItemDetails,
  CmRequestDetails,
  CmRequestList,
  CustomerInfo,
  CustomErrors,
  FileUploadLists,
  ManualBillDetails,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { CmRequestState } from './grf-request.state';
import { initialState } from './grf-request.reducer';
import * as selectors from './grf-request.selectors';
import * as moment from 'moment';

describe('Manual Cash Memo Request Selector Testing Suite', () => {
  const grfRequestList: CmRequestList[] = [
    {
      approvalStatus: 'PENDING',
      approvedBy: null,
      approvedDate: null,
      approverRemarks: null,
      docDate: moment(1625582616979),
      docNo: 23,
      fiscalYear: 2020,
      headerData: { type: 'MANUAL_BILL_HEADER' },
      locationCode: 'CPD',
      processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
      requestedBy: 'cashiercpd',
      requestedDate: moment(1625582616979),
      requestorRemarks: 'remarks',
      taskId: '8be44538-de68-11eb-bbe7-00155dde1995',
      taskName: 'REQUEST_APPROVER_L1',
      workflowType: 'MANUAL_BILL'
    }
  ];




  const approvalRequest: ApprovalRequest = {
    approverRemarks: 'test',
    approverRoleCode: 'A1',
    approverUserName: 'Approver1',
    level: 1,
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskId: '8CDAA81B-DE68-11EB-BBE7-00155DDE1995',
    requestorUserName: 'Requestor1',
    taskStatus: 'APPROVED',
    totalApproverLevels: 3
  };

  const fileUploadListRes: FileUploadLists[] = [
    {
      id: '1234567',
      name: 'file1'
    }
  ];

  const fileDownloadRes = 'http://downloadedurl.com';

  const grfRequestDetails: CmRequestDetails = {
    approvalLevel: 1,
    approvalStatus: 'APPROVED',
    approvedData: null,
    docNo: 89,
    headerData: null,
    locationCode: 'CPD',
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    requestorRemarks: 'testing',
    requestorUserName: 'Requestor1'
  };

  const customerInfo: CustomerInfo = {
    customerId: '36',
    title: null,
    customerName: 'Test Customer',
    customerType: 'REGULAR',
    ulpId: '700001982839',
    mobileNumber: '9945500787',
    emailId: 'test@gmail.com',
    instiTaxNo: null,
    custTaxNo: null,
    passportId: null,
    customerDetails: {
      type: 'REGULAR',
      data: {
        addressLines: ['123', 'M.G Road', 'Utility Building', 'Shantinagar'],
        pinCode: '560010',
        city: 'Bangalore North',
        state: null,
        country: null,
        zone: null,
        catchmentName: null,
        birthday: null,
        spouseBirthday: null,
        anniversary: null,
        canSendSMS: true,
        altContactNo: null,
        idProof: null,
        idNumber: null,
        isHardCopySubmitted: false
      }
    },
    isActive: true,
    isInstiTaxNoVerified: null,
    iscustTaxNoVerified: null,
    pointBalance: 0.0,
    currentTier: 'Encircle Silver',
    enrollmentDate: moment(1603996200000),
    isMemberBlocked: false,
    isPulseCustomer: false,
    loyaltyDetails: {
      type: 'LOYALTY',
      data: {
        birthday: null,
        birthdayDiscount: 'DNU',
        birthdayValdityPeriod: '',
        spouseBirthday: null,
        spouseBirthdayDiscount: 'DNU',
        spouseBirthdayValidityPeriod: '',
        anniversary: null,
        anniversaryDiscount: 'N',
        anniversaryValidityPeriod: '',
        child1BirthdayDiscount: 'DNU',
        child1BirthdayValidityPeriod: '',
        child2BirthdayDiscount: 'DNU',
        child2BirthdayValidityPeriod: ''
      }
    }
  };

});
