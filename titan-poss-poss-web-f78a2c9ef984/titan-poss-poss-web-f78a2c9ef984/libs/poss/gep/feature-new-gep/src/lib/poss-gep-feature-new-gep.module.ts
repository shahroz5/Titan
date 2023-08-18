import { SharedToolbarDataAccessToolbarModule } from '@poss-web/shared/toolbar/data-access-toolbar';
import { PossGepUiManualGepModule } from '@poss-web/poss/gep/ui-manual-gep';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewGepComponent } from './new-gep/new-gep.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGepUiGepProductGridModule } from '@poss-web/poss/gep/ui-gep-product-grid';
import { PossGepDataAccessGepModule } from '@poss-web/poss/gep/data-access-gep';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilBarcodeReaderModule } from '@poss-web/shared/util-barcode-reader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { RouterModule } from '@angular/router';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule } from '@poss-web/shared/discounts-selection/feature-discounts-selection-pop-up';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,

    RouterModule.forChild([{ path: '', component: NewGepComponent }]),

    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossSharedProductDataAccessProductModule,
    SharedComponentsUiFileUploadModule,
    SharedComponentsUiLoaderModule,
    PossGepUiGepProductGridModule,
    PossGepDataAccessGepModule,
    SharedUtilBarcodeReaderModule,
    SharedToolbarDataAccessToolbarModule,
    PossGepUiManualGepModule,
    SharedCommonDataAccessCommonModule,
    SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule,
    SharedComponentsUiSelectionDialogModule,
    SharedCustomerFeatureCustomerCreateModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [NewGepComponent],
  exports: [NewGepComponent]
})
export class PossGepFeatureNewGepModule {}
