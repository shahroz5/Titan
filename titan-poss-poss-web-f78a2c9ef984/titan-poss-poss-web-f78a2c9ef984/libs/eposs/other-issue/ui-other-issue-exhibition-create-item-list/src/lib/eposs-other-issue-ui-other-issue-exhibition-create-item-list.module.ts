import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { NgModule } from '@angular/core';
import { ExhibitionIssueCreateItemComponent } from './item/exhibition-issue-create-item.component';
import { ExhibitionIssueCreateItemListComponent } from './item-List/exhibition-issue-create-item-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import {SharedComponentsUiFormFieldControlsModule} from '@poss-web/shared/components/ui-form-field-controls';
import {SharedComponentsUiFormattersModule} from '@poss-web/shared/components/ui-formatters';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';


@NgModule({
  declarations: [
    ExhibitionIssueCreateItemComponent,
    ExhibitionIssueCreateItemListComponent
  ],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule,
    SharedComponentsUiFocusableListModule,
    SharedUtilFieldValidatorsModule
  ],
  exports: [
    ExhibitionIssueCreateItemComponent,
    ExhibitionIssueCreateItemListComponent
  ]
})
export class EpossOtherIssueUiOtherIssueExhibitionCreateItemListModule {}
