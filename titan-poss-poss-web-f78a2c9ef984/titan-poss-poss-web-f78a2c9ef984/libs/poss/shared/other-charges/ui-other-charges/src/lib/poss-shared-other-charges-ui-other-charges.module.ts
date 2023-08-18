import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherChargesComponent } from './other-charges/other-charges.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { OtherChargesViewComponent } from './other-charges-view/other-charges-view.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [OtherChargesComponent, OtherChargesViewComponent],
  exports: [OtherChargesComponent, OtherChargesViewComponent]
})
export class PossSharedOtherChargesUiOtherChargesModule {}
