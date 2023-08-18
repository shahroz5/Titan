import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { SentRequestResponse, TransferedCNS } from '@poss-web/shared/models';

export interface SentRequestEntity extends EntityState<SentRequestResponse> {}

export const sentRequestAdaptor = createEntityAdapter<SentRequestResponse>({
  selectId: item => item.processId
});

export const sentRequestSelector = sentRequestAdaptor.getSelectors();

export interface TransferedCNEntity extends EntityState<TransferedCNS> {}

export const transferedCNsAdaptor = createEntityAdapter<TransferedCNS>({
  selectId: item => item.ghsDocNo
});

export const transferedCNsSelector = transferedCNsAdaptor.getSelectors();
