import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { CorporateTown } from '@poss-web/shared/models';


export interface CorporateTownEntity extends EntityState<CorporateTown> { }

export const corporateTownAdapter = createEntityAdapter<CorporateTown>({
  selectId: corporateTown => corporateTown.townCode
});

export const corporateTownSelector = corporateTownAdapter.getSelectors();

