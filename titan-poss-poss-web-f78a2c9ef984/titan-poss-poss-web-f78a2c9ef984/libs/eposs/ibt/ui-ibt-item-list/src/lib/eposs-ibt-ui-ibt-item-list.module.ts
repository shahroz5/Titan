import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { InterBoutiqueTransferItemListComponent } from './item-list/inter-boutique-transfer-item-list.component';
import { InterBoutiqueTransferItemComponent } from './item/inter-boutique-transfer-item.component';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { HistoryItemComponent } from './history-item/history-item.component';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';

@NgModule({
  declarations: [
    InterBoutiqueTransferItemComponent,
    InterBoutiqueTransferItemListComponent,
    HistoryItemComponent
  ],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule
  ],
  exports: [
    InterBoutiqueTransferItemComponent,
    InterBoutiqueTransferItemListComponent
  ]
})
export class EpossIbtUiIbtItemListModule {}
