import {
  CustomErrors,
  AirpayVendorSuccessList,
  ListPayload,
  SortItem,
  HostFileUploadResponse
} from '@poss-web/shared/models';
import {
  AirpayConfigurationActionTypes,
  ResetResponse,
  GetAirpayVendorList,
  GetAirpayVendorListFailure,
  GetAirpayVendorListSuccess
} from './airpay-configuration.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
const formData: FormData = new FormData();
const uploadResponse: HostFileUploadResponse = {
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

const unipayConfigurationList: AirpayVendorSuccessList = {
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

describe('Aipay Host Action Testing Suite', () => {
  describe('GetAirpayVendorList Action Test Cases', () => {
    it('should check correct type is used for  GetAirpayVendorList action ', () => {
      const action = new GetAirpayVendorList(configListingPayload, sortField);

      expect(action.type).toEqual(
        AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST
      );

      expect(action.payload).toEqual(configListingPayload, sortField);
    });

    it('should check correct type is used for GetAirpayVendorListSuccess action ', () => {
      const action = new GetAirpayVendorListSuccess(unipayConfigurationList);

      expect(action.type).toEqual(
        AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST_SUCCESS
      );
      expect(action.payload).toEqual(unipayConfigurationList);
    });
    it('should check correct type is used for GetAirpayVendorListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetAirpayVendorListFailure(payload);

      expect(action.type).toEqual(
        AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetResponse Action Test Cases', () => {
    it('should check correct type is used for  ResetResponse action ', () => {
      const action = new ResetResponse();

      expect(action.type).toEqual(
        AirpayConfigurationActionTypes.RESET_RESPONSE
      );
    });
  });
});
