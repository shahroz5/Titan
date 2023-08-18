import {
  CountrySuccessPayload,
  CourierDetailsListing,
  CourierMaster,
  CustomErrors,
  StatesSuccessPayload
} from '@poss-web/shared/models';
import { CourierDetailsState } from './courier-details.state';
import { initialState } from './courier-details.reducer';
import { CourierDetailsSelectors } from './courier-details.selectors';

describe('CourierDetails Selector Testing Suite', () => {
  const courierDetails: CourierMaster = {
    courierName: 'BLUDE DART',
    address: 'Vijayawada',
    stateName: 'ANDHRA PRADESH',
    townName: 'Machilipatnam',
    description: 'Courier Name is BLUDE DART',
    mailId: 'titan@gmail.com',
    mobileNumber: '9010462817',
    contactPerson: 'admin',
    isActive: true,
    countryCode: 'IND'
  };
  it('Should return the courierDetailsListing ', () => {
    const courierDetailsListing: CourierDetailsListing[] = [
      {
        courierName: 'BLUE DART',
        isActive: true
      }
    ];
    const state: CourierDetailsState = {
      ...initialState,
      courierDetailsListing: courierDetailsListing
    };
    expect(
      CourierDetailsSelectors.selectCourierDetailsListing.projector(state)
    ).toEqual(courierDetailsListing);
  });
  it('Should return the totalCourierDetails ', () => {
    const totalElements = 10;
    const state: CourierDetailsState = {
      ...initialState,
      totalCourierDetails: totalElements
    };
    expect(
      CourierDetailsSelectors.selectTotalCourierDetailsCount.projector(state)
    ).toEqual(totalElements);
  });
  it('Should return the courierdetails based on courier name ', () => {
    const state: CourierDetailsState = {
      ...initialState,
      courierDetails: courierDetails
    };
    expect(
      CourierDetailsSelectors.selectCourierDetailsBasedOnCourierName.projector(
        state
      )
    ).toEqual(courierDetails);
  });
  it('Should return the hassaved', () => {
    const state: CourierDetailsState = {
      ...initialState,
      hasSaved: true
    };
    expect(CourierDetailsSelectors.selectHasSaved.projector(state)).toEqual(
      true
    );
  });
  it('Should return the hasupdated', () => {
    const state: CourierDetailsState = {
      ...initialState,
      hasUpdated: true
    };
    expect(CourierDetailsSelectors.selectHasUpdated.projector(state)).toEqual(
      true
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
    const state: CourierDetailsState = {
      ...initialState,
      error: error
    };
    expect(CourierDetailsSelectors.selectError.projector(state)).toEqual(error);
  });
  it('Should return the hassearched', () => {
    const state: CourierDetailsState = {
      ...initialState,
      hasSearched: true
    };
    expect(CourierDetailsSelectors.selectHasSearched.projector(state)).toEqual(
      true
    );
  });
  it('Should return the isloading', () => {
    const state: CourierDetailsState = {
      ...initialState,
      isLoading: true
    };
    expect(
      CourierDetailsSelectors.selecIsLoadingCourierDetails.projector(state)
    ).toEqual(true);
  });
  it('Should return the states', () => {
    const statePayload: StatesSuccessPayload[] = [
      {
        id: '1',
        stateCode: '1',
        description: 'Andhra Pradesh'
      }
    ];
    const state: CourierDetailsState = {
      ...initialState,
      states: statePayload
    };
    expect(CourierDetailsSelectors.selectStates.projector(state)).toEqual(
      statePayload
    );
  });
  it('Should return the countries', () => {
    const countryPayload: CountrySuccessPayload[] = [
      {
        id: '2',
        name: 'India'
      }
    ];
    const state: CourierDetailsState = {
      ...initialState,
      country: countryPayload
    };
    expect(CourierDetailsSelectors.selectCountry.projector(state)).toEqual(
      countryPayload
    );
  });
  it('Should return the haslocations updated', () => {
    const state: CourierDetailsState = {
      ...initialState,
      hasLocationsUpdated: true
    };
    expect(
      CourierDetailsSelectors.selectHasLocationsUpdated.projector(state)
    ).toEqual(true);
  });
  it('Should return the selectedlocations', () => {
    const selectedLocations = [
      { id: 'PNA', description: 'PNA' },
      { id: 'URB', description: 'URB' }
    ];
    const state: CourierDetailsState = {
      ...initialState,
      selectedLocations: selectedLocations
    };
    expect(
      CourierDetailsSelectors.selectSelectedLocations.projector(state)
    ).toEqual(selectedLocations);
  });
});
