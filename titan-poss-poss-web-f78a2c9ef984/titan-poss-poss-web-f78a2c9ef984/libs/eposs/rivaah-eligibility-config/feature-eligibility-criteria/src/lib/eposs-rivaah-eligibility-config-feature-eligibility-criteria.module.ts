import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpossRivaahEligibilityConfigDataAccessRivaahConfigurationModule } from '@poss-web/eposs/rivaah-eligibility-config/data-access-rivaah-configuration';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EligibilityCriteriaComponent } from './eligibility-criteria/eligibility-criteria.component';
import { EpossRivaahEligibilityConfigUiRivaahEligibilityConfigModule } from '@poss-web/eposs/rivaah-eligibility-config/ui-rivaah-eligibility-config';
import { SharedComponentsUiErrorGridPopupModule } from '@poss-web/shared/components/ui-error-grid-popup';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EligibilityCriteriaComponent }
    ]),
    CommonCustomMaterialModule,
    EpossRivaahEligibilityConfigUiRivaahEligibilityConfigModule,
    EpossRivaahEligibilityConfigDataAccessRivaahConfigurationModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiErrorGridPopupModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [EligibilityCriteriaComponent],
  exports: [EligibilityCriteriaComponent]
})
export class EpossRivaahEligibilityConfigFeatureEligibilityCriteriaModule {}
