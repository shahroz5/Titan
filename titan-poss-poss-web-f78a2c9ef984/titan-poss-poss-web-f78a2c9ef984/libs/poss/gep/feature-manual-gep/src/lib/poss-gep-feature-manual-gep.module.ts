import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualGepComponent } from './manual-gep/manual-gep.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGepUiGepProductGridModule } from '@poss-web/poss/gep/ui-gep-product-grid';
import { PossGepDataAccessGepModule } from '@poss-web/poss/gep/data-access-gep';
import { PossGepUiManualGepModule } from '@poss-web/poss/gep/ui-manual-gep';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { PossSharedUiManualFormDetailsModule } from '@poss-web/poss/shared/ui-manual-form-details';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
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
    PossGepUiManualGepModule,
    SharedComponentsUiFileUploadModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossSharedProductDataAccessProductModule,
    SharedCommonDataAccessCommonModule,
    CommonCustomMaterialModule,
    PossGepDataAccessGepModule,
    PossSharedUiManualFormDetailsModule,
    SharedComponentsUiLoaderModule,
    PossGepUiGepProductGridModule,
    SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule,
    RouterModule.forChild([{ path: '', component: ManualGepComponent }]),
    SharedComponentsUiSelectionDialogModule,
    SharedCustomerFeatureCustomerCreateModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [ManualGepComponent],
  exports: [ManualGepComponent]
})
export class PossGepFeatureManualGepModule {}
