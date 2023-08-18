import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BinGroupDetails } from '@poss-web/shared/models';


export interface BinGroupEntity extends EntityState<BinGroupDetails> { }

export const binGrouptAdapter = createEntityAdapter<BinGroupDetails>({
  selectId: binGroup => binGroup.binGroupCode
});

export const binGroupSelector = binGrouptAdapter.getSelectors();

