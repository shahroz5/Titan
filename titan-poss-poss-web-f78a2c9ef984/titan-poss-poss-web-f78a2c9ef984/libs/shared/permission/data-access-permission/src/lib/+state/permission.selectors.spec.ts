import {
  CustomErrors,
  ElementLevelPermissionItemModel
} from '@poss-web/shared/models';
import { initialState } from './permission.reducer';
import * as selectors from './permission.selectors';
import { PermissionState } from './permission.state';

describe('ACL Permission Selector Testing Suite', () => {
  it('Testing selectError selector', () => {
    const error: Error = {
      name: 'Name',
      message: 'error message',
      stack: 'stack'
    };
    const customErrors: CustomErrors = {
      code: 'EC2',
      message: 'error occured',
      traceId: 'abcdefghijk',
      timeStamp: '',
      error: error
    };
    const state: PermissionState = {
      ...initialState,
      error: customErrors
    };
    expect(selectors.PermissionSelectors.selectError.projector(state)).toEqual(
      customErrors
    );
  });
  it('Testing selectIsLoading selector', () => {
    const state: PermissionState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.PermissionSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });

  it('Testing fetchURLPermission selector', () => {
    const responsePayload = [
      { url: '/inventory/home', transactionCodes: ['I'] }
    ];
    const state: PermissionState = {
      ...initialState,
      urls: responsePayload
    };
    expect(
      selectors.PermissionSelectors.fetchURLPermission.projector(state)
    ).toEqual(responsePayload);
  });
  it('Testing fetchPermissionforURL selector', () => {
    const elementLevelPermissionItemModelArray: ElementLevelPermissionItemModel[] = [
      {
        url: 'inventory/home',
        transactionCodes: ['I0', 'I1', 'I2', 'I27', 'I42', 'I43', 'I44', 'I45'],
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
    const state: PermissionState = {
      ...initialState,
      elements: elementLevelPermissionItemModelArray
    };
    expect(
      selectors.PermissionSelectors.fetchPermissionforURL.projector(state)
    ).toEqual(elementLevelPermissionItemModelArray);
  });

  it('Testing fetchChildRoutes selector', () => {
    const suggestedUrl = [
      'uam/role-limit/default',
      'uam/role-limit/customize',
      'uam/role-limit-requests'
    ];
    const state: PermissionState = {
      ...initialState,
      allowedRoutes: suggestedUrl
    };
    expect(
      selectors.PermissionSelectors.fetchChildRoutes.projector(state)
    ).toEqual(suggestedUrl);
  });
});
