import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { ItemSteponeComponent } from './item-stepone.component';
import { UiViewStonesPopupComponent } from './ui-view-stones-popup/ui-view-stones-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiAgGridModule
  ],

  declarations: [ItemSteponeComponent, UiViewStonesPopupComponent],
  exports: [ItemSteponeComponent],
  entryComponents: [UiViewStonesPopupComponent]
})
export class SharedItemMasterUiItemDetailModule {}
