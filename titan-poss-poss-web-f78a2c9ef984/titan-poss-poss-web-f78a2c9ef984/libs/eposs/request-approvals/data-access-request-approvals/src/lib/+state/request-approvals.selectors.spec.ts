// you will need to assert that the store is calling the right selector function.
import * as selectors from './request-approvals.selectors';
import { initialState } from './request-approval.reducer';
import * as moment from 'moment';

import { RequestApprovalsState } from './request-approvals.state';
import {
  RequestApprovalsActions,
  RequestApprovalsActionTypes
} from './request-approvals.actions';
import {
  itemAdapter,
  ibtRequestAdapter,
  ibtRequestItemAdapter
} from './request-approvals.entity';

import { EntityState } from '@ngrx/entity';

describe('request approval selector Testing Suite', () => {
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
  //   courierReceivedDate: moment.Moment,
  //   orderType: string,
  //   srcDocNo: number,
  //   srcDocDate: moment.Moment,
  //   srcFiscalYear: number,
  //   srcLocationCode: string,
  //   status: string,
  //   destDocDate: moment.Moment,
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

  // const addElementToEntities = <T extends StockReceiveStock>(
  //   payload: T[]
  // ): { [id: string]: T } => {
  //   const reducedEntities = payload.reduce(
  //     (entities: { [id: string]: T }, element: T) => {
  //       return {
  //         ...entities,
  //         [element.id]: element
  //       };
  //     },
  //     {}
  //   );

  //   return reducedEntities;
  // };

  // const pendingSTNSArray = [pendingSTN1, pendingSTN2];

  const countState = 0;

  describe('Testing Bin request count  related Selectors', () => {
    it('Should return the selected bin request items', () => {
      const count = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        binRequestItemsCount: countState
      };
      expect(
        selectors.RequestApprovalsSelectors.selectBinRequestItemsCount.projector(
          state
        )
      ).toEqual(count);
    });
  });

  describe('Testing ERROR related Selectors', () => {
    it('Should return the selected error', () => {
      const error = null;

      const state: RequestApprovalsState = {
        ...initialState,
        error: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectError.projector(state)
      ).toEqual(error);
    });
  });

  describe('Testing ERROR related Selectors', () => {
    it('Should return the selected isloading', () => {
      const isLoading = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoading: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsLoading.projector(state)
      ).toEqual(isLoading);
    });
  });
  describe('Testing ibt request count related Selectors', () => {
    it('Should return the selected ibt count', () => {
      const ibtRequestItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtRequestItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIbtRequestApprovalItemsCount.projector(
          state
        )
      ).toEqual(ibtRequestItemsCount);
    });
  });
  describe('Testing selectfocRequestCount related Selectors', () => {
    it('Should return the selected ibt count', () => {
      const focRequestItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        focRequestItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectfocRequestCount.projector(
          state
        )
      ).toEqual(focRequestItemsCount);
    });
  });
  describe('Testing selectpsvRequestCount related Selectors', () => {
    it('Should return the selected psv count', () => {
      const psvRequestItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        psvRequestItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectpsvRequestCount.projector(
          state
        )
      ).toEqual(psvRequestItemsCount);
    });
  });

  describe('Testing selectfexhRequestCount related Selectors', () => {
    it('Should return the selected exh count', () => {
      const exhRequestItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        exhRequestItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectexhRequestCount.projector(
          state
        )
      ).toEqual(exhRequestItemsCount);
    });
  });

  describe('Testing selectfibt cancel Count related Selectors', () => {
    it('Should return the selected ibtcancel coount', () => {
      const ibtCancelRequestItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtCancelRequestItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectCancelRequestCount.projector(
          state
        )
      ).toEqual(ibtCancelRequestItemsCount);
    });
  });

  describe('Testing selectfibt cancel Count related Selectors', () => {
    it('Should return the selected ibtcancel coount', () => {
      const lossRequestItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        lossRequestItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectlossRequestItemsCount.projector(
          state
        )
      ).toEqual(lossRequestItemsCount);
    });
  });

  describe('Testing select loan Count related Selectors', () => {
    it('Should return the selected loan', () => {
      const loanRequestItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        loanRequestItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectloanRequestCount.projector(
          state
        )
      ).toEqual(loanRequestItemsCount);
    });
  });

  describe('Testing selectfibt cancel Count related Selectors', () => {
    it('Should return the selected ibtcancel coount', () => {
      const adjRequestItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        adjRequestItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectadjRequestCount.projector(
          state
        )
      ).toEqual(adjRequestItemsCount);
    });
  });

  describe('Testing selectfibt cancel Count related Selectors', () => {
    it('Should return the selected selectIbtRequestItemsCount ', () => {
      const ibtRequestApprovalsItemsCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtRequestApprovalsItemsCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIbtRequestItemsCount.projector(
          state
        )
      ).toEqual(ibtRequestApprovalsItemsCount);
    });
  });

  describe('Testing selectfibt cancel Count related Selectors', () => {
    it('Should return the selected locationCount', () => {
      const locationCount = 0;

      const state: RequestApprovalsState = {
        ...initialState,
        locationCount: 0
      };
      expect(
        selectors.RequestApprovalsSelectors.selectLocationCount.projector(state)
      ).toEqual(locationCount);
    });
  });

  describe('Testing selectIsBinRequestItemsResetrelated Selectors', () => {
    it('Should return the selectIsBinRequestItemsReset', () => {
      const isBinRequestItemsReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isBinRequestItemsReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsBinRequestItemsReset.projector(
          state
        )
      ).toEqual(isBinRequestItemsReset);
    });
  });

  describe('Testing selectIsBinRequestItemsCountReset related Selectors', () => {
    it('Should return the selectIsBinRequestItemsCountReset', () => {
      const isBinRequestItemsCountReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isBinRequestItemsCountReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsBinRequestItemsCountReset.projector(
          state
        )
      ).toEqual(isBinRequestItemsCountReset);
    });
  });

  describe('Testing selectIsBinRequestItemsCountReset related Selectors', () => {
    it('Should return the selectIsIbtRequestItemsReset ', () => {
      const isIbtRequestItemsReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isIbtRequestItemsReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsIbtRequestItemsReset.projector(
          state
        )
      ).toEqual(isIbtRequestItemsReset);
    });
  });

  describe('Testing selectIsFocRequestItemsReset related Selectors', () => {
    it('Should return the  selectIsFocRequestItemsReset ', () => {
      const isfocRequestItemsReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isfocRequestItemsReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsFocRequestItemsReset.projector(
          state
        )
      ).toEqual(isfocRequestItemsReset);
    });
  });

  describe('Testing selectIsFocRequestItemsCountReset related Selectors', () => {
    it('Should return the selectIsFocRequestItemsCountReset', () => {
      const isfocRequestItemsCountReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isfocRequestItemsCountReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsFocRequestItemsCountReset.projector(
          state
        )
      ).toEqual(isfocRequestItemsCountReset);
    });
  });

  describe('Testing selectIsPsvRequestItemsReset related Selectors', () => {
    it('Should return the selectIsPsvRequestItemsReset', () => {
      const ispsvRequestItemsReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        ispsvRequestItemsReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsPsvRequestItemsReset.projector(
          state
        )
      ).toEqual(ispsvRequestItemsReset);
    });
  });

  describe('Testing selectIslossRequestItemsReset related Selectors', () => {
    it('Should return the selectIslossRequestItemsReset', () => {
      const islossRequestItemsReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        islossRequestItemsReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIslossRequestItemsReset.projector(
          state
        )
      ).toEqual(islossRequestItemsReset);
    });
  });

  describe('Testing selectIsloanRequestItemsReset  related Selectors', () => {
    it('Should return the selectIsloanRequestItemsReset ', () => {
      const isloanRequestItemsReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isloanRequestItemsReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsloanRequestItemsReset.projector(
          state
        )
      ).toEqual(isloanRequestItemsReset);
    });
  });

  describe('Testing  selectIsadjRequestItemsCountReset related Selectors', () => {
    it('Should return the  selectIsadjRequestItemsCountReset', () => {
      const isadjRequestItemsCountReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isadjRequestItemsCountReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsadjRequestItemsCountReset.projector(
          state
        )
      ).toEqual(isadjRequestItemsCountReset);
    });
  });

  describe('Testing selectIsadjRequestItemsReset related Selectors', () => {
    it('Should return theselectIsadjRequestItemsReset ', () => {
      const isadjRequestItemsReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isadjRequestItemsReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsadjRequestItemsReset.projector(
          state
        )
      ).toEqual(isadjRequestItemsReset);
    });
  });

  describe('Testing selectIsloanRequestItemsCountReset  related Selectors', () => {
    it('Should return the selectIsloanRequestItemsCountReset ', () => {
      const isloanRequestItemsCountReset = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isloanRequestItemsCountReset: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsloanRequestItemsCountReset.projector(
          state
        )
      ).toEqual(isloanRequestItemsCountReset);
    });
  });

  describe('Testing  selectIsexhRequestItemsReset  related Selectors', () => {
    it('Should return the  isbinRequestItemsLoading ', () => {
      const isbinRequestItemsLoading = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isbinRequestItemsLoading: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsbinRequestItemsLoading.projector(
          state
        )
      ).toEqual(isbinRequestItemsLoading);
    });
  });

  describe('Testing  selectIsIbtRequestItemsLoading    related Selectors', () => {
    it('Should return the selectIsIbtRequestItemsLoading  ', () => {
      const isibtRequestItemsLoading = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isibtRequestItemsLoading: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsIbtRequestItemsLoading.projector(
          state
        )
      ).toEqual(isibtRequestItemsLoading);
    });
  });

  describe('Testing selectIsLocationLoading  related Selectors', () => {
    it('Should return the selectIsLocationLoading ', () => {
      const isLocationLoading = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLocationLoading: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsLocationLoading.projector(
          state
        )
      ).toEqual(isLocationLoading);
    });
  });

  describe('Testing selectIsIbtLoading  related Selectors', () => {
    it('Should return the selectIsIbtLoading', () => {
      const isLoadingIbtRequest = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadingIbtRequest: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsIbtLoading.projector(state)
      ).toEqual(isLoadingIbtRequest);
    });
  });

  describe('Testing selectIsIbtCancellationLoading  related Selectors', () => {
    it('Should return the selectIsIbtCancellationLoading', () => {
      const isLoadingIbtCancellationRequest = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadingIbtCancellationRequest: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsIbtCancellationLoading.projector(
          state
        )
      ).toEqual(isLoadingIbtCancellationRequest);
    });
  });

  describe('Testing selectIsExhLoading  related Selectors', () => {
    it('Should return the selectIsExhLoading', () => {
      const isLoadingexhRequest = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadingexhRequest: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsExhLoading.projector(state)
      ).toEqual(isLoadingexhRequest);
    });
  });

  describe('Testing  selectIsadjLoading  related Selectors', () => {
    it('Should return the  selectIsadjLoading ', () => {
      const isLoadingadjRequest = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadingadjRequest: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsadjLoading.projector(state)
      ).toEqual(isLoadingadjRequest);
    });
  });

  describe('Testing  selectIsadjLoading  related Selectors', () => {
    it('Should return the  selectisLoadinglossequest ', () => {
      const isLoadinglossequest = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadinglossequest: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsadjLoading.projector(state)
      ).toEqual(isLoadinglossequest);
    });
  });

  describe('Testing  selectisLoadingloanRequest related Selectors', () => {
    it('Should return the  selectisLoadingloanRequest ', () => {
      const isLoadingloanRequest = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadingloanRequest: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsloanLoading.projector(state)
      ).toEqual(isLoadingloanRequest);
    });
  });

  describe('Testing  selectIspsvLoading related Selectors', () => {
    it('Should return the  selectIspsvLoading ', () => {
      const isLoadingpsvRequest = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadingpsvRequest: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIspsvLoading.projector(state)
      ).toEqual(isLoadingpsvRequest);
    });
  });

  describe('Testing   selectIsfocLoading related Selectors', () => {
    it('Should return the   selectIsfocLoading ', () => {
      const isLoadingfocRequest = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadingfocRequest: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsfocLoading.projector(state)
      ).toEqual(isLoadingfocRequest);
    });
  });

  describe('Testing    selectLocation related Selectors', () => {
    it('Should return the   selectLocation ', () => {
      const location = null;

      const state: RequestApprovalsState = {
        ...initialState,
        location: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectLocation.projector(state)
      ).toEqual(location);
    });
  });

  describe('Testing   selectHasUpdatingFailure related Selectors', () => {
    it('Should return the   selectHasUpdatingFailure ', () => {
      const hasUpdatingFailure = null;

      const state: RequestApprovalsState = {
        ...initialState,
        hasUpdatingFailure: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectHasUpdatingFailure.projector(
          state
        )
      ).toEqual(hasUpdatingFailure);
    });
  });

  describe('Testing  isUpdatingItemSuccess related Selectors', () => {
    it('Should return the   isUpdatingItemSuccess', () => {
      const isUpdatingItemSuccess = false;

      const state: RequestApprovalsState = {
        ...initialState,
        isUpdatingItemSuccess: false
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsUpdatingItem.projector(
          state
        )
      ).toEqual(isUpdatingItemSuccess);
    });
  });

  describe('Testing    updateItemSuccess related Selectors', () => {
    it('Should return the    updateItemSuccess ', () => {
      const binRequestApproval = {
        binName: 'abc',
        id: 123,
        reqLocationCode: 'abc',
        reqDocDate: null,
        reqDocNo: 123,
        status: 'abc',
        requestedRemarks: 'abc',
        binGroupCode: 'abc'
      };

      const state: RequestApprovalsState = {
        ...initialState,
        binRequestApproval: {
          binName: 'abc',
          id: 123,
          reqLocationCode: 'abc',
          reqDocDate: null,
          reqDocNo: 123,
          status: 'abc',
          requestedRemarks: 'abc',
          binGroupCode: 'abc'
        }
      };
      expect(
        selectors.RequestApprovalsSelectors.updateItemSuccess.projector(state)
      ).toEqual(binRequestApproval);
    });
  });

  describe('Testing    selectHasUpdatingIbtFailure  related Selectors', () => {
    it('Should return the   selectHasUpdatingIbtFailure  ', () => {
      const hasUpdatingIbtFailure = null;

      const state: RequestApprovalsState = {
        ...initialState,
        hasUpdatingIbtFailure: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectHasUpdatingIbtFailure.projector(
          state
        )
      ).toEqual(hasUpdatingIbtFailure);
    });
  });

  describe('Testing   isUpdatingIbtSuccess related Selectors', () => {
    it('Should return the    isUpdatingIbtSuccess ', () => {
      const isUpdatingIbtSuccess = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isUpdatingIbtSuccess: null
      };
      expect(
        selectors.RequestApprovalsSelectors.updateItemSuccess.projector(state)
      ).toEqual(isUpdatingIbtSuccess);
    });
  });

  describe('Testing  updateIbtSuccess  related Selectors', () => {
    it('Should return the    isUpdatingIbtSuccess ', () => {
      const isUpdatingIbtSuccess = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isUpdatingIbtSuccess: null
      };
      expect(
        selectors.RequestApprovalsSelectors.updateItemSuccess.projector(state)
      ).toEqual(isUpdatingIbtSuccess);
    });
  });

  describe('Testing  ibtRequest  related Selectors', () => {
    it('Should return the   ibtRequest', () => {
      const ibtRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.ibtRequest.projector(state)
      ).toEqual(ibtRequest);
    });
  });

  describe('Testing  ibtRequest  related Selectors', () => {
    it('Should return the   ibtRequest', () => {
      const ibtRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.ibtRequest.projector(state)
      ).toEqual(ibtRequest);
    });
  });

  describe('Testing  isibtRequestCancelItemsLoading related Selectors', () => {
    it('Should return the   ibtRequest', () => {
      const isibtRequestCancelItemsLoading = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isibtRequestCancelItemsLoading: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsIbtCancelItemsLoading.projector(
          state
        )
      ).toEqual(isibtRequestCancelItemsLoading);
    });
  });

  describe('Testing  ibtRequestApprovalsItemsCount related Selectors', () => {
    it('Should return the  ibtRequestApprovalsItemsCount', () => {
      const ibtRequestApprovalsItemsCount = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtRequestApprovalsItemsCount: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIbtCancelItemCount.projector(
          state
        )
      ).toEqual(ibtRequestApprovalsItemsCount);
    });
  });

  describe('Testing selecthasUpadatingCancelApprovalsFailure related Selectors', () => {
    it('Should return the  ibtRequestApprovalsItemsCount', () => {
      const hasUpadatingCancelApprovalsFailure = null;

      const state: RequestApprovalsState = {
        ...initialState,
        hasUpadatingCancelApprovalsFailure: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selecthasUpadatingCancelApprovalsFailure.projector(
          state
        )
      ).toEqual(hasUpadatingCancelApprovalsFailure);
    });
  });

  describe('Testing selecthasUpadatingCancelApprovalsFailure related Selectors', () => {
    it('Should return the  ibtRequestApprovalsItemsCount', () => {
      const isCancelUpdatingSuccess = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isCancelUpdatingSuccess: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectisCancelUpdatingSuccess.projector(
          state
        )
      ).toEqual(isCancelUpdatingSuccess);
    });
  });

  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const ibtCancelUpdateRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtCancelUpdateRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectibtCancelUpdateRequest.projector(
          state
        )
      ).toEqual(ibtCancelUpdateRequest);
    });
  });

  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const isIbtRequestItemsCountReset = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isIbtRequestItemsCountReset: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsIbtRequestItemsCountReset.projector(
          state
        )
      ).toEqual(isIbtRequestItemsCountReset);
    });
  });

  describe('Testing selectIsPsvRequestItemsCountReset related Selectors', () => {
    it('Should return the  selectIsPsvRequestItemsCountReset', () => {
      const ispsvRequestItemsCountReset = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ispsvRequestItemsCountReset: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsPsvRequestItemsCountReset.projector(
          state
        )
      ).toEqual(ispsvRequestItemsCountReset);
    });
  });

  describe('Testing  islossRequestItemsCountResetrelated Selectors', () => {
    it('Should return the islossRequestItemsCountReset', () => {
      const islossRequestItemsCountReset = null;

      const state: RequestApprovalsState = {
        ...initialState,
        islossRequestItemsCountReset: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIslossRequestItemsCountReset.projector(
          state
        )
      ).toEqual(islossRequestItemsCountReset);
    });
  });
  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const isexhRequestItemsReset = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isexhRequestItemsReset: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsexhRequestItemsReset.projector(
          state
        )
      ).toEqual(isexhRequestItemsReset);
    });
  });
  describe('TestingisexhRequestItemsCountReset related Selectors', () => {
    it('Should return the isexhRequestItemsCountReset', () => {
      const isexhRequestItemsCountReset = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isexhRequestItemsCountReset: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsexhRequestItemsCountReset.projector(
          state
        )
      ).toEqual(isexhRequestItemsCountReset);
    });
  });
  describe('Testing binRequestApprovalsItemsrelated Selectors', () => {
    it('Should return the  binRequestApprovalsItems', () => {
      const binRequestApprovalsItem = null;

      const state: RequestApprovalsState = {
        ...initialState,
        binRequestApprovalsItem: null
      };
      expect(
        selectors.RequestApprovalsSelectors.binRequestApprovalsItems.projector(
          state
        )
      ).toEqual(binRequestApprovalsItem);
    });
  });
  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const isLoadinglossequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isLoadinglossequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIslossLoading.projector(state)
      ).toEqual(isLoadinglossequest);
    });
  });
  describe('Testing isUpdatingIbtSuccess related Selectors', () => {
    it('Should return the isUpdatingIbtSuccess', () => {
      const isUpdatingIbtSuccess = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isUpdatingIbtSuccess: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsUpdatingIbt.projector(state)
      ).toEqual(isUpdatingIbtSuccess);
    });
  });
  describe('Testing IbtApprovalsSuccess  related Selectors', () => {
    it('Should return the  IbtApprovalsSuccess ', () => {
      const ibtUpdateRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtUpdateRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.IbtApprovalsSuccess.projector(state)
      ).toEqual(ibtUpdateRequest);
    });
  });
  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const hasUpadatingApprovalsFailure = null;

      const state: RequestApprovalsState = {
        ...initialState,
        hasUpadatingApprovalsFailure: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectHasUpdatingApprovalsFailure.projector(
          state
        )
      ).toEqual(hasUpadatingApprovalsFailure);
    });
  });
  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const isUpdatingSuccess = null;

      const state: RequestApprovalsState = {
        ...initialState,
        isUpdatingSuccess: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectIsUpdatingSuccess.projector(
          state
        )
      ).toEqual(isUpdatingSuccess);
    });
  });
  describe('Testing ibtCancellationRequests related Selectors', () => {
    it('Should return the   updateIbtSuccess', () => {
      const ibtCancellationRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtCancellationRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.ibtCancellationRequest.projector(
          state
        )
      ).toEqual(ibtCancellationRequest);
    });
  });
  describe('Testing i updateIbtSuccess related Selectors', () => {
    it('Should return the   updateIbtSuccess', () => {
      const ibtRequestApproval = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtRequestApproval: null
      };
      expect(
        selectors.RequestApprovalsSelectors.updateIbtSuccess.projector(state)
      ).toEqual(ibtRequestApproval);
    });
  });
  describe('Testing adjRequest related Selectors', () => {
    it('Should return the adjRequest', () => {
      const adjRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        adjRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.adjRequest.projector(state)
      ).toEqual(adjRequest);
    });
  });
  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const psvRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        psvRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.psvRequest.projector(state)
      ).toEqual(psvRequest);
    });
  });
  describe('Testing lossRequest related Selectors', () => {
    it('Should return the  lossRequest', () => {
      const lossRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        lossRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.lossRequest.projector(state)
      ).toEqual(lossRequest);
    });
  });
  describe('Testing loanRequestrelated Selectors', () => {
    it('Should return the loanRequest', () => {
      const loanRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        loanRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.loanRequest.projector(state)
      ).toEqual(loanRequest);
    });
  });
  // describe('Testing exhRequest related Selectors', () => {
  //   it('Should return the  exhRequest', () => {
  //     const exhRequest = null;

  //     const state: RequestApprovalsState = {
  //       ...initialState,
  //       exhRequest: null
  //     };
  //     expect(
  //       selectors.RequestApprovalsSelectors.selectexhRequest.projector(state)
  //     ).toEqual(exhRequest);
  //   });
  // });
  describe('Testing ifocRequest related Selectors', () => {
    it('Should return the  focRequest', () => {
      const focRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        focRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.focRequest.projector(state)
      ).toEqual(focRequest);
    });
  });
  describe('Testing ibtRequestApprovalsItem related Selectors', () => {
    it('Should return the  ibtRequestApprovalsItem', () => {
      const ibtRequestApprovalsItem = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtRequestApprovalsItem: null
      };
      expect(
        selectors.RequestApprovalsSelectors.ibtRequestApprovalsItems.projector(
          state
        )
      ).toEqual(ibtRequestApprovalsItem);
    });
  });
  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const ibtCancelItems = null;

      const state: RequestApprovalsState = {
        ...initialState,
        ibtCancelItems: null
      };
      expect(
        selectors.RequestApprovalsSelectors.ibtCancelItems.projector(state)
      ).toEqual(ibtCancelItems);
    });
  });
  describe('Testing ibtCancelUpdateRequest related Selectors', () => {
    it('Should return the  ibtCancelUpdateRequest', () => {
      const selectedRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        selectedRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectSelectedRequest.projector(
          state
        )
      ).toEqual(selectedRequest);
    });
  });
  describe('Testing selectedCancelRequest related Selectors', () => {
    it('Should return the selectedCancelRequest', () => {
      const selectedCancelRequest = null;

      const state: RequestApprovalsState = {
        ...initialState,
        selectedCancelRequest: null
      };
      expect(
        selectors.RequestApprovalsSelectors.selectSelectedCancelRequest.projector(
          state
        )
      ).toEqual(selectedCancelRequest);
    });
  });
});
