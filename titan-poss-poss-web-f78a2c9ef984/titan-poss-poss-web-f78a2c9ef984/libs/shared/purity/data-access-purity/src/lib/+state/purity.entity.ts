import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Purity } from '@poss-web/shared/models';


export interface PurityEntity extends EntityState<Purity>{}

export const purityAdaptor=createEntityAdapter<Purity>({
  selectId:purityList=>purityList.id
})


export const puritySelector=purityAdaptor.getSelectors()
