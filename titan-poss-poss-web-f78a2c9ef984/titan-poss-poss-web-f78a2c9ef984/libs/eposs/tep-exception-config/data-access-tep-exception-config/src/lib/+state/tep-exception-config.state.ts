import { CustomErrors, TEPExceptionConfig } from '@poss-web/shared/models';
import { TepExceptionConfigEntity } from './tep-exception-config.entity';

export interface TepExceptionConfigState {
  tepExceptionConfiglist: TepExceptionConfigEntity;
  tepExceptionConfigDetails: TEPExceptionConfig;
  totalElements: number;
  maxFlatTepExchangeValue: number;
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
}
