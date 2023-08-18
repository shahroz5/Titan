import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { CashMemoItemDetails } from '@poss-web/shared/models';

export interface ItemDetailsEntity extends EntityState<CashMemoItemDetails> {}
export const itemDetailsAdapter = createEntityAdapter<CashMemoItemDetails>({
  selectId: itemDetails => itemDetails.itemId
});

export const itemDetailsSelector = itemDetailsAdapter.getSelectors();
