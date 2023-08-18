import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { CutPieceTotFormComponent } from './cut-piece-tot-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiFormFieldControlsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [CutPieceTotFormComponent],
  exports: [CutPieceTotFormComponent]
})
export class EpossCutPieceTotUiCutPieceTotDetailModule {}
