import {
  CustomErrors,
  FOCBlockingLocaionLevelListResponse
} from '@poss-web/shared/models';
import { FOCBLLSelectors } from './foc-bll.selectors';
import { FOCBLLState } from './foc-bll.state';

describe('FOC BLOCKING LOCATION LEVEL Selector Testing Suite', () => {
  const initialState: FOCBLLState = {
    error: null,
    isLoading: false,
    hasSaved: false,
    schemeId: null,
    focBlockingDetails: null,
    totalElements: 0,
    selectedLocations: null
  };
  const focBlockingLocationDetails: FOCBlockingLocaionLevelListResponse = {
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
        id: 'abc123'
      }
    ],
    totalElements: 1
  };
  it('Should return the focBlockingDetails', () => {
    const state: FOCBLLState = {
      ...initialState,
      focBlockingDetails: focBlockingLocationDetails.response
    };
    expect(FOCBLLSelectors.selectFOCBlockingDetails.projector(state)).toEqual(
      focBlockingLocationDetails.response
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
    const state: FOCBLLState = {
      ...initialState,
      error: error
    };
    expect(FOCBLLSelectors.selectError.projector(state)).toEqual(error);
  });

  it('Should return the schemeId', () => {
    const state: FOCBLLState = {
      ...initialState,
      schemeId: 'abc123'
    };
    expect(FOCBLLSelectors.selectFOCSchemeId.projector(state)).toEqual(
      'abc123'
    );
  });

  it('Should return the isLoading', () => {
    const state: FOCBLLState = {
      ...initialState,
      isLoading: true
    };
    expect(FOCBLLSelectors.selectIsLoading.projector(state)).toEqual(true);
  });

  it('Should return the hassaved', () => {
    const state: FOCBLLState = {
      ...initialState,
      hasSaved: true
    };
    expect(FOCBLLSelectors.selectHasSaved.projector(state)).toEqual(true);
  });

  it('Should return the totalElements', () => {
    const state: FOCBLLState = {
      ...initialState,
      totalElements: focBlockingLocationDetails.totalElements
    };
    expect(FOCBLLSelectors.selectTotalElements.projector(state)).toEqual(
      focBlockingLocationDetails.totalElements
    );
  });
});
