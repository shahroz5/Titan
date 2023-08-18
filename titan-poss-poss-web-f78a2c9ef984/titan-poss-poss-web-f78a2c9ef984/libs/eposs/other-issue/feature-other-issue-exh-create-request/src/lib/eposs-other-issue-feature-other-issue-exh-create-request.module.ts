import { NgModule } from '@angular/core';
import { ExhibitionIssueCreateDetailsComponent } from './exhibition-issue-create-details.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { EpossOtherIssueUiOtherIssueExhibitionCreateItemListModule } from '@poss-web/eposs/other-issue/ui-other-issue-exhibition-create-item-list';
import { EpossOtherIssueDataAccessOtherIssueModule } from '@poss-web/eposs/other-issue/data-access-other-issue';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

const routes: Routes = [
  {
    path: '',
    component: ExhibitionIssueCreateDetailsComponent
  }
];
@NgModule({
  declarations: [ExhibitionIssueCreateDetailsComponent],
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
    SharedComponentsUiFormFieldControlsModule,

    EpossOtherIssueUiOtherIssueExhibitionCreateItemListModule,
    EpossOtherIssueDataAccessOtherIssueModule,
    SharedUtilFieldValidatorsModule
  ]
})
export class EpossOtherIssueFeatureOtherIssueExhCreateRequestModule {}
