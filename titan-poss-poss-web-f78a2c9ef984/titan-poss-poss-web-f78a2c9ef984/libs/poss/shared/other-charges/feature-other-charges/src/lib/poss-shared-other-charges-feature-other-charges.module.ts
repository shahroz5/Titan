import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossSharedOtherChargesDataAccessOtherChargesModule } from '@poss-web/poss/shared/other-charges/data-access-other-charges';
import { OtherChargesComponent } from './other-charges/other-charges.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossSharedOtherChargesUiOtherChargesModule } from '@poss-web/poss/shared/other-charges/ui-other-charges';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossSharedOtherChargesDataAccessOtherChargesModule,
    SharedComponentsUiLoaderModule,
    PossSharedOtherChargesUiOtherChargesModule
  ],
  declarations: [OtherChargesComponent],
  exports: [OtherChargesComponent]
})
export class PossSharedOtherChargesFeatureOtherChargesModule {}
