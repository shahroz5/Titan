import { NgModule } from '@angular/core';
import { AdjustmentReceiptsItemComponent } from './item/adjustment-receipts-item.component';
import { AdjustmentReceiptsItemListComponent } from './item-list/adjustment-receipts-item-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import {SharedComponentsUiFormFieldControlsModule} from '@poss-web/shared/components/ui-form-field-controls';
import { SharedItemUiItemDetailsModule  } from '@poss-web/shared/item/ui-item-details'
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  declarations: [
    AdjustmentReceiptsItemComponent,
    AdjustmentReceiptsItemListComponent
  ],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule,
    SharedUtilFieldValidatorsModule
  ],
  exports: [
    AdjustmentReceiptsItemComponent,
    AdjustmentReceiptsItemListComponent
  ]
})
export class EpossOtherReceiptUiOtherReceiptAdjustmentItemListModule {}
