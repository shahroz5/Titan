import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountComponent } from './discount.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossSharedDiscountUiDiscountModule } from '@poss-web/poss/shared/discount/ui-discount';
import { PossSharedDiscountDataAccessDiscountModule } from '@poss-web/poss/shared/discount/data-access-discount';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossSharedDiscountUiDiscountModule,
    PossSharedDiscountDataAccessDiscountModule,
    PossSharedViewTcsUiViewTcsModule,
    PossSharedProductDataAccessProductModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
    // PossSharedProductDataAccessProductModule
  ],
  declarations: [DiscountComponent],
  exports: [DiscountComponent]
})
export class PossSharedDiscountFeatureDiscountModule {}
