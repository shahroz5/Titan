import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  PaymentConfigurationListPayLoad,
  PaymentConfigurationList,
  SavePaymentConfigurationPayload,
  UpdatePaymentConfigurationPayload,
  PaymentConfiguration,
  MappedCount,
  LoadSelectedConfigById,
  SelectedOptionsData,
  UpdatePaymentConfigurationDetailsPayload
} from '@poss-web/shared/models';
import {
  PaymentConfigurationActionTypes,
  LoadPaymentConfigurationList,
  LoadPaymentConfigurationListSuccess,
  LoadPaymentConfigurationListFailure,
  LoadReset,
  SearchPaymentConfigurationListSuccess,
  SearchPaymentConfigurationListFailure,
  SearchPaymentConfigurationList,
  CheckUniquePaymentNameSuccess,
  CheckUniquePaymentNameFailure,
  CheckUniquePaymentName,
  LoadPaymentModesandTransactionTypesSuccess,
  LoadPaymentModesandTransactionTypesFailure,
  LoadPaymentModesandTransactionTypes,
  SavePaymentConfigurationSuccess,
  SavePaymentConfigurationSuccessFailure,
  SavePaymentConfiguration,
  UpdatePaymentConfigurationSuccess,
  UpdatePaymentConfigurationFailure,
  UpdatePaymentConfiguration,
  LoadPaymentConfigurationByConfigIdSuccess,
  LoadPaymentConfigurationByConfigIdFailure,
  LoadPaymentConfigurationByConfigId,
  LoadMappedCount,
  LoadMappedCountSuccess,
  LoadMappedCountFailure,
  UpdateCount,
  LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess,
  LoadSelectedPaymentConfigurationDetailsByConfigIdFailure,
  LoadSelectedPaymentConfigurationDetailsByConfigId,
  UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess,
  UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure,
  UpdateSelectedPaymentConfigurationDetailsByConfigId,
  LoadPaymentModeCountSuccess,
  LoadPaymentModeCountFailure,
  LoadPaymentModeCount,
  LoadTCSPaymentModeSuccess,
  LoadTCSPaymentModeFailure,
  LoadTCSPaymentMode
} from './payment-configuration.actions';

describe('PaymentConfiguration  Action Testing Suite', () => {
  describe('LoadPaymentConfigurationList Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentConfigurationList action ', () => {
      const payload: PaymentConfigurationListPayLoad = {
        pageSize: 10,
        pageIndex: 1
      };

      const action = new LoadPaymentConfigurationList(payload);
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentConfigurationListSuccess action ', () => {
      const payload: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new LoadPaymentConfigurationListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentConfigurationListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentConfigurationListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchPaymentConfigurationList Action Test Cases', () => {
    it('should check correct type is used for  SearchPaymentConfigurationList action ', () => {
      const payload = 'cash';

      const action = new SearchPaymentConfigurationList(payload);
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST,
        payload
      });
    });
    it('should check correct type is used for  SearchPaymentConfigurationListSuccess action ', () => {
      const payload: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new SearchPaymentConfigurationListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchPaymentConfigurationListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPaymentConfigurationListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.SEARCH_PAYMENT_CONFIGURATION_LIST_FAILURE,
        payload
      });
    });
  });

  describe('CheckUniquePaymentName Action Test Cases', () => {
    it('should check correct type is used for  CheckUniquePaymentName action ', () => {
      const payload = 'cash';

      const action = new CheckUniquePaymentName(payload);
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME,
        payload
      });
    });
    it('should check correct type is used for  CheckUniquePaymentNameSuccess action ', () => {
      const payload: PaymentConfigurationList = {
        paymentConfigurationList: [
          {
            paymentName: 'cash',
            configId: '1',
            isActive: true
          }
        ],
        totalElements: 10
      };

      const action = new CheckUniquePaymentNameSuccess(payload);

      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  CheckUniquePaymentNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CheckUniquePaymentNameFailure(payload);

      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.CHECK_UNIQUE_PAYMENT_NAME_FAILURE,
        payload
      });
    });
  });

  describe('LoadPaymentModesandTransactionTypes Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentModesandTransactionTypes action ', () => {
      const payload = '1';

      const action = new LoadPaymentModesandTransactionTypes(payload);
      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentModesandTransactionTypesSuccess action ', () => {
      const payload = {
        transactionTypes: ['CM'],
        paymentModes: ['CASH']
      };

      const action = new LoadPaymentModesandTransactionTypesSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentModesandTransactionTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentModesandTransactionTypesFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES_FAILURE,
        payload
      });
    });
  });

  describe('SavePaymentConfiguration Action Test Cases', () => {
    it('should check correct type is used for  SavePaymentConfiguration action ', () => {
      const payload: SavePaymentConfigurationPayload = {
        paymentConfiguration: {
          description: 'cash'
        },
        saveData: ''
      };

      const action = new SavePaymentConfiguration(payload);
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION,
        payload
      });
    });
    it('should check correct type is used for  SavePaymentConfigurationSuccess action ', () => {
      const payload = '1';
      const action = new SavePaymentConfigurationSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SavePaymentConfigurationSuccessFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SavePaymentConfigurationSuccessFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.SAVE_PAYMENT_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('UpdatePaymentConfiguration Action Test Cases', () => {
    it('should check correct type is used for  UpdatePaymentConfiguration action ', () => {
      const payload: UpdatePaymentConfigurationPayload = {
        configId: '1',
        data: {
          isActive: false
        }
      };

      const action = new UpdatePaymentConfiguration(payload);
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION,
        payload
      });
    });
    it('should check correct type is used for  UpdatePaymentConfigurationSuccess action ', () => {
      const action = new UpdatePaymentConfigurationSuccess();

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION_SUCCESS
      });
    });
    it('should check correct type is used for  UpdatePaymentConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdatePaymentConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.UPADTE_PAYMENT_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('LoadPaymentConfigurationByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentConfigurationByConfigId action ', () => {
      const payload = '1';

      const action = new LoadPaymentConfigurationByConfigId(payload);
      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentConfigurationByConfigIdSuccess action ', () => {
      const payload: PaymentConfiguration = {
        paymentName: 'cash',
        isActive: true,
        configId: '1'
      };
      const action = new LoadPaymentConfigurationByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentConfigurationByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentConfigurationByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadMappedCount Action Test Cases', () => {
    it('should check correct type is used for  LoadMappedCount action ', () => {
      const payload = '1';

      const action = new LoadMappedCount(payload);
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT,
        payload
      });
    });
    it('should check correct type is used for  LoadMappedCountSuccess action ', () => {
      const payload: MappedCount[] = [
        {
          paymentName: 'cash',
          count: 10
        }
      ];
      const action = new LoadMappedCountSuccess(payload);

      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMappedCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMappedCountFailure(payload);

      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_MAPPED_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('UpdateCount Action Test Cases', () => {
    it('should check correct type is used for  UpdateCount action ', () => {
      const payload: { count: number; id: string } = {
        count: 10,
        id: '1'
      };

      const action = new UpdateCount(payload);
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.UPDATE_COUNT,
        payload
      });
    });
  });

  describe('LoadSelectedPaymentConfigurationDetailsByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadSelectedPaymentConfigurationDetailsByConfigId action ', () => {
      const payload: LoadSelectedConfigById = {
        configId: '1',
        paymentName: 'cash'
      };

      const action = new LoadSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess action ', () => {
      const payload: SelectedOptionsData = {
        selectedResponse: [
          {
            id: '1',
            rowHeaderKey: 'cm',
            columnHeaderKey: 'cash',
            configDetails: {}
          }
        ],
        selectedMap: null,
        count: 10,
        id: '1'
      };

      const action = new LoadSelectedPaymentConfigurationDetailsByConfigIdSuccess(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedPaymentConfigurationDetailsByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedPaymentConfigurationDetailsByConfigIdFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateSelectedPaymentConfigurationDetailsByConfigId Action Test Cases', () => {
    it('should check correct type is used for  UpdateSelectedPaymentConfigurationDetailsByConfigId action ', () => {
      const payload: UpdatePaymentConfigurationDetailsPayload = {
        configId: '1',
        data: {
          isActive: true
        }
      };

      const action = new UpdateSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for  UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess action ', () => {
      const action = new UpdateSelectedPaymentConfigurationDetailsByConfigIdSuccess();

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_SUCCESS
      });
    });
    it('should check correct type is used for  UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateSelectedPaymentConfigurationDetailsByConfigIdFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          PaymentConfigurationActionTypes.UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadPaymentModeCount Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentModeCount action ', () => {
      const action = new LoadPaymentModeCount();
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT
      });
    });
    it('should check correct type is used for  LoadPaymentModeCountSuccess action ', () => {
      const payload = 10;
      const action = new LoadPaymentModeCountSuccess(payload);

      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPaymentModeCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentModeCountFailure(payload);

      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_PAYMENT_MODE_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('LoadTCSPaymentMode Action Test Cases', () => {
    it('should check correct type is used for  LoadTCSPaymentMode action ', () => {
      const payload = 'AIRPAY';
      const action = new LoadTCSPaymentMode(payload);
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE,
        payload
      });
    });
    it('should check correct type is used for  LoadTCSPaymentModeSuccess action ', () => {
      const payload = [
        {
          code: 'AIRPAY',
          id: '1',
          checked: true
        }
      ];
      const action = new LoadTCSPaymentModeSuccess(payload);

      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadTCSPaymentModeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTCSPaymentModeFailure(payload);

      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_TCS_PAYMENT_MODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: PaymentConfigurationActionTypes.LOAD_RESET
      });
    });
  });
});
