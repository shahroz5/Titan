import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnValidationDetailItemComponent } from './cn-validation-detail-item/cn-validation-detail-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CnValidationViewDetailItemComponent } from './cn-validation-view-detail-item/cn-validation-view-detail-item.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    CnValidationDetailItemComponent,
    CnValidationViewDetailItemComponent
  ],
  exports: [
    CnValidationDetailItemComponent,
    CnValidationViewDetailItemComponent
  ]
})
export class EpossCnValidationUiCnValidationDetailModule {}
