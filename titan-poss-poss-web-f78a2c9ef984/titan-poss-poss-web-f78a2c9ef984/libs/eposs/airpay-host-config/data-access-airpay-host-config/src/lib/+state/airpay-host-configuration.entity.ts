import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { HostNameList } from '@poss-web/shared/models';

export interface AirpayHostConfigEntity extends EntityState<HostNameList> {}
export const airpayHostConfigAdapter = createEntityAdapter<HostNameList>({
  selectId: accessList => accessList.id
});

export const airpayHostConfigSelector = airpayHostConfigAdapter.getSelectors();
