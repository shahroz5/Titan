import {
  ConversionConfig,
  CustomErrors,
  ConversionConfigByIdPayload,
  CheckBoxHeader
} from '@poss-web/shared/models';

export interface ConversionConfigState {
  totalElements: number;
  isLoading: boolean;
  conversionConfigList: ConversionConfig[];
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  configDetailsById: ConversionConfigByIdPayload;
  productGroups: CheckBoxHeader[];
  productCategories: CheckBoxHeader[];
  saveSuccessPayload: ConversionConfigByIdPayload;
  hasSearched: boolean;
}
