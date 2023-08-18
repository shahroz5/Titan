import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { GEPProductDetails, CancelGepItem } from '@poss-web/shared/models';

export interface GepDetailsEntity extends EntityState<GEPProductDetails> {}
export const gepDetailsAdapter = createEntityAdapter<GEPProductDetails>({
  selectId: gepDetails => gepDetails.id
});

export const gepDetailsSelector = gepDetailsAdapter.getSelectors();

export interface GepCancelEntity extends EntityState<CancelGepItem> {}
export const gepCancelAdapter = createEntityAdapter<CancelGepItem>({
  selectId: gepCancel => gepCancel.refTxnId
});

export const gepCancelSelector = gepCancelAdapter.getSelectors();
