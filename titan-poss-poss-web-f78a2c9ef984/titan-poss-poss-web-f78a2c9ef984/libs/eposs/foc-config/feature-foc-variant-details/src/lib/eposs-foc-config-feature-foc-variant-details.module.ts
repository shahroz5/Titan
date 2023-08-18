import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FocVariantDetailsComponent } from './foc-variant-details/foc-variant-details.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossFocConfigUiFocVariantDetailsModule } from '@poss-web/eposs/foc-config/ui-foc-variant-details';
import { EpossFocConfigDataAccessFocConfigModule } from '@poss-web/eposs/foc-config/data-access-foc-config';
import { EpossFocConfigUiFocItemMappingPopupModule } from '@poss-web/eposs/foc-config/ui-foc-item-mapping-popup';
import { SharedComponentsUiErrorGridPopupModule } from '@poss-web/shared/components/ui-error-grid-popup';

import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

const routes: Route[] = [
  {
    path: '',
    component: FocVariantDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiLoaderModule,
    EpossFocConfigUiFocVariantDetailsModule,
    EpossFocConfigDataAccessFocConfigModule,
    EpossFocConfigUiFocItemMappingPopupModule,
    SharedComponentsUiErrorGridPopupModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [FocVariantDetailsComponent]
})
export class EpossFocConfigFeatureFocVariantDetailsModule {}
