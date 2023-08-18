import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { TEPValidationConfigResult } from '@poss-web/shared/models';

export interface TepValidationConfigEntity
  extends EntityState<TEPValidationConfigResult> {}

export const tepValidationConfigAdaptor = createEntityAdapter<
  TEPValidationConfigResult
>({
  selectId: tepValidationConfig => tepValidationConfig.configId
});

export const tepValidationConfigSelector = tepValidationConfigAdaptor.getSelectors();
