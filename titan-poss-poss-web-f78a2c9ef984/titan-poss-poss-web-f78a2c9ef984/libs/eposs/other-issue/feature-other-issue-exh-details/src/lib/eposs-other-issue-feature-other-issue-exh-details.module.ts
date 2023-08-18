import { NgModule } from '@angular/core';
import { ExhibitionIssueDetailsComponent } from './exhibition-issue-details.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { EpossOtherIssueUiOtherIssueExhibitionItemListModule } from '@poss-web/eposs/other-issue/ui-other-issue-exhibition-item-list';
import { EpossOtherIssueDataAccessOtherIssueModule } from '@poss-web/eposs/other-issue/data-access-other-issue';
import { SharedComponentsUiExpansionPanelModule } from '@poss-web/shared/components/ui-expansion-panel';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

const routes: Routes = [
  {
    path: '',
    component: ExhibitionIssueDetailsComponent
  }
];
@NgModule({
  declarations: [ExhibitionIssueDetailsComponent],
  imports: [
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,

    //loading standard route module from angular
    RouterModule.forChild(routes),

    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,
    SharedComponentsUiExpansionPanelModule,
    SharedComponentsUiFormattersModule,

    EpossOtherIssueUiOtherIssueExhibitionItemListModule,
    EpossOtherIssueDataAccessOtherIssueModule,
    SharedUtilFieldValidatorsModule
  ]
})
export class EpossOtherIssueFeatureOtherIssueExhDetailsModule {}
