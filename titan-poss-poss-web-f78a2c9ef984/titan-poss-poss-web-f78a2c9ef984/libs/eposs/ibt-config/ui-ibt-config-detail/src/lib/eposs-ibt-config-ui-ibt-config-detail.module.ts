import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbtConigurationDetailItemComponent } from './ibt-coniguration-detail-item/ibt-coniguration-detail-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [IbtConigurationDetailItemComponent],
  exports: [IbtConigurationDetailItemComponent]
})
export class EpossIbtConfigUiIbtConfigDetailModule {}
