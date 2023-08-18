import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { UiCancelGepComponent } from './ui-cancel-gep/ui-cancel-gep.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { AgGridModule } from 'ag-grid-angular';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { UiCancelDetailComponent } from './ui-cancel-detail/ui-cancel-detail.component';
import { PossGepUiGepProductGridModule } from '@poss-web/poss/gep/ui-gep-product-grid';
import { SearchCancelGepPopupComponent } from './search-cancel-gep-popup/search-cancel-gep-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    AgGridModule.withComponents([]),
    SharedComponentsUiAgGridModule,
    PossGepUiGepProductGridModule
  ],
  declarations: [
    UiCancelGepComponent,
    UiCancelDetailComponent,
    SearchCancelGepPopupComponent
  ],
  exports: [
    UiCancelGepComponent,
    UiCancelDetailComponent,
    SearchCancelGepPopupComponent
  ],
  entryComponents: [SearchCancelGepPopupComponent]
})
export class PossGepUiCancelGepModule {}
