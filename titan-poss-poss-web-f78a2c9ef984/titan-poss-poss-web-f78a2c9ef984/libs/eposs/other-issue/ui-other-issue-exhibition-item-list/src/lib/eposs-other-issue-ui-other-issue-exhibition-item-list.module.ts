import { NgModule } from '@angular/core';
import { ExhibitionIssueItemComponent } from './item/exhibition-issue-item.component';
import { ExhibitionIssueItemListComponent } from './item-list/exhibition-issue-item-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedItemUiItemDetailsModule  } from '@poss-web/shared/item/ui-item-details'
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  declarations: [
    ExhibitionIssueItemComponent,
    ExhibitionIssueItemListComponent
  ],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule,
    SharedUtilFieldValidatorsModule
  ],
  exports: [ExhibitionIssueItemComponent, ExhibitionIssueItemListComponent]
})
export class EpossOtherIssueUiOtherIssueExhibitionItemListModule {}
