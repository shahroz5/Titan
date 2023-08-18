import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoneMasterSearchFormComponent } from './stone-master-search-form/stone-master-search-form.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  exports: [StoneMasterSearchFormComponent],
  declarations: [StoneMasterSearchFormComponent]
})
export class SharedStoneUiStoneHeaderFormModule {}
