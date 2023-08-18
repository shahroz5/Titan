import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { GLLocationPaymentList } from '@poss-web/shared/models';

export interface GlLocationPaymentDetailsEntity
  extends EntityState<GLLocationPaymentList> {}
export const glLocPaymentAdapter = createEntityAdapter<GLLocationPaymentList>({
  selectId: glLocPaymentDetails => glLocPaymentDetails.id
});

export const glLocPaymentSelector = glLocPaymentAdapter.getSelectors();
