import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ConversionApprovalsItem } from '@poss-web/shared/models';

export interface ConverionApprovalsRequestEntity
  extends EntityState<ConversionApprovalsItem> {}
export const conversionApprovalRequestAdaptor = createEntityAdapter<
  ConversionApprovalsItem
>({
  selectId: conversionRequest => conversionRequest.id
});
export const conversionApprovalRequestSelector = conversionApprovalRequestAdaptor.getSelectors();
