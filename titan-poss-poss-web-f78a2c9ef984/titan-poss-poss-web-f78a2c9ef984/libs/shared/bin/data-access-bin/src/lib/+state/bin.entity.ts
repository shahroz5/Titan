import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BinCodesByBinGroup } from '@poss-web/shared/models';


export interface   BinEntity extends EntityState<BinCodesByBinGroup> { }

export const binAdapter = createEntityAdapter<BinCodesByBinGroup>({
  selectId: bin => bin.binCode
});

export const binSelector = binAdapter.getSelectors();

