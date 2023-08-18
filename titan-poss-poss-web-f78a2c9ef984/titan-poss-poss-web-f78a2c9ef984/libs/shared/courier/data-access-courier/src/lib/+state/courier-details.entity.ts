import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { CourierMaster } from '@poss-web/shared/models';
export interface CourierDetailsEntity extends EntityState<CourierMaster> {}
export const courierDetailsAdaptor = createEntityAdapter<CourierMaster>({
  selectId: courierDetails => courierDetails.courierName
});
export const CourierSelector = courierDetailsAdaptor.getSelectors();
