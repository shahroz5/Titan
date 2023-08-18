import {
  CustomErrors,
  ListPayload,
  SortItem,
  FileUploadResponse,
  AirpayVendorSuccessList,
  AirpayVendorList
} from '@poss-web/shared/models';
// import { AirpayHostConfigEntity } from './airpay-configuration.entity';
import { AirpayConfigurationState } from './airpay-configuration.state';
import { initialState } from './airpay-configuration.reducer';
import * as selectors from './airpay-configuration.selectors';

describe('Unipay Access Mapping Selector Testing Suite', () => {
  const formData: FormData = new FormData();
  const uploadResponse: FileUploadResponse = {
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

  const configListingPayload: ListPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const unipayConfigurationList1: AirpayVendorSuccessList = {
    vendorList: [
      {
        newlyAdded: true,
        locationCode: 'test',
        MerchantId: 'test',
        Username: 'test',
        Password: 'test',
        SecretKey: 'test',
        SecretToken: 'test'
      }
    ],
    count: 1
  };
  const accessList1: AirpayVendorList = {
    newlyAdded: true,
    locationCode: 'test',
    MerchantId: 'test',
    Username: 'test',
    Password: 'test',
    SecretKey: 'test',
    SecretToken: 'test'
  };

  const accessList2: AirpayVendorList = {
    newlyAdded: true,
    locationCode: 'test',
    MerchantId: 'test',
    Username: 'test',
    Password: 'test',
    SecretKey: 'test',
    SecretToken: 'test'
  };

  const accessListArray = [accessList1, accessList2];

  describe('Testing Unipay Aceess Mapping Related selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: AirpayConfigurationState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.AirpayConfigurationSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    // it('Should return the error', () => {
    //   const state: AirpayConfigurationState = {
    //     ...initialState,
    //     errorLog: []
    //   };
    //   expect(
    //     selectors.AirpayConfigurationSelectors.selectIsErrorLog.projector(state)
    //   ).toEqual([]);
    // });

    // it('Should return uploadResponse', () => {
    //   const state: AirpayConfigurationState = {
    //     ...initialState,
    //     fileUploadResponse: uploadResponse
    //   };
    //   expect(
    //     selectors.AirpayConfigurationSelectors.selectFileUploadResponse.projector(
    //       state
    //     )
    //   ).toEqual(uploadResponse);
    // });

    it('Should return selectAccessList', () => {
      const state: AirpayConfigurationState = {
        ...initialState,
        vendorList: accessListArray
      };
      expect(
        selectors.AirpayConfigurationSelectors.selectVendorList.projector(state)
      ).toEqual(accessListArray);
    });

    it('Should return selectTotalElements', () => {
      const state: AirpayConfigurationState = {
        ...initialState,
        totalCount: 1
      };
      expect(
        selectors.AirpayConfigurationSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(1);
    });

    it('should return isLoading selector', () => {
      const state: AirpayConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.AirpayConfigurationSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });
});
