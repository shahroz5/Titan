import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnPriorityConfigDetailItemComponent } from './cn-priority-config-detail-item/cn-priority-config-detail-item.component';
import { CnPriorityListDirective } from './cn-priority-config-detail-item/cn-priority-list.directive';
import { CnPriorityListItemsDirective } from './cn-priority-config-detail-item/cn-priority-list-items.directive';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CnPriorityConfigViewDetailItemComponent } from './cn-priority-config-view-detail-item/cn-priority-config-view-detail-item.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    CnPriorityConfigDetailItemComponent,
    CnPriorityListDirective,
    CnPriorityListItemsDirective,
    CnPriorityConfigViewDetailItemComponent
  ],
  exports: [
    CnPriorityConfigDetailItemComponent,
    CnPriorityConfigViewDetailItemComponent
  ]
})
export class EpossCnPriorityConfigUiCnPriorityConfigDetailModule {}
