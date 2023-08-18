import {
  AclUrlPermissionRequestBody,
  ElementLevelPermissionItemModel,
  TransactionCodesModel
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './permission.actions';
import { initialState, PermissionReducer } from './permission.reducer';
import { PermissionState } from './permission.state';

describe('ACL Permission reducer Testing Suite', () => {
  describe('Testing LoadElementPermissionsForUrl Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_ELEMENT_PERMISSIONS_FOR_URL', () => {
      const payload = 'inventory/home';
      const action = new actions.LoadElementPermissionsForUrl(payload);
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.elements).toEqual([]);
      expect(result.error).toBe(null);
    });
    it('LOAD_ELEMENT_PERMISSIONS_FOR_URL_SUCCESS should return element level permissions for the Url', () => {
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

      const action = new actions.LoadElementPermissionsForUrlSuccess(payload);
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.elements).toBe(action.payload);
    });
    it('LOAD_ELEMENT_PERMISSIONS_FOR_URL_FAILURE should return error', () => {
      const action = new actions.LoadElementPermissionsForUrlFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.elements).toEqual([]);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadUrlPermissions Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_URL_PERMISSIONS', () => {
      const payload: AclUrlPermissionRequestBody = {
        urls: ['/inventory/home']
      };
      const action = new actions.LoadUrlPermissions(payload);
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.urls).toEqual(null);
      expect(result.error).toBe(null);
    });
    it('LOAD_URL_PERMISSIONS_SUCCESS should return Url level permissions for the Url', () => {
      const payload: TransactionCodesModel[] = [
        { url: '/inventory/home', transactionCodes: ['I'] }
      ];

      const action = new actions.LoadUrlPermissionsSuccess(payload);
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.urls).toBe(action.payload);
    });
    it('LOAD_URL_PERMISSIONS_FAILURE should return error', () => {
      const action = new actions.LoadUrlPermissionsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.urls).toEqual([]);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadUrlSuggestion Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_URL_SUGGESTION', () => {
      const payload = '/inventory/home';
      const action = new actions.LoadUrlSuggestion(payload);
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.allowedRoutes).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LOAD_URL_SUGGESTION_SUCCESS should load Url Suggestion from the allowed routes list', () => {
      const payload = ['/inventory/home'];

      const action = new actions.LoadUrlSuggestionSuccess(payload);
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.allowedRoutes).toBe(action.payload);
    });
    it('LOAD_URL_SUGGESTION_FAILURE should return error', () => {
      const action = new actions.LoadUrlSuggestionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: PermissionState = PermissionReducer(initialState, action);
      expect(result.allowedRoutes).toBe(null);
      expect(result.error.message).toEqual('some error');
    });
  });
});
