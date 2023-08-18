import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossRivaahEligibilityConfigDataAccessRivaahConfigurationModule } from '@poss-web/eposs/rivaah-eligibility-config/data-access-rivaah-configuration';
import { EpossRivaahEligibilityConfigUiCouponConfigurationModule } from '@poss-web/eposs/rivaah-eligibility-config/ui-coupon-configuration';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CouponConfigComponent } from './coupon-config/coupon-config.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossRivaahEligibilityConfigUiCouponConfigurationModule,
    EpossRivaahEligibilityConfigDataAccessRivaahConfigurationModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    RouterModule.forChild([{ path: '', component: CouponConfigComponent }]),
  ],
  declarations: [CouponConfigComponent],
  exports: [CouponConfigComponent]
})
export class EpossRivaahEligibilityConfigFeatureCouponConfigurationModule {}
