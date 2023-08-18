import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { GlBoutiqueDetailsComponent } from './gl-boutique-details/gl-boutique-details.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,

    SharedComponentsUiToggleButtonModule
  ],
  declarations: [GlBoutiqueDetailsComponent],
  exports: [GlBoutiqueDetailsComponent]
})
export class EpossGlBoutiqueLocationUiGlBoutiqueLocationDetailModule {}
