import { NgModule } from '@angular/core';
import { LovmasterItemsComponent } from './lovmaster-items/lovmaster-items.component';
import { LovmasterListingItemComponent } from './lovmaster-listing-item/lovmaster-listing-item.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  declarations: [LovmasterItemsComponent, LovmasterListingItemComponent],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  exports: [LovmasterItemsComponent, LovmasterListingItemComponent]
})
export class SharedListOfValuesUiLovListModule {}
