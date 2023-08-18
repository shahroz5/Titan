import {
  CustomErrors,
  PayeeBankDetails,
  PayeeBankGLCodeDetails,
  PayeeBankMappingTypesEnum,
  GlSelectMappedLocations,
  LocationCodeDetails,
  StateSummary,
  TownSummary
} from '@poss-web/shared/models';
import { PayeeBankGlDetailsEntity } from './payee-bank.entity';

export interface PayeeBankState {
  error: CustomErrors;
  payeeBankListing: PayeeBankDetails[];
  payeeBankDetails: PayeeBankDetails;
  totalPayeeBankDetails: number;
  isLoading: boolean;
  saveBankDetailsSuccess: boolean;
  editBankDetailsSuccess: boolean;
  savePayeeBankResponses: PayeeBankDetails;
  editPayeeBankResponses: PayeeBankDetails;

  saveGlCodeDetail: PayeeBankGLCodeDetails;
  saveGlCodeDetailSuccess: boolean;
  mappingType: PayeeBankMappingTypesEnum;
  locationCodes: LocationCodeDetails[];
  glCodeDefaults: any;
  glCodeDetail: PayeeBankGlDetailsEntity;
  totalCount: number;
  mappedLocations: GlSelectMappedLocations[];
  statesData: StateSummary[];
  townsData: TownSummary[];
}
