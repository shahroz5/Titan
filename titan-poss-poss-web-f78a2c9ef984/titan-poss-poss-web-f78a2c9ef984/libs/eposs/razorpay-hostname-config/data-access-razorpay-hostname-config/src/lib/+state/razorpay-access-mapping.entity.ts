import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { AccessList } from '@poss-web/shared/models';

export interface RazorpayAccessMappingEntity extends EntityState<AccessList> {}
export const razorpayAccessMappingAdapter = createEntityAdapter<AccessList>({
  selectId:accessList => accessList.id
});

export const  razorpayAccessMappingSelector = razorpayAccessMappingAdapter.getSelectors();

// Todo add sort by line item number
