import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnMasterDetailItemComponent } from './cn-master-detail-item/cn-master-detail-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CnMasterViewDetailItemComponent } from './cn-master-view-detail-item/cn-master-view-detail-item.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [CnMasterDetailItemComponent, CnMasterViewDetailItemComponent],
  exports: [CnMasterDetailItemComponent, CnMasterViewDetailItemComponent]
})
export class EpossCnMasterUiCnMasterDetailModule {}
