import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbToleranceListComponent } from './ab-tolerance-list/ab-tolerance-list.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossAbToleranceConfigDataAccessAbToleranceConfigModule } from '@poss-web/eposs/ab-tolerance-config/data-access-ab-tolerance-config';
import { EpossAbToleranceConfigUiAbToleranceConfigListingModule } from '@poss-web/eposs/ab-tolerance-config/ui-ab-tolerance-config-listing';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

const route: Route[] = [{ path: '', component: AbToleranceListComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossAbToleranceConfigDataAccessAbToleranceConfigModule,
    EpossAbToleranceConfigUiAbToleranceConfigListingModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [AbToleranceListComponent]
})
export class EpossAbToleranceConfigFeatureAbToleranceConfigListingModule {}
