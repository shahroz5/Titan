import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { ProductMasterUpdateKey } from './+state/product-master-update.state';
import { UpdateProductMasterReducer } from './+state/product-master-update.reducers';
import { EffectsModule } from '@ngrx/effects';
import { ProductMasterUpdateEffects } from './+state/product-master-update.effects';
import { ProductMasterUpdateService } from './product-master-update.service';
import { ProductMasterUpdateFacade } from './+state/product-master-update.facades';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ProductMasterUpdateKey, UpdateProductMasterReducer),
    EffectsModule.forFeature([ProductMasterUpdateEffects])
  ],
  providers: [ProductMasterUpdateFacade, ProductMasterUpdateService]
})
export class PossProductMasterUpdateDataAccessProductMasterUpdateModule {}
