import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { PayeeBankGLCodeDetails } from '@poss-web/shared/models';

export interface PayeeBankGlDetailsEntity
  extends EntityState<PayeeBankGLCodeDetails> {}
export const payeeGlDetailsAdapter = createEntityAdapter<
  PayeeBankGLCodeDetails
>({
  selectId: payeeGlDetails => payeeGlDetails?.id
});

export const payeeGlDetailsSelector = payeeGlDetailsAdapter.getSelectors();
