import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewTcsPopupComponent } from './view-tcs-popup/view-tcs-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { ResetTcsPopupComponent } from './reset-tcs-popup/reset-tcs-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [ViewTcsPopupComponent, ResetTcsPopupComponent],
  exports: [ViewTcsPopupComponent, ResetTcsPopupComponent],
  entryComponents: [ResetTcsPopupComponent]
})
export class PossSharedViewTcsUiViewTcsModule {}
