import {
  OtherDetails,
  CourierDetailsOtherIssue,
  OtherIssueModel,
  OtherIssuesHistoryItem,
  OtherReceiptsIssuesAdvanceFilterPayload,
  OtherIssuesItem,
  ProductCategory,
  ProductGroup,
  CustomErrors,
  OtherIssueTransferType,
  RequestOtherIssueStockTransferNote,
  OtherIssuesCreateStockResponse,
  UnipayConfigurationList,
  SortItem,
  ConfigListingPayload,
  UploadResponse,
  AccessList
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  UnipayAccessMappingEntity,
  unipayAccessMappingAdapter
} from './unipay-access-mapping.entity';
import { UnipayConfigurationState } from './unipay-access-mapping.state';
import { initialState } from './unipay-access-mapping.reducers';
import * as selectors from './unipay-access-mapping.selectors';
import { Moment } from 'moment';

describe('Unipay Access Mapping Selector Testing Suite', () => {
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

  const unipayConfigurationList1: UnipayConfigurationList = {
    accessList: [
      {
        deviceId: '123',
        hostName: 'unipay',
        id: '123',
        isActive: true,
        locationCode: '123',
        newlyAdded: true,
        paymentCode: 'unipay'
      }
    ],
    count: 1
  };
  const accessList1: AccessList = {
    deviceId: '123',
    hostName: 'unipay',
    id: '123',
    isActive: true,
    locationCode: '123',
    newlyAdded: true,
    paymentCode: 'unipay'
  };

  const accessList2: AccessList = {
    deviceId: '456',
    hostName: 'unipay',
    id: '456',
    isActive: true,
    locationCode: '123',
    newlyAdded: true,
    paymentCode: 'unipay'
  };

  const accessListArray = [accessList1, accessList2];

  const addAccessListToEntities = <T extends AccessList>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const accessElemets: UnipayAccessMappingEntity = {
    ids: [accessList1.id, accessList2.id],
    entities: addAccessListToEntities(accessListArray)
  };

  describe('Testing Unipay Aceess Mapping Related selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: UnipayConfigurationState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.unipayConfigurationSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    it('Should return the error', () => {
      const state: UnipayConfigurationState = {
        ...initialState,
        errorLog: []
      };
      expect(
        selectors.unipayConfigurationSelectors.selectIsErrorLog.projector(state)
      ).toEqual([]);
    });

    it('Should return uploadResponse', () => {
      const state: UnipayConfigurationState = {
        ...initialState,
        fileUploadResponse: uploadResponse
      };
      expect(
        selectors.unipayConfigurationSelectors.selectFileUploadResponse.projector(
          state
        )
      ).toEqual(uploadResponse);
    });

    it('Should return selectAccessList', () => {
      // const state: UnipayConfigurationState = {
      //   ...initialState,
      //   accessList: accessElemets
      // };
      expect(
        selectors.unipayConfigurationSelectors.selectAccessList.projector(accessElemets)
      ).toEqual(accessListArray);
    });

    it('Should return selectTotalElements', () => {
      const state: UnipayConfigurationState = {
        ...initialState,
        totalCount: 1
      };
      expect(
        selectors.unipayConfigurationSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(1);
    });

    it('should return isLoading selector', () => {
      const state: UnipayConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.unipayConfigurationSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('should return updateResponse selector', () => {
      const state: UnipayConfigurationState = {
        ...initialState,
        updatedAccessList: 'test'
      };
      expect(
        selectors.unipayConfigurationSelectors.updateResponse.projector(state)
      ).toEqual('test');
    });
  });
});
