import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { OtherReceiptItemComponent } from './item/other-receipt-item.component';
import { OtherReceiptItemListComponent } from './item-list/other-receipt-item-list.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import {SharedComponentsUiFormFieldControlsModule} from '@poss-web/shared/components/ui-form-field-controls';
import { SharedItemUiItemDetailsModule  } from '@poss-web/shared/item/ui-item-details'
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  declarations: [OtherReceiptItemComponent, OtherReceiptItemListComponent],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule,
    SharedUtilFieldValidatorsModule
  ],
  exports: [
    OtherReceiptItemComponent,
    OtherReceiptItemListComponent
  ]
})
export class EpossOtherReceiptUiOtherReceiptItemListModule {}
