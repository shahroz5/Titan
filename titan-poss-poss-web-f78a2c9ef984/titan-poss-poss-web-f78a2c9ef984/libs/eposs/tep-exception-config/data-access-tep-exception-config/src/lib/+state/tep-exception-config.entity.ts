import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { TEPExceptionConfig } from '@poss-web/shared/models';



export interface TepExceptionConfigEntity extends EntityState<TEPExceptionConfig> { }

export const tepExceptionConfigAdaptor = createEntityAdapter<TEPExceptionConfig>({
  selectId: tepExceptionConfig => tepExceptionConfig.configId
});


export const tepExceptionConfigSelector = tepExceptionConfigAdaptor.getSelectors();
