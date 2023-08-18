import {
  CustomErrors,
  FOCBlockingCustomerLevelListResponse
} from '@poss-web/shared/models';
import { FOCBCLSelectors } from './foc-bcl.selectors';
import { FOCBCLState } from './foc-bcl.state';

describe('FOC BLOCKING LOCATION LEVEL Selector Testing Suite', () => {
  const initialState: FOCBCLState = {
    error: null,
    isLoading: false,
    hasSaved: false,
    schemeId: null,
    focBlockingCustomerLevel: null,
    totalElements: 0,
    selectedLocations: null
  };
  const focBlockingCustomerDetails: FOCBlockingCustomerLevelListResponse = {
    response: [
      {
        locationCode: 'URB',
        description: 'URB',
        fromDate: '12312312',
        toDate: '12323213',
        approvedBy: 'CM',
        isCMMandatory: true,
        remarks: 'Good',
        isActive: true,
        mobileNumber: '9010462817',
        id: 'abc123',
        focItemCode: 'abc123',
        quantity: '12'
      }
    ],
    totalElements: 1
  };
  it('Should return the focBlockingDetails', () => {
    const state: FOCBCLState = {
      ...initialState,
      focBlockingCustomerLevel: focBlockingCustomerDetails.response
    };
    expect(FOCBCLSelectors.selectFOCBCLDetails.projector(state)).toEqual(
      focBlockingCustomerDetails.response
    );
  });

  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: FOCBCLState = {
      ...initialState,
      error: error
    };
    expect(FOCBCLSelectors.selectError.projector(state)).toEqual(error);
  });

  it('Should return the schemeId', () => {
    const state: FOCBCLState = {
      ...initialState,
      schemeId: 'abc123'
    };
    expect(FOCBCLSelectors.selectSchemeId.projector(state)).toEqual('abc123');
  });

  it('Should return the isLoading', () => {
    const state: FOCBCLState = {
      ...initialState,
      isLoading: true
    };
    expect(FOCBCLSelectors.selectIsLoading.projector(state)).toEqual(true);
  });

  it('Should return the hassaved', () => {
    const state: FOCBCLState = {
      ...initialState,
      hasSaved: true
    };
    expect(FOCBCLSelectors.selectHasSaved.projector(state)).toEqual(true);
  });

  it('Should return the totalElements', () => {
    const state: FOCBCLState = {
      ...initialState,
      totalElements: focBlockingCustomerDetails.totalElements
    };
    expect(FOCBCLSelectors.selectTotalElements.projector(state)).toEqual(
      focBlockingCustomerDetails.totalElements
    );
  });
});
