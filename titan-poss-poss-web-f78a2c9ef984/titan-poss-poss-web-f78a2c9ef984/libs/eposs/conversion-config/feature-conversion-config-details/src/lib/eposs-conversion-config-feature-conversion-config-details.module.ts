import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionConfigDetailsComponent } from './conversion-config-details/conversion-config-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { EpossConversionConfigDataAccessConversionConfigModule } from '@poss-web/eposs/conversion-config/data-access-conversion-config';
import { SharedComponentsUiCheckboxGridModule } from '@poss-web/shared/components/ui-checkbox-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossConversionConfigUiConversionConfigDetailsModule } from '@poss-web/eposs/conversion-config/ui-conversion-config-details';
import { EpossConversionConfigUiConversionConfigViewModule } from '@poss-web/eposs/conversion-config/ui-conversion-config-view';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
const routes: Routes = [
  {
    path: '',
    component: ConversionConfigDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    EpossConversionConfigDataAccessConversionConfigModule,
    SharedComponentsUiCheckboxGridModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule,
    EpossConversionConfigUiConversionConfigDetailsModule,
    EpossConversionConfigUiConversionConfigViewModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [ConversionConfigDetailsComponent]
})
export class EpossConversionConfigFeatureConversionConfigDetailsModule {}
