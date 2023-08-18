import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { OrderDetailComponent } from './order-detail/order-detail.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedCommonDataAccessCommonModule
  ],
  declarations: [OrderDetailComponent],
  exports: [OrderDetailComponent]
})
export class SharedOrderDetailFeatureOrderDetailModule {}
