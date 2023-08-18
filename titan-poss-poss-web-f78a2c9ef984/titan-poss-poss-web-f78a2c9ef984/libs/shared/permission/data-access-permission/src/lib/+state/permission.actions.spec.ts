import {
  AclUrlPermissionRequestBody,
  CustomErrors,
  ElementLevelPermissionItemModel,
  TransactionCodesModel
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadElementPermissionsForUrl,
  LoadElementPermissionsForUrlFailure,
  LoadElementPermissionsForUrlSuccess,
  LoadUrlPermissions,
  LoadUrlPermissionsFailure,
  LoadUrlPermissionsSuccess,
  LoadUrlSuggestion,
  LoadUrlSuggestionFailure,
  LoadUrlSuggestionSuccess,
  PermissionActionTypes
} from './permission.actions';

describe('ACL Permission Action Testing Suite', () => {
  describe('LoadElementPermissionsForUrl Action Test Cases', () => {
    it('should check correct type is used for LoadElementPermissionsForUrl action ', () => {
      const payload = 'inventory/home';
      const action = new LoadElementPermissionsForUrl(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL,
        payload
      });
    });
    it('should check correct type is used for LoadElementPermissionsForUrlSuccess action ', () => {
      const payload: ElementLevelPermissionItemModel[] = [
        {
          url: 'inventory/home',
          transactionCodes: [
            'I0',
            'I1',
            'I2',
            'I27',
            'I42',
            'I43',
            'I44',
            'I45'
          ],
          element: 'Inventory Home - Stock Receive Request Card',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I0', 'I2', 'I27'],
          element: 'Inventory Home - Stock Receive Request Count L1L2',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I1'],
          element: 'Inventory Home - Stock Receive Request Count L3',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I18',
            'I20',
            'I21',
            'I22',
            'I23',
            'I24',
            'I62',
            'I64',
            'I65',
            'I66',
            'I67',
            'I68'
          ],
          element: 'Inventory Home - Stock Issue Card L1L2',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I39',
            'I22',
            'I23',
            'I24',
            'I63',
            'I66',
            'I67',
            'I68'
          ],
          element: 'Inventory Home - Stock Issue  Card L3',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I18', 'I20', 'I21'],
          element: 'Inventory Home - Stock Issue L1L2 Request Count',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I3',
            'I4',
            'I5',
            'I8',
            'I9',
            'I10',
            'I11',
            'I12',
            'I13',
            'I14',
            'I15',
            'I16',
            'I17',
            'I26',
            'I28',
            'I29',
            'I30',
            'I31',
            'I32',
            'I33',
            'I46',
            'I47',
            'I48',
            'I51',
            'I52',
            'I53',
            'I54',
            'I55',
            'I56',
            'I57',
            'I58',
            'I59',
            'I60',
            'I61',
            'I70'
          ],
          element: 'Inventory Home - In-Stock Management Card',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        }
      ];

      const action = new LoadElementPermissionsForUrlSuccess(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for LoadElementPermissionsForUrlFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadElementPermissionsForUrlFailure(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_ELEMENT_PERMISSIONS_FOR_URL_FAILURE,
        payload
      });
    });
  });

  describe('LoadUrlPermissions Action Test Cases', () => {
    it('should check correct type is used for LoadUrlPermissions action ', () => {
      const payload: AclUrlPermissionRequestBody = {
        urls: ['/inventory/home']
      };

      const action = new LoadUrlPermissions(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_URL_PERMISSIONS,
        payload
      });
    });
    it('should check correct type is used for LoadUrlPermissionsSuccess action ', () => {
      const payload: TransactionCodesModel[] = [
        { url: '/inventory/home', transactionCodes: ['I'] }
      ];
      const action = new LoadUrlPermissionsSuccess(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_URL_PERMISSIONS_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for LoadUrlPermissionsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadUrlPermissionsFailure(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_URL_PERMISSIONS_FAILURE,
        payload
      });
    });
  });

  describe('LoadUrlSuggestion Action Test Cases', () => {
    it('should check correct type is used for LoadUrlSuggestion action ', () => {
      const payload = '/inventory/home';

      const action = new LoadUrlSuggestion(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_URL_SUGGESTION,
        payload
      });
    });
    it('should check correct type is used for LoadUrlSuggestionSuccess action ', () => {
      const payload = ['/inventory/home'];
      const action = new LoadUrlSuggestionSuccess(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_URL_SUGGESTION_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for LoadUrlSuggestionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadUrlSuggestionFailure(payload);
      expect({ ...action }).toEqual({
        type: PermissionActionTypes.LOAD_URL_SUGGESTION_FAILURE,
        payload
      });
    });
  });
});
