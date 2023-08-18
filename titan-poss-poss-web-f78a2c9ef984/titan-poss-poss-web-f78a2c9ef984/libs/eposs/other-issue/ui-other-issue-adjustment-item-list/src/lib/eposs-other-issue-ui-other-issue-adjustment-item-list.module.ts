import { NgModule } from '@angular/core';
import { AdjsutmentIssueItemComponent } from './item/adjsutment-issue-item.component';
import { AdjsutmentIssueItemListComponent } from './item-list/adjsutment-issue-item-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import {SharedComponentsUiFormFieldControlsModule} from '@poss-web/shared/components/ui-form-field-controls';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  declarations: [
    AdjsutmentIssueItemComponent,
    AdjsutmentIssueItemListComponent
  ],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule,
    SharedUtilFieldValidatorsModule

  ],
  exports: [AdjsutmentIssueItemComponent, AdjsutmentIssueItemListComponent]
})
export class EpossOtherIssueUiOtherIssueAdjustmentItemListModule {}
