import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { AccessList } from '@poss-web/shared/models';

export interface UnipayAccessMappingEntity extends EntityState<AccessList> {}
export const unipayAccessMappingAdapter = createEntityAdapter<AccessList>({
  selectId:accessList => accessList.id
});

export const  unipayAccessMappingSelector = unipayAccessMappingAdapter.getSelectors();

// Todo add sort by line item number
