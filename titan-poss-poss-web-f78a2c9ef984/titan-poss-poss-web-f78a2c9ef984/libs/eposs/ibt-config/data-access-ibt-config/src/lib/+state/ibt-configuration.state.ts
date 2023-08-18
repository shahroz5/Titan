import {
  CustomErrors,
  IbtConfigurationResponse,
  IbtConfiguration
} from '@poss-web/shared/models';

export interface IbtConfigurationState {
  ibtConfigList: IbtConfiguration[];
  ibtConfiguration: IbtConfigurationResponse;
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  isLoading: boolean;
  totalElements: number;
}
