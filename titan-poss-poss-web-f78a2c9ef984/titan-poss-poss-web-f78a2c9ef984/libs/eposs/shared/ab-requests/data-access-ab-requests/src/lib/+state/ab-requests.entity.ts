import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { AB } from '@poss-web/shared/models';

export interface ABDetailsEntity extends EntityState<AB> {}
export const ABDetailsAdapter = createEntityAdapter<AB>({
  selectId: ABDetails => ABDetails.taskId
});

export const ABDetailsSelector = ABDetailsAdapter.getSelectors();
