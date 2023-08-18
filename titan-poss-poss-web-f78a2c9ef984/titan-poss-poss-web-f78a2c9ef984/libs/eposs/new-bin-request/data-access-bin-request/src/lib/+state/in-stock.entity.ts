

import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BinHistroyResponse } from '@poss-web/shared/models';


export interface ItemEntity extends EntityState<BinHistroyResponse> { }

export const itemAdapter = createEntityAdapter<BinHistroyResponse>({
  selectId: item => item.id

});

export const itemSelector = itemAdapter.getSelectors();
