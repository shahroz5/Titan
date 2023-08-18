import {
  CustomErrors,
  LocationData,
  LocationMappingData,
  RoleInfo,
  RoleTypesData,
  SelectDropDownOption,
  UserDetail,
  UserProfile
} from '@poss-web/shared/models';
import { CountryEntity } from './user-management.entity';

export interface UserManagementState {
  users: UserDetail[];
  userProfile: UserProfile;
  totalUsers: number;
  selectedUser: UserDetail;
  states: string[];
  countries: CountryEntity;
  location: LocationData;
  emailLocation: string;
  roles: RoleInfo;
  roleTypes: RoleTypesData[];
  regions: SelectDropDownOption[];
  updateUser: boolean;
  error: CustomErrors;
  checkMobileEmail: boolean;
  changePassword: boolean;
  verifyMobileOTP: boolean;
  OTPsent: boolean;
  isLoading: boolean;
  mappedLocations: LocationMappingData[];
  isLocationsMapped: boolean
}
