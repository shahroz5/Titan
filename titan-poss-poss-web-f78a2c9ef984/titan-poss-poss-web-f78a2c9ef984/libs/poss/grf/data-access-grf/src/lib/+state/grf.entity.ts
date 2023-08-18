import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CreditNote } from '@poss-web/shared/models';

export interface CreditNoteEntity extends EntityState<CreditNote> {}

export const creditNoteAdaptor = createEntityAdapter<CreditNote>({
  selectId: item => item.id
});

export const creditNoteSelector = creditNoteAdaptor.getSelectors();
