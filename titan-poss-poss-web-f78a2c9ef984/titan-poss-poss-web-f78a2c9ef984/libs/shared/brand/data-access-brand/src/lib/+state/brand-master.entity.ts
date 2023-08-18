import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BrandMasterDetails } from '@poss-web/shared/models';



export interface BrandEntity extends EntityState<BrandMasterDetails> { }

export const brandAdaptor = createEntityAdapter<BrandMasterDetails>({
  selectId: brandList => brandList.brandCode
});


export const brandSelector = brandAdaptor.getSelectors();
