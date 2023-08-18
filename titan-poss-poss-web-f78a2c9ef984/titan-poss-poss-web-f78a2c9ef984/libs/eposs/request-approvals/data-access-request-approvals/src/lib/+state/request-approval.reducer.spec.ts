import { count } from 'rxjs/operators';
//you should simply assert that you get the right state given the provided inputs.

import * as moment from 'moment';
import { Moment } from 'moment';

import { RequestApprovalsState } from './request-approvals.state';
import * as actions from './request-approvals.actions';
import {
  itemAdapter,
  ibtRequestAdapter,
  ibtRequestItemAdapter
} from './request-approvals.entity';
import { createFeatureSelector } from '@ngrx/store';

export const REQUEST_APPROVALS_FEATURE_KEY = 'requestApprovals';

import {
  initialState,
  RequestApprovalsReducer
} from './request-approval.reducer';
import { CustomErrors, LoadRequestResponse, LoadRequestResponseItems, RequestApprovals } from '@poss-web/shared/models';
import { CountPayload, GetIbtRequestPayload, LoadIbtRequestPayload, SelectedStockPayload } from './request-approvals.actions';

describe('Request Approval reducer Testing Suite', () => {
  const testState = initialState;
  const requestApprovals: RequestApprovals = {
    id: 1234,
    reqDocNo: 7890,
    srcLocationCode: 'ABO',
    destLocationCode: 'URB',
    totalAcceptedQuantity: 10,
    totalAcceptedValue: 5,
    totalAcceptedWeight: 100,
    totalRequestedWeight: 60,
    totalRequestedQuantity: 10,
    totalRequestedValue: 89,
    weightUnit: 'gms',
    createdDate: null,
    currencyCode: 'INR',
    srcDocNo: 456789,
    totalIssuedQuantity: 89,
    status: 'APL_PENDING',
    reqDocDate: moment(),
    requestType: 'BTQ',
    totalIssuedValue: 87.9,
    totalIssuedWeight: 90,
    srcDocDate: moment(),
    otherDetails: {
      type: 'BTQ',
      data: {
        approvedCode: 'RTYUIO',
        approvedBy: 'Sush'
      }
    },
    carrierDetails: {
      type: 'BTQ',
      data: {
        employeeName: 'Hari',
        employeeId: '7889',
        emailId: 'ryi@gmail.com'
      }
    }
  }
  const loadRequestResponse: LoadRequestResponse = {
    count: 6,
    items:
    [
      {
        id: 1234,
        reqDocNo: 7890,
        srcLocationCode: 'ABO',
        destLocationCode: 'URB',
        totalAcceptedQuantity: 10,
        totalAcceptedValue: 5,
        totalAcceptedWeight: 100,
        totalRequestedWeight: 60,
        totalRequestedQuantity: 10,
        totalRequestedValue: 89,
        weightUnit: 'gms',
        createdDate: null,
        currencyCode: 'INR',
        srcDocNo: 456789,
        totalIssuedQuantity: 89,
        status: 'APL_PENDING',
        reqDocDate: moment(),
        requestType: 'BTQ',
        totalIssuedValue: 87.9,
        totalIssuedWeight: 90,
        srcDocDate: moment(),
        otherDetails: {
          type: 'BTQ',
          data: {
            approvedCode: 'RTYUIO',
            approvedBy: 'Sush'
          }
        },
        carrierDetails: {
          type: 'BTQ',
          data: {
            employeeName: 'Hari',
            employeeId: '7889',
            emailId: 'ryi@gmail.com'
          }
        }
      },
      {
        id: 671234,
        reqDocNo: 767890,
        srcLocationCode: 'URB',
        destLocationCode: 'ABO',
        totalAcceptedQuantity: 104,
        totalAcceptedValue: 534,
        totalAcceptedWeight: 100,
        totalRequestedWeight: 60,
        totalRequestedQuantity: 10,
        totalRequestedValue: 89,
        weightUnit: 'gms',
        currencyCode: 'INR',
        createdDate: null,
        srcDocNo: 456789,
        totalIssuedQuantity: 89,
        status: 'APL_PENDING',
        reqDocDate: moment(),
        requestType: 'BTQ',
        totalIssuedValue: 87.9,
        totalIssuedWeight: 90,
        srcDocDate: moment(),
        otherDetails: {
          type: 'BTQ',
          data: {
            approvedCode: 'RTYUIO',
            approvedBy: 'Sush'
          }
        },
        carrierDetails: {
          type: 'BTQ',
          data: {
            employeeName: 'Hari',
            employeeId: '7889',
            emailId: 'ryi@gmail.com'
          }
        }
      }
    ]
  }
  const loadIbtRequestPayload: LoadIbtRequestPayload = {
    requestType: 'ibt',
    pageIndex: 0,
    pageSize: 10
  }
  // const createCourier = (
  //   type: string,
  //   companyName: string,
  //   docketNumber: string,
  //   lockNumber: string,
  //   roadPermitNumber: string,
  //   employeeId: string,
  //   employeeMobileNumber: string,
  //   employeeName: string
  // ): StockReceiveCourierDetails => ({
  //   type,
  //   data: {
  //     companyName,
  //     docketNumber,
  //     lockNumber,
  //     roadPermitNumber,
  //     employeeId,
  //     employeeMobileNumber,
  //     employeeName
  //   }
  // });

  // const createPendingSTN = (
  //   id: number,
  //   currencyCode: string,
  //   courierDetails: StockReceiveCourierDetails,
  //   courierReceivedDate: Moment,
  //   orderType: string,
  //   srcDocNo: number,
  //   srcDocDate: Moment,
  //   srcFiscalYear: number,
  //   srcLocationCode: string,
  //   status: string,
  //   destDocDate: Moment,
  //   destDocNo: number,
  //   destLocationCode: string,
  //   totalAvailableWeight: number,
  //   totalAvailableQuantity: number,
  //   totalAvailableValue: number,
  //   totalMeasuredQuantity: number,
  //   totalMeasuredValue: number,
  //   totalMeasuredWeight: number,
  //   type: string,
  //   weightUnit: string,
  //   srcLocationDescription: string,
  //   destLocationDescription: string,
  //   reasonForDelay?: string,
  //   remarks?: string
  // ): StockReceiveStock => {
  //   return {
  //     id,
  //     currencyCode,
  //     courierDetails,
  //     courierReceivedDate,
  //     orderType,
  //     srcDocNo,
  //     srcDocDate,
  //     srcFiscalYear,
  //     srcLocationCode,
  //     status,
  //     destDocDate,
  //     destDocNo,
  //     destLocationCode,
  //     totalAvailableWeight,
  //     totalAvailableQuantity,
  //     totalAvailableValue,
  //     totalMeasuredQuantity,
  //     totalMeasuredValue,
  //     totalMeasuredWeight,
  //     type,
  //     weightUnit,
  //     srcLocationDescription,
  //     destLocationDescription,
  //     reasonForDelay,
  //     remarks
  //   };
  // };

  // const pendingSTN1 = createPendingSTN(
  //   1, // id:
  //   'INR', //currencyCode:
  //   createCourier(
  //     '',
  //     'companyName',
  //     'docketNumber',
  //     'lockNumber',
  //     'roadPermitNumber',
  //     'employeeId',
  //     'employeeMobileNumber',
  //     'employeeName'
  //   ), //    courierDetails:
  //   moment(), //  courierReceivedDate:
  //   '', // orderType:
  //   123, //srcDocNo:
  //   moment(), //srcDocDate:
  //   2020, //  srcFiscalYear:
  //   'URB', //srcLocationCode:
  //   '', // status:
  //   moment(), //destDocDate:
  //   123, // destDocNo:
  //   'hnr', // destLocationCode:
  //   10.6, //totalAvailableWeight:
  //   2, //totalAvailableQuantity:
  //   10000, //totalAvailableValue:
  //   2, //totalMeasuredQuantity:
  //   10000, //totalMeasuredValue:
  //   10.6, //totalMeasuredWeight:
  //   '', // type:
  //   '', //  weightUnit:
  //   '', // srcLocationDescription:
  //   '', //destLocationDescription:
  //   '', //reasonForDelay?:
  //   '' // remarks?:
  // );

  // const pendingSTN2 = createPendingSTN(
  //   2, // id:
  //   'INR', //currencyCode:
  //   createCourier(
  //     '',
  //     'companyName',
  //     'docketNumber',
  //     'lockNumber',
  //     'roadPermitNumber',
  //     'employeeId',
  //     'employeeMobileNumber',
  //     'employeeName'
  //   ), //    courierDetails:
  //   moment(), //  courierReceivedDate:
  //   '', // orderType:
  //   123, //srcDocNo:
  //   moment(), //srcDocDate:
  //   2020, //  srcFiscalYear:
  //   'URB', //srcLocationCode:
  //   '', // status:
  //   moment(), //destDocDate:
  //   123, // destDocNo:
  //   'hnr', // destLocationCode:
  //   10.6, //totalAvailableWeight:
  //   2, //totalAvailableQuantity:
  //   10000, //totalAvailableValue:
  //   2, //totalMeasuredQuantity:
  //   10000, //totalMeasuredValue:
  //   10.6, //totalMeasuredWeight:
  //   '', // type:
  //   '', //  weightUnit:
  //   '', // srcLocationDescription:
  //   '', //destLocationDescription:
  //   '', //reasonForDelay?:
  //   '' // remarks?:
  // );

  describe('Testing Bin Request Approval Count Functionality ', () => {
    beforeEach(() => {});
    it('Bin Request Approval Count Success should return count', () => {
      const num = 0;
      const action = new actions.LoadBinRequestApprovalsCountSuccess(num);

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.binRequestItemsCount).toBe(0);
    });
  });

  describe('Testing  binRequestApprovalFunctionality ', () => {
    beforeEach(() => {});
    it(' binRequestApproval Success should return  binRequestApproval', () => {
      const binRequestApproval = null;
      const action = new actions.UpdateBinRequestApprovalsSuccess(
        binRequestApproval
      );

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.binRequestApproval).toBe(null);
    });
  });

  describe('Testing UPDATE_IBTREQUESTAPPROVALSITEMS_SUCCESS Functionality ', () => {
    beforeEach(() => {});
    it('UPDATE_IBTREQUESTAPPROVALSITEMS_SUCCESS Success should return   ibtRequestApproval', () => {
      const ibtRequestApproval = null;
      const action = new actions.UpdateIbtRequestApprovalsSuccess(
        ibtRequestApproval
      );

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.ibtRequestApproval).toBe(null);
    });
  });

  describe('Testing UPDLOAD_ItEMS_COUNT_SUCCESSFunctionality ', () => {
    beforeEach(() => {});
    it('LOAD_ItEMS_COUNT_SUCCESS', () => {
      const parametr = {
        psvRequestCount: 0,
        focRequestCount: 0,
        adjRequestCount: 0,
        lossRequestCount: 0,
        loanRequestCount: 0,
        exhRequestCount: 0
      };
      const action = new actions.LoadItemsTotalCountSuccess(parametr);

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.psvRequestItemsCount).toBe(0);
      expect(result.adjRequestItemsCount).toBe(0);
    });
  });
  describe('Testing UPDLOAD_ItEMS_COUNT_SUCCESSFunctionality ', () => {
    beforeEach(() => {});
    it('LOAD_ItEMS_COUNT_SUCCESS', () => {
      const parametr = null;
      const action = new actions.LoadItemsTotalCountFailure(parametr);

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    });
  });
  describe('Testing UPDLOAD_ItEMS_COUNT_SUCCESSFunctionality ', () => {
    beforeEach(() => {});
    it('LOAD_ItEMS_COUNT_SUCCESS', () => {
      const parametr = null;
      const action = new actions.LoadItemsTotalCount();

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.psvRequestItemsCount).toBe(0);
    });
  });

  // describe('Testing CLEAR_ITEM_LIST ', () => {
  //   beforeEach(() => {});
  //   it('LOAD_ItEMS_COUNT_SUCCESS', () => {
  //     const parametr = null;
  //     const action = new actions.ClearItemList();

  //     const result: RequestApprovalsState = RequestApprovalsReducer(
  //       initialState,
  //       action
  //     );

  //     expect(result.ibtRequestApprovalsItem).toBe(null);
  //   });
  // });

  // describe('Testing LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_SUCCESS ', () => {
  //   beforeEach(() => {});
  //   it('LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_SUCCESS', () => {
  //     const parametr = {
  //       count: 0,
  //       items: null
  //     };
  //     const action = new actions.LoadIbtCancelRequestApprovalsItemsSuccess(
  //       parametr
  //     );

  //     const result: RequestApprovalsState = RequestApprovalsReducer(
  //       initialState,
  //       action
  //     );

  //     expect(result.isLoading).toBe(false);
  //     expect(result.ibtRequestApprovalsItemsCount).toBe(0);
  //   });
  // });

  describe('Testing LOAD_BINREQUESTAPPROVALS_COUNT ', () => {
    beforeEach(() => {});
    it('LOAD_BINREQUESTAPPROVALS_COUNT', () => {
      const action = new actions.LoadBinRequestApprovalsCount();

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.binRequestApproval).toBe(null);
    });
  });
  describe('Testing LOAD_BINREQUESTAPPROVALS_COUNT ', () => {
    beforeEach(() => {});
    it('LOAD_BINREQUESTAPPROVALS_COUNT', () => {
      const action = new actions.LoadBinRequestApprovalsCountFailure(null);

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.binRequestApproval).toBe(null);
    });
  });

  describe('Testing LOAD_BINREQUESTAPPROVALS_COUNT ', () => {
    beforeEach(() => {});
    it('LOAD_BINREQUESTAPPROVALS_COUNT', () => {
      const param = {};
      const action = new actions.LoadBinRequestApprovals(param);

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isbinRequestItemsLoading).toBe(true);
    });
  });

  // describe('Testing LOAD_BINREQUESTAPPROVALS_SUCCESS ', () => {
  //   beforeEach(() => {});
  //   it('LOAD_BINREQUESTAPPROVALS_SUCCESS', () => {
  //     const param = {
  //       count: 0,
  //       items: null
  //     };
  //     const action = new actions.LoadBinRequestApprovalsSuccess(param);

  //     const result: RequestApprovalsState = RequestApprovalsReducer(
  //       initialState,
  //       action
  //     );

  //     expect(result.binRequestItemsCount).toBe(0);
  //   });
  // });

  describe('Testing LOAD_BINREQUESTAPPROVALS_SUCCESS ', () => {
    beforeEach(() => {});
    it('LOAD_BINREQUESTAPPROVALS_SUCCESS', () => {
      const param = null;
      const action = new actions.LoadBinRequestApprovalsFailure(param);

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.binRequestItemsCount).toBe(0);
    });
  });

  describe('Testing RESET_BINREQUESTAPPROVALS: ', () => {
    beforeEach(() => {});
    it('LOAD_BINREQUESTAPPROVALS_SUCCESS', () => {
      const param = null;
      const action = new actions.ResetBinRequestApprovals();

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isBinRequestItemsReset).toBe(true);
    });
  });

  describe('Testing RESET_BINREQUESTAPPROVALS_COUNT: ', () => {
    beforeEach(() => {});
    it('RESET_BINREQUESTAPPROVALS_COUNT', () => {
      const param = null;
      const action = new actions.ResetBinRequestApprovals();

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.binRequestItemsCount).toBe(0);
    });
  });

  // describe('Testing RESET_REQUESTAPPROVALSITEMS: ', () => {
  //   beforeEach(() => {});
  //   it('RESET_BINREQUESTAPPROVALS', () => {
  //     const param = null;
  //     const action = new actions.ResetRequestApprovalsItems();

  //     const result: RequestApprovalsState = RequestApprovalsReducer(
  //       initialState,
  //       action
  //     );

  //     expect(result.ibtRequestApprovalsItemsCount).toBe(0);
  //   });
  // });

  describe('Testing LOAD_LOCATION_FAILURE: ', () => {
    beforeEach(() => {});
    it('RESET_BINREQUESTAPPROVALS', () => {
      const param = null;
      const action = new actions.ResetRequestApprovalsItems();

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLocationLoading).toBe(false);
    });
  });

  describe('Testing LOAD_IBT_REQUEST ', () => {
    beforeEach(() => {});
    it('RESET_BINREQUESTAPPROVALS', () => {
      const param = {
        id: 345,
        requestType: 'ibt',
        pageSize: 0,
        pageIndex: 8,
        isSelectedArray: null
      };
      const action = new actions.LoadIbtRequestApprovals(param);

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLocationLoading).toBe(false);
    });
  });

  describe('Testing RESET_BINREQUESTAPPROVALS_COUNT ', () => {
    beforeEach(() => {});
    it('RESET_BINREQUESTAPPROVALS_COUNT', () => {
      const param = {
        id: 345,
        requestType: 'ibt',
        pageSize: 0,
        pageIndex: 8,
        isSelectedArray: null
      };
      const action = new actions.ResetBinRequestApprovalsCount();

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.binRequestItemsCount).toBe(0);
    });
  });

  describe('Testing RESET_ERROR ', () => {
    beforeEach(() => {});
    it('RESET_ERROR', () => {
      const param = {
        id: 345,
        requestType: 'ibt',
        pageSize: 0,
        pageIndex: 8,
        isSelectedArray: null
      };
      const action = new actions.ResetError();

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing RESET_UPDATE ', () => {
    beforeEach(() => {});
    it('RESET_UPDATE', () => {
      const param = {
        id: 345,
        requestType: 'ibt',
        pageSize: 0,
        pageIndex: 8,
        isSelectedArray: null
      };
      const action = new actions.ResetStatus();

      const result: RequestApprovalsState = RequestApprovalsReducer(
        initialState,
        action
      );

      expect(result.isRequestItemsReset).toBe(true);
    });
  });

  it('IBTREQUESTAPPROVALS_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.IbtRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );
    expect(result.isLoading).toBe(false);
    expect(result.hasUpadatingApprovalsFailure).toEqual(customErrorData);
  });

  it('IBTCANCELREQUESTAPPROVALS_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.IbtCancelRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );
    expect(result.isLoading).toBe(false);
    expect(result.hasUpadatingCancelApprovalsFailure).toEqual(customErrorData);
  });

  it('LOAD_STUDDED_PRODUCT_GROUPS_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadStuddedProductGroupsFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('UPDATE_IBTREQUESTAPPROVALSITEMS_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.UpdateIbtRequestApprovalsFailure(
      customErrorData
    );
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpdatingIbtFailure).toEqual(customErrorData);
  });
  it('UPDATE_IBTREQUESTAPPROVALSITEMS_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action1 = new actions.LoadLocationCountFailure(customErrorData);
    const action2 = new actions.LoadIBTRequestApprovalsCountFailure(
      customErrorData
    );
    const action3 = new actions.LoadIbtCancelRequestApprovalsItemsFailure(
      customErrorData
    );
    const action = new actions.LoadIBTCancelRequestApprovalsCountFailure(
      customErrorData
    );
    const result1: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    const result2: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );
    const result3: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
    expect(result1.error).toEqual(customErrorData);
    expect(result2.error).toEqual(customErrorData);
    expect(result3.error).toEqual(customErrorData);
  });

  it('LOAD_LOCATION_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadLocationFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_IBT_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadIbtRequestApprovalsFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('CLEAR_SEARCH_IBT_ITEMS', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadIBtCancellationRequestFailure(
      customErrorData
    );
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_EXH_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadEXHRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_EXH_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadPSVRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_FOC_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadFOCRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_LOAN_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadLOANRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_LOSS_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadLOSSRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_ADJ_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadADJRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_SELECTED_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadSelectedRequestFailure(customErrorData);
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_SELECTED_CANCELLATION_REQUEST_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadSelectedCancelRequestFailure(
      customErrorData
    );
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('LOAD_IBTREQUESTCANCELAPPROVALS_ITEMS_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.LoadIbtCancelRequestApprovalsItemsFailure(
      customErrorData
    );
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toEqual(customErrorData);
  });

  it('.UPDATE_BINREQUESTAPPROVALS_FAILURE', () => {
    const customErrorData: CustomErrors = {
      code: 'C',
      message: 'M',
      traceId: 'T',
      timeStamp: 'TS',
      error: {
        name: 'N',
        message: 'M',
        stack: 'ST'
      }
    };
    const action = new actions.UpdateBinRequestApprovalsFailure(
      customErrorData
    );
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpdatingFailure).toEqual(customErrorData);
  });

  it('LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS', () => {
    const pendingStnData = ['j'];
    const action = new actions.LoadStuddedProductGroupsSuccess(pendingStnData);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.studdedProductGroups).toBe(pendingStnData);
  });

  it('RESET_ADJREQUESTAPPROVALS', () => {
    const pendingStnData = null;
    const action = new actions.ResetADJRequestApprovals();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isadjRequestItemsReset).toBe(true);
  });

  it('RESET_ADJREQUESTAPPROVALS_COUNT', () => {
    const pendingStnData = null;
    const action = new actions.ResetADJRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.adjRequestItemsCount).toBe(0);
  });

  it('RESETLOSSREQUESTAPPROVALS_COUNT', () => {
    const pendingStnData = null;
    const action = new actions.ResetLOSSRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.islossRequestItemsReset).toBe(false);
  });

  it('RESET_LOSSREQUESTAPPROVALS', () => {
    const pendingStnData = null;
    const action = new actions.ResetLOSSRequestApprovals();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.islossRequestItemsCountReset).toBe(false);
  });

  it('RESET_FOCREQUESTAPPROVALS_COUNT', () => {
    const pendingStnData = null;
    const action = new actions.ResetFOCRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isfocRequestItemsCountReset).toBe(true);
  });

  it('RESET_EXHREQUESTAPPROVALS', () => {
    const pendingStnData = null;
    const action = new actions.ResetEXHRequestApprovals();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isexhRequestItemsReset).toBe(true);
  });

  it('RESET_EXHREQUESTAPPROVALS_COUNT', () => {
    const action = new actions.ResetEXHRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isexhRequestItemsCountReset).toBe(true);
  });

  it('UPDATE_BINREQUESTAPPROVALS', () => {
    const params = {
      id: 123,
      binRequestUpdateDto: null
    };
    const action = new actions.UpdateBinRequestApprovals(params);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpdatingFailure).toBe(null);
  });

  it('LOAD_LOCATION_COUNT', () => {
    const action = new actions.LoadLocationCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpdatingFailure).toBe(null);
  });

  it('LOAD_LOCATION_COUNT_SUCCESS', () => {
    const action = new actions.LoadLocationCountSuccess('');

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpdatingFailure).toBe(null);
    expect(result.isLoading).toBe(false);
  })

  it('LOAD_LOCATION', () => {
    const action = new actions.LoadLocation();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpdatingFailure).toBe(null);
    expect(result.isLocationLoading).toBe(true);
  })
  it('LOAD_LOCATION_SUCCESS', () => {
    const payload: Location[] = [];
    const action = new actions.LoadLocationSuccess(payload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpdatingFailure).toBe(null);
    expect(result.isLocationLoading).toBe(false);
  })

  it('RESET_IBTREQUESTAPPROVALS', () => {
    const action = new actions.ResetIBTRequestApprovals();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isIbtRequestItemsReset).toBe(true);
  });

  it('RESET_IBTREQUESTAPPROVALS', () => {
    const action = new actions.ResetIBTRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isIbtRequestItemsCountReset).toBe(true);
  });

  it('IbtCancelRequest', () => {
    const params = {
      id: 334,
      stUpdateDto: null,
      transferType: 'IBT'
    };
    const action = new actions.IBTCancelRequest(params);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpadatingCancelApprovalsFailure).toBe(null);
  });

  it('RESET_IBTREQUESTAPPROVALS', () => {
    const params = null;
    const action = new actions.IbtCancelRequestSuccess(params);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoading).toBe(false);
  });

  it('UPDATE_IBTREQUESTAPPROVALSITEMS', () => {
    const params = {
      id: 123,
      itemId: '4567',
      itemUpdateDto: null
    };
    const action = new actions.UpdateIBTRequestApprovals(params);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.hasUpdatingFailure).toBe(null);
  });

  it('RESETLoan REQUESTAPPROVALS', () => {
    const pendingStnData = null;
    const action = new actions.ResetLOANRequestApprovals();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isloanRequestItemsReset).toBe(true);
  });

  it('IBTREQUESTAPPROVALS_SUCCESS', () => {
    const pendingStnData = null;
    const action = new actions.IbtRequestSuccess(pendingStnData);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.ibtUpdateRequest).toBe(pendingStnData);
  });
  it('IBTREQUESTAPPROVALS', () => {
    const pendingStnData = null;
    const action = new actions.IBTRequest(pendingStnData);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoading).toBe(true);
  });

  it('RESET_LOANREQUESTAPPROVALS_COUNT', () => {
    const pendingStnData = null;
    const action = new actions.ResetLOANRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.loanRequestItemsCount).toBe(0);
  });
  it('RESET_PSVREQUESTAPPROVALS', () => {
    const pendingStnData = null;
    const action = new actions.ResetPSVRequestApprovals();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoading).toBe(false);
  });

  it('RESET_PSVREQUESTAPPROVALS_COUNT', () => {
    const pendingStnData = null;
    const action = new actions.ResetPSVRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.loanRequestItemsCount).toBe(0);
  });
  it('RESET_PSVREQUESTAPPROVALS', () => {
    const pendingStnData = null;
    const action = new actions.ResetFOCRequestApprovals();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoading).toBe(false);
  });

  it('RESET_REQUESTAPPROVALSITEMS_COUNT', () => {
    const action = new actions.ResetRequestApprovalsItemsCount();
    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.ibtRequestApprovalsItemsCount).toBe(0);
    // expect(result.error).toBe(null);
  });

  describe('LoadIbtRequest', () => {
    it('should call LOAD_IBT_REQUEST', () => {
      const action = new actions.LoadIBtRequest(loadIbtRequestPayload);
      const result: RequestApprovalsState = RequestApprovalsReducer(
        testState,
        action
      );
      expect(result.isLoadingIbtRequest).toBe(true);
      expect(result.error).toBe(null);
    })
    it('should call LOAD_IBT_REQUEST_SUCCESS', () => {

      const action = new actions.LoadIBtRequestSuccess(loadRequestResponse);
      const result: RequestApprovalsState = RequestApprovalsReducer(
        testState,
        action
      );
      expect(result.isLoadingIbtRequest).toBe(false);
      expect(result.error).toBe(null);
    })
    it('LOAD_IBT_REQUEST_FAILURE', () => {
      const customErrorData: CustomErrors = {
        code: 'C',
        message: 'M',
        traceId: 'T',
        timeStamp: 'TS',
        error: {
          name: 'N',
          message: 'M',
          stack: 'ST'
        }
      };
      const action = new actions.LoadIBtRequestFailure(
        customErrorData
      );
      const result: RequestApprovalsState = RequestApprovalsReducer(
        testState,
        action
      );

      expect(result.error).toEqual(customErrorData);
    });
  })
  it('LOAD_IBTREQUESTITEMSAPPROVALS_COUNT', () => {
    const payload: CountPayload = {
      requestType: 'IBT',
      id: 6
    }
    const action = new actions.LoadIBTRequestApprovalsItemsCount(payload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toBe(null);
    expect(result.isLoading).toBe(true);
  })
  it('LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_SUCCESS', () => {
    const payload: CountPayload = {
      requestType: 'IBT',
      id: 6
    }
    const action = new actions.LoadIBTRequestApprovalsItemsCountSuccess(payload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toBe(null);
    expect(result.isLoading).toBe(false);
  })
  it('LOAD_IBTREQUESCANCELAPPROVALS_ITEMS', () => {
    const payload: GetIbtRequestPayload = {
      id: 1,
      requestType: 'IBT',
      pageIndex: 0,
      pageSize: 10,
      isSelectedArray: []
    }
    const action = new actions.LoadIbtCancelRequestItemsApprovals(payload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toBe(null);
    expect(result.isibtRequestCancelItemsLoading).toBe(true);
  })
  it('LOAD_IBTREQUESCANCELAPPROVALS_ITEMS', () => {
    const payload: LoadRequestResponseItems = {
      count: 10,
      items: [{
        isSelected: true,
        id: '1',
        itemCode: 'CODE',
        lotNumber: '36',
        mfgDate: moment(1256),
        productCategory: 'CATEGORY CODE',
        productGroup: 'PRODUCT GROUP',
        binCode: 'BIN',
        binGroupCode: 'BIN GROUP',
        stdValue: 67,
        stdWeight: 56,
        currencyCode: "RUPEE",
        weightUnit: 'gms',
        status: '',
        imageURL: 'abcd',
        requestedQuantity: 56,
        acceptedQuantity: 78,
        approvedQuantity: 23,
        availableQuantity: 16,
        inventoryId: '123',
        totalApprovedQuantity: 456,
        totalReceivedQuantity: 456,
        totalReceivedValue: 7890,
        totalReceivedWeight: 34,
        productGroupDesc: '',
        productCategoryDesc: '',
        isStudded: false
      }]
    }
    const action = new actions.LoadIbtCancelRequestApprovalsItemsSuccess(payload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toBe(null);
    expect(result.isibtRequestCancelItemsLoading).toBe(false);
  })
  it('LOAD_IBTREQUESTAPPROVALS_SUCCESS', () => {
    const payload: LoadRequestResponseItems = {
      count: 10,
      items: [{
        isSelected: true,
        id: '1',
        itemCode: 'CODE',
        lotNumber: '36',
        mfgDate: moment(1256),
        productCategory: 'CATEGORY CODE',
        productGroup: 'PRODUCT GROUP',
        binCode: 'BIN',
        binGroupCode: 'BIN GROUP',
        stdValue: 67,
        stdWeight: 56,
        currencyCode: "RUPEE",
        weightUnit: 'gms',
        status: '',
        imageURL: 'abcd',
        requestedQuantity: 56,
        acceptedQuantity: 78,
        approvedQuantity: 23,
        availableQuantity: 16,
        inventoryId: '123',
        totalApprovedQuantity: 456,
        totalReceivedQuantity: 456,
        totalReceivedValue: 7890,
        totalReceivedWeight: 34,
        productGroupDesc: '',
        productCategoryDesc: '',
        isStudded: false
      }]
    }
    const action = new actions.LoadIbtRequestApprovalsSuccess(payload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toBe(null);
    expect(result.isibtRequestItemsLoading).toBe(false)
  })
  it('LOAD_SELECTED_CANCELLATION_REQUEST', () => {
    const payload: SelectedStockPayload = {
      id: 36,
      requestType: 'CANCEL'
    }
    const action = new actions.LoadSelectedCancelRequest(payload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.error).toBe(null);
    expect(result.isLoadingSelectedCancelStock).toBe(true)
  })
  it('LOAD_SELECTED_CANCELLATION_REQUEST', () => {

    const action = new actions.LoadSelectedRequestCancelSuccess(requestApprovals);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoadingSelectedCancelStock).toBe(false)
  })
  it('LOAD_SELECTED_REQUEST', () => {
    const payload: SelectedStockPayload = {
      id: 36,
      requestType: 'CANCEL'
    }
    const action = new actions.LoadSelectedRequest(payload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoadingSelectedStock).toBe(true)
    expect(result.error).toBe(null);
  })
  it('LOAD_SELECTED_REQUEST_SUCCESS', () => {

    const action = new actions.LoadSelectedRequestSuccess(requestApprovals);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoadingSelectedStock).toBe(false)
  })
  it('LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT', () => {

    const action = new actions.LoadIBTCancelRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoading).toBe(true);
    expect(result.error).toBe(null);
    expect(result.hasUpadatingCancelApprovalsFailure).toBe(null);
  })
  it('LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_SUCCESS', () => {

    const action = new actions.LoadIBTCancelRequestApprovalsCountSuccess('');

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(null);
    expect(result.hasUpadatingCancelApprovalsFailure).toBe(null);
  })
  it('LOAD_IBTREQUESTAPPROVALS_COUNT', () => {

    const action = new actions.LoadIBTRequestApprovalsCount();

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoading).toBe(true);
    expect(result.error).toBe(null);
    expect(result.hasUpdatingFailure).toBe(null);
  })
  it('LOAD_IBTREQUESTAPPROVALS_COUNT_SUCCESS', () => {

    const action = new actions.LoadIBTRequestApprovalsCountSuccess('');

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(null);
    expect(result.hasUpdatingFailure).toBe(null);
  })
  it('LOAD_LOSS_REQUEST', () => {

    const action = new actions.LoadLOSSRequest(loadIbtRequestPayload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoadinglossequest).toBe(true);
    expect(result.error).toBe(null);
  })
  it('LOAD_LOSS_REQUEST_SUCCESS', () => {

    const action = new actions.LoadLOSSRequestSuccess(loadRequestResponse);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoadinglossequest).toBe(false);
    expect(result.error).toBe(null);
  })
  it('LOAD_ADJ_REQUEST', () => {

    const action = new actions.LoadADJRequest(loadIbtRequestPayload);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoadingadjRequest).toBe(true);
    expect(result.error).toBe(null);
  })
  it('LOAD_ADJ_REQUEST_SUCCESS', () => {

    const action = new actions.LoadADJRequestSuccess(loadRequestResponse);

    const result: RequestApprovalsState = RequestApprovalsReducer(
      testState,
      action
    );

    expect(result.isLoadingadjRequest).toBe(false);
    expect(result.error).toBe(null);
  })

  // describe('Testing Bin Request Approval  Functionality ', () => {
  //   beforeEach(() => {}:);
  //   it('Bin Request Approval Success should return item', () => {
  //     const binRequest = {
  //       items:[],
  //       count:0
  //     };
  //     const action = new actions.LoadBinRequestApprovalsSuccess(binRequest);

  //     const result: RequestApprovalsState =RequestApprovalsReducer(
  //       initialState,
  //       action
  //     );

  //     expect(result.isbinRequestItemsLoading).toBe(false);
  //     expect(result.binRequestApprovalsItem).toBe(0);

  //   });
  // });
});
