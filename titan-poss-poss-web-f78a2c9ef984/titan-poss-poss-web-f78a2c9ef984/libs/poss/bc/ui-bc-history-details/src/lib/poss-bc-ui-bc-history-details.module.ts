import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryHeaderDetailsComponent } from './history-header-details/history-header-details.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule,
  SharedComponentsUiFormattersModule,
  CommonCustomMaterialModule
  ],
  declarations: [HistoryHeaderDetailsComponent],
  exports: [HistoryHeaderDetailsComponent]
})
export class PossBcUiBcHistoryDetailsModule {}
