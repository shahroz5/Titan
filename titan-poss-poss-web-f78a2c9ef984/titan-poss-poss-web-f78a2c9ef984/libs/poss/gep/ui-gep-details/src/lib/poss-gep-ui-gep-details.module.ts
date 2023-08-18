import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

import { GepSearchListComponent } from './gep-search-list/gep-search-list.component';
import { GepViewDetailsComponent } from './gep-view-details/gep-view-details.component';

import { GepProductsDetailsComponent } from './gep-products-details/gep-products-details.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    GepSearchListComponent, 
    GepViewDetailsComponent, 
    GepProductsDetailsComponent
  ],
  exports: [
    GepSearchListComponent, 
    GepViewDetailsComponent,
    GepProductsDetailsComponent
  ],
})
export class PossGepUiGepDetailsModule {}
