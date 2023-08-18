import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossRivaahEligibilityConfigDataAccessRivaahConfigurationModule } from '@poss-web/eposs/rivaah-eligibility-config/data-access-rivaah-configuration';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { LocationMappingComponent } from './location-mapping/location-mapping.component';
import { EpossRivaahEligibilityConfigUiRivaahLocationMappingModule } from '@poss-web/eposs/rivaah-eligibility-config/ui-rivaah-location-mapping';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossRivaahEligibilityConfigDataAccessRivaahConfigurationModule,
    EpossRivaahEligibilityConfigUiRivaahLocationMappingModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    RouterModule.forChild([{ path: '', component: LocationMappingComponent }]),
  ],
  declarations: [LocationMappingComponent],
  exports: [LocationMappingComponent]
})
export class EpossRivaahEligibilityConfigFeatureRivaahLocationMappingModule {}
