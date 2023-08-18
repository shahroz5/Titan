import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { RazporVendorList } from '@poss-web/shared/models';

export interface RazorpayVendorMappingEntity
  extends EntityState<RazporVendorList> {}
export const razorpayVendorMappingAdapter = createEntityAdapter<
  RazporVendorList
>({
  selectId: accessList => accessList.accountId
});

export const razorpayVendorMappingSelector = razorpayVendorMappingAdapter.getSelectors();

// Todo add sort by line item number
