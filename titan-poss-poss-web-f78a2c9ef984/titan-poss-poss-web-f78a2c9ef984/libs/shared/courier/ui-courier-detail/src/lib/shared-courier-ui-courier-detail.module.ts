import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CourierDetailsSteponeComponent } from './details/courier-details-stepone.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  declarations: [CourierDetailsSteponeComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedPermissionUiPermissionModule
  ],
  exports: [CourierDetailsSteponeComponent]
})
export class SharedCourierUiCourierDetailModule {}
