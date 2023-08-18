import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CourierViewComponent } from './courier-view/courier-view.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [CourierViewComponent],
  exports: [CourierViewComponent]
})
export class SharedCourierUiCourierViewModule {}
