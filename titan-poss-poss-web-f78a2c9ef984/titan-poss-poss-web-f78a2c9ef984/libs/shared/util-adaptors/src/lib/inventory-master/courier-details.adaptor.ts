import {
  LoadCourireDetailsListingSuccessPayload,
  CourierMaster,
  CourierDetailsListing,
  CourierSelectedLocations
} from '@poss-web/shared/models';

export class CourierDetailsAdaptor {
  static courierDetailsListing: LoadCourireDetailsListingSuccessPayload;
  static getCourierDetailsListing(
    data: any
  ): LoadCourireDetailsListingSuccessPayload {
    const courierDetailsListing: CourierDetailsListing[] = [];
    for (const listItem of data.results) {
      courierDetailsListing.push({
        courierName: listItem.courierName,
        isActive: listItem.isActive
      });
    }
    this.courierDetailsListing = {
      courierDetailsListing: courierDetailsListing,
      totalElements: data.totalElements
    };
    return this.courierDetailsListing;
  }

  static getCourierDetails(data: any): CourierDetailsListing[] {
    const courirerDetailsBasedOnCourierName: CourierDetailsListing[] = [];
    courirerDetailsBasedOnCourierName.push({
      courierName: data.courierName,
      isActive: data.isActive
    });

    return courirerDetailsBasedOnCourierName;
  }
  static getCourierDetailsBasedOnCourierName(): CourierMaster {
    const courirerDetailsBasedOnCourierName: CourierMaster = {
      courierName: '',
      address: '',
      stateName: '',
      townName: '',
      mailId: '',
      mobileNumber: '',
      contactPerson: '',
      isActive: true,
      description: '',
      countryCode: ''
    };

    return courirerDetailsBasedOnCourierName;
  }
  static getSelectedLocations(data: any): CourierSelectedLocations[] {
    console.log('data', data);
    const selectedLocations: CourierSelectedLocations[] = [];
    for (const locationCodes of data.results) {
      selectedLocations.push({
        id: locationCodes,
        description: locationCodes
      });
    }
    return selectedLocations;
  }
  static getCountry(data: any): { id: string; name: string }[] {
    const countryType: { id: string; name: string }[] = [];
    for (const countryData of data) {
      countryType.push({
        id: countryData.countryCode,
        name: countryData.description
      });
    }
    return countryType;
  }
  static getStates(
    data: any
  ): { id: string; stateCode: string; description: string }[] {
    const stateType: {
      id: string;
      stateCode: string;
      description: string;
    }[] = [];
    for (const states of data) {
      stateType.push({
        id: states.stateId,
        stateCode: states.stateCode,
        description: states.description
      });
    }

    return stateType;
  }
  static getTowns(data: any): { id: string; name: string }[] {
    const townType: {
      id: string;
      name: string;
      state_id: string;
    }[] = [];
    for (const towns of data.results) {
      townType.push({
        id: towns.townId,
        name: towns.description,
        state_id: towns.stateId
      });
    }
    return townType;
  }
}
