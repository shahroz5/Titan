import {
  ConfigListingPayload,
  CustomErrors,
  SortItem,
  GvStatusList,
  UploadResponse,
  GVStatusListingPayload,
  GVStatusUpdateList,
  GVExtendValidity,
  GVStatusChange
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  GVStatusUpdateEntity,
  gvStatusUpdateAdapter
} from './gv-status-update.entity';
import { GVStatusUpdateState } from './gv-status-update.state';
import { initialState } from './gv-status-update.reducers';
import * as selectors from './gv-status-update.selectors';
import { Moment } from 'moment';

describe('Gv Status Update Selector Testing Suite', () => {
  const formData: FormData = new FormData();
  const uploadResponse: UploadResponse = {
    fileId: 'test123',
    hasError: false,
    message: 'uploaded',
    records: {
      errorLogId: 'abc123',
      failureCount: 0,
      successCount: 1,
      totalCount: 1
    }
  };

  const configListingPayload: ConfigListingPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const gvStatusListingPayload: GVStatusListingPayload = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    serialNo: '123',
    status: 'CLOSED'
  };
  const gvStatusList1: GvStatusList = {
    activationDate: 12,
    denomination: 1,
    excludes: [],
    extendCount: 1,
    giftCode: '',
    giftDetails: {
      customerName: '',
      customerType: '',
      discount: '',
      discountPercentage: '',
      issuedTo: ''
    },
    indentNo: 1,
    locationCode: 123,
    mfgDate: 1,
    newlyAdded: true,
    quantity: 1,
    regionCode: '',
    remarks: '',
    serialNo: 1,
    status: '',
    totalValue: 12,
    validFrom: moment(),
    validTill: moment(),
    validityDays: 1
  };

  const gvStatusList2: GvStatusList = {
    activationDate: 12,
    denomination: 1,
    excludes: [],
    extendCount: 1,
    giftCode: '',
    giftDetails: {
      customerName: '',
      customerType: '',
      discount: '',
      discountPercentage: '',
      issuedTo: ''
    },
    indentNo: 1,
    locationCode: 123,
    mfgDate: 1,
    newlyAdded: true,
    quantity: 1,
    regionCode: '',
    remarks: '',
    serialNo: 2,
    status: '',
    totalValue: 12,
    validFrom: moment(),
    validTill: moment(),
    validityDays: 1
  };
  const gvStatusUpdateList: GVStatusUpdateList = {
    count: 1,
    gvStatusList: [gvStatusList1, gvStatusList2]
  };

  const gvExtendValidity: GVExtendValidity = {
    giftValidity: [{ serialNo: 2, validTill: '' }],
    remarks: ''
  };

  const gvStatusChange: GVStatusChange = {
    giftVoucherStatus: [{ serialNo: 2, status: '' }],
    remarks: ''
  };
  const accessListArray = [gvStatusList1, gvStatusList1];

  const addAccessListToEntities = <T extends GvStatusList>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.serialNo]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const accessElemets: GVStatusUpdateEntity = {
    ids: [gvStatusList1.serialNo, gvStatusList1.serialNo],
    entities: addAccessListToEntities(accessListArray)
  };

  describe('Testing GV Stats Update Mapping Related selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: GVStatusUpdateState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.gvStatusUpdateSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    it('Should return the error', () => {
      const state: GVStatusUpdateState = {
        ...initialState,
        errorLog: []
      };
      expect(
        selectors.gvStatusUpdateSelectors.selectIsErrorLog.projector(state)
      ).toEqual([]);
    });

    it('Should return uploadResponse', () => {
      const state: GVStatusUpdateState = {
        ...initialState,
        fileUploadResponse: uploadResponse
      };
      expect(
        selectors.gvStatusUpdateSelectors.selectFileUploadResponse.projector(
          state
        )
      ).toEqual(uploadResponse);
    });

    it('Should return selectGVStatusUpdateList', () => {
      // const state: GVStatusUpdateState = {
      //   ...initialState,
      //   accessList: accessElemets
      // };
      expect(
        selectors.gvStatusUpdateSelectors.selectGVStatusUpdateList.projector(
          accessElemets
        )
      ).toEqual(accessListArray);
    });

    it('Should return selectTotalElements', () => {
      const state: GVStatusUpdateState = {
        ...initialState,
        totalCount: 1
      };
      expect(
        selectors.gvStatusUpdateSelectors.selectTotalElements.projector(state)
      ).toEqual(1);
    });

    it('should return isLoading selector', () => {
      const state: GVStatusUpdateState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.gvStatusUpdateSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('should return updateResponse selector', () => {
      const state: GVStatusUpdateState = {
        ...initialState,
        updatedList: accessListArray
      };
      expect(
        selectors.gvStatusUpdateSelectors.selectUpdateResponse.projector(state)
      ).toEqual(accessListArray);
    });

    it('should return selectNewList selector', () => {
      const state: GVStatusUpdateState = {
        ...initialState,
        newList: accessListArray
      };
      expect(
        selectors.gvStatusUpdateSelectors.selectNewList.projector(state)
      ).toEqual(accessListArray);
    });
  });
});
