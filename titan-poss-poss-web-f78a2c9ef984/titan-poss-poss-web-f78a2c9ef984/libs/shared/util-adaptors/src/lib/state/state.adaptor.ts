import {
  StateData,
  LoadStatesDetailsListingSuccessPayload,
  LoadCountryDetailsListingSuccessPayload,
  CountriesDetails,
  LoadTaxClassListingSuccessPayload,
  LoadStateTaxClassListing,
  LoadStateTaxDetailsListing,
  Lov
} from '@poss-web/shared/models';
export class StateAdaptor {
  static stateDetailsListing: LoadStatesDetailsListingSuccessPayload;
  static countryDetailsListing: LoadCountryDetailsListingSuccessPayload;
  static taxClassListing: LoadTaxClassListingSuccessPayload;
  static stateTaxDetails: LoadStateTaxDetailsListing;

  static getStateDetailsListing(
    data: any
  ): LoadStatesDetailsListingSuccessPayload {
    const stateListing: StateData[] = [];
    for (const listItem of data.results) {
      stateListing.push({
        stateId: listItem.stateId,
        configDetails: listItem.configDetails,
        countryCode: listItem.countryCode,
        description: listItem.description,
        isActive: listItem.isActive,
        stateCode: listItem.stateCode,
        isUnionTerritory: listItem.isUnionTerritory,
        eghsRefStateId: listItem.eghsRefStateId
      });
    }
    this.stateDetailsListing = {
      stateDetailsListing: stateListing,
      totalElements: data.totalElements
    };

    return this.stateDetailsListing;
  }

  static getCountryDetailsListing(
    data: any
  ): LoadCountryDetailsListingSuccessPayload {
    const countryListing: CountriesDetails[] = [];
    for (const listItem of data.results) {
      countryListing.push({
        countryCode: listItem.countryCode,
        description: listItem.description
      });
    }
    this.countryDetailsListing = {
      countryDetailsListing: countryListing,
      totalElements: data.totalElements
    };
    return this.countryDetailsListing;
  }

  static getStateTaxDetails(data: any): LoadStateTaxDetailsListing {
    const stateTaxDetails: LoadStateTaxClassListing[] = [];
    for (const listItem of data.results) {
      stateTaxDetails.push({
        isActive: listItem.isActive,
        taxClassCode: listItem.taxClassCode,
        taxDetails: listItem.taxDetails
      });
    }
    this.stateTaxDetails = {
      stateTaxDetails: stateTaxDetails,
      totalElements: data.totalElements
    };
    return this.stateTaxDetails;
  }

  static getSearchDetailsListing(
    data: any
  ): LoadStatesDetailsListingSuccessPayload {
    let searchList: LoadStatesDetailsListingSuccessPayload;
    const stateSearchListing: StateData[] = [];

    for (data of data.results) {
      stateSearchListing.push({
        stateId: data.stateId,
        configDetails: data.configDetails,
        countryCode: data.countryCode,
        description: data.description,
        isActive: data.isActive,
        stateCode: data.stateCode,
        isUnionTerritory: data.isUnionTerritory,
        eghsRefStateId: data.eghsRefStateId
      });
    }

    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    searchList = {
      stateDetailsListing: stateSearchListing,
      totalElements: totalElements
    };
    return searchList;
  }

  static getTaxSystem(data: Lov[]): string[] {
    const taxSystemListing: string[] = [];
    for (const listItem of data) {
      if (listItem.code == 'GST' && listItem.isActive)
        taxSystemListing.push(listItem.code);
    }

    return taxSystemListing;
  }
}
