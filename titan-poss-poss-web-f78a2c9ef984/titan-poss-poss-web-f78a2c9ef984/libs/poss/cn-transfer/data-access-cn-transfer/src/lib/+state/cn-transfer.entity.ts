import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CNDetailsInfo} from '@poss-web/shared/models';

export interface RequestsEnity extends EntityState<CNDetailsInfo> {}
export const requestsAdaptor = createEntityAdapter<CNDetailsInfo>({
  selectId: request => request.processId
});
export const requestsSelector = requestsAdaptor.getSelectors();
