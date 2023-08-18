import { NgModule } from '@angular/core';
import { PsvReceiptItemListComponent } from './item-list/psv-receipt-item-list.component';
import { PsvReceiptItemComponent } from './item/psv-receipt-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import {SharedComponentsUiFormFieldControlsModule} from '@poss-web/shared/components/ui-form-field-controls';
import { SharedItemUiItemDetailsModule  } from '@poss-web/shared/item/ui-item-details'
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  declarations: [PsvReceiptItemComponent, PsvReceiptItemListComponent],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule,
    SharedUtilFieldValidatorsModule

  ],
  exports: [PsvReceiptItemComponent, PsvReceiptItemListComponent]
})
export class EpossOtherReceiptUiOtherReceiptPsvItemListModule {}
