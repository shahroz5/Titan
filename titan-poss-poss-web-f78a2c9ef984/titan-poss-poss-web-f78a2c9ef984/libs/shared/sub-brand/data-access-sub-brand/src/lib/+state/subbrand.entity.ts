import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BrandMaster } from '@poss-web/shared/models';



export interface SubBrandEntity extends EntityState<BrandMaster> { }

export const subBrandAdaptor = createEntityAdapter<BrandMaster>({
  selectId: brandList => brandList.brandCode
});


export const subBrandSelector = subBrandAdaptor.getSelectors();
