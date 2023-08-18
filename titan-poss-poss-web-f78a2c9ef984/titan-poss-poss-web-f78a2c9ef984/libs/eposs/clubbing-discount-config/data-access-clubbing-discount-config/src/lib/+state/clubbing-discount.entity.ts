import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ClubDiscountsList } from '@poss-web/shared/models';

export interface ClubDiscountsEntity extends EntityState<ClubDiscountsList> {}
export const clubDiscountsAdapter = createEntityAdapter<ClubDiscountsList>({
  selectId: clubDiscounts => clubDiscounts.id
});

export const clubDiscountsSelector = clubDiscountsAdapter.getSelectors();
