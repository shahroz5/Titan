import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Route, RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { ProductUpdateMasterComponent } from './product-update-master/product-update-master.component';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { PossProductMasterUpdateDataAccessProductMasterUpdateModule } from '@poss-web/poss/product-master-update/data-access-product-master-update';
import { ProductMasterUpdateKey } from 'libs/poss/product-master-update/data-access-product-master-update/src/lib/+state/product-master-update.state';
const route: Route[] = [{ path: '', component: ProductUpdateMasterComponent }];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    PossProductMasterUpdateDataAccessProductMasterUpdateModule,
    SharedComponentsUiFormattersModule,
    RouterModule.forChild([
      { path: '', component: ProductUpdateMasterComponent, pathMatch: 'full' }
    ]),
    SharedComponentsUiLoaderModule
  ],
  exports: [ProductUpdateMasterComponent],
  declarations: [ProductUpdateMasterComponent]
})
export class PossProductMasterUpdateFeatureProductMasterUpdateModule {}
