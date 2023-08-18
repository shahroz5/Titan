import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { MaterialType } from '@poss-web/shared/models';

export interface MetaltypeEntity extends EntityState<MaterialType> {}

export const metalTypeAdaptor = createEntityAdapter<MaterialType>({
  selectId: metalTypeList => metalTypeList.materialCode
});

export const metalTypeSelector = metalTypeAdaptor.getSelectors();
