import { BinCodes, BinRequestResponse,CustomErrors, HistoryFiltersData} from '@poss-web/shared/models';
import { ItemEntity } from './update-hallmark.entity';

export interface UpdateHallmarkState {

  error: CustomErrors;
  isLoading: boolean;
  isHallmarkDetailsUpdated: boolean;

}



