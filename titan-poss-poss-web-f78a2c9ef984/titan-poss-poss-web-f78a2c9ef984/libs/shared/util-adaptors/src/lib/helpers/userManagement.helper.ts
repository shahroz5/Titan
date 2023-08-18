import { UserManagementAdaptor } from '../user-mgmt/userManagement.adaptor';
import {
  CountryData,
  LocationData,
  UserDetail,
  UserData,
  RoleTypesData,
  LocationMappingData,
  RoleInfo,
  RoleDetail,
  SelectDropDownOption
} from '@poss-web/shared/models';

export class UserManagementHelper {
  static getUserData(data: any): UserData {
    const users: UserDetail[] = [];
    for (const user of data.results) {
      users.push(UserManagementAdaptor.usersfromJson(user));
    }
    return {
      users,
      totalUsers: data.totalElements
    };
  }

  static getStateData(data: any): string[] {
    const dropdowndata: string[] = [];
    for (const item of data) {
      dropdowndata.push(item.description);
    }
    return dropdowndata;
  }

  static getCountryData(data: any): CountryData[] {
    const dropdowndata: CountryData[] = [];
    for (const item of data) {
      dropdowndata.push({
        description: item.description,
        countryCode: item.countryCode
      });
    }
    return dropdowndata;
  }

  static getLocationCodeData = (data: any): LocationData => {
    console.log(data,'HELPER');
    return {
      countryCode: data.countryCode,
      locationCode: data.locationCode,
      ownerTypeCode:data.ownerTypeCode
    };
  };

  static getRolesData(data: any): RoleInfo {
    const roleInfo = {} as RoleInfo;
    roleInfo.roles = new Map<string, string>();
    roleInfo.rolesDetails = []
    for (const item of data.results) {
      roleInfo.roles.set(item.roleCode, item.roleName);
      let roleDetails = {} as RoleDetail
      roleDetails.roleCode = item.roleCode;
      roleDetails.roleName = item.roleName;
      roleDetails.isLocationMappingRequired = item.isLocationMappingRequired;
      roleInfo.rolesDetails.push(roleDetails);
    }
    return roleInfo;
  }

  static getRoleTypesData(data: any): RoleTypesData[] {
    const dropdowndata: RoleTypesData[] = [];
    for (const item of data) {
      dropdowndata.push({
        code: item.code,
        value: item.value
      });
    }
    return dropdowndata;
  }

  static getMappedLocations(data: any): LocationMappingData[] {
    const selectedLocations: LocationMappingData[] = [];
    for (const locations of data.results) {
      selectedLocations.push({
        id: locations.locationCode,
        description: locations.locationCode
      });
    }

    return selectedLocations;
  }

  static getMappedRegions(data: any): SelectDropDownOption[] {
    const dropdowndata: SelectDropDownOption[] = [];
    for (const region of data.results) {
      dropdowndata.push({
        description: region.description,
        value: region.regionCode
      });
    }
    return dropdowndata;
  }
}
