import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdjsutmentIssueDetailsComponent } from './adjsutment-issue-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import {
  SharedItemUiItemSearchModule,
} from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { EpossOtherIssueDataAccessOtherIssueModule } from '@poss-web/eposs/other-issue/data-access-other-issue';
import { EpossOtherIssueUiOtherIssueAdjustmentItemListModule } from '@poss-web/eposs/other-issue/ui-other-issue-adjustment-item-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

const routes: Routes = [
  {
    path: '',
    component: AdjsutmentIssueDetailsComponent
  }
];
@NgModule({
  declarations: [AdjsutmentIssueDetailsComponent],
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

    EpossOtherIssueUiOtherIssueAdjustmentItemListModule,
    EpossOtherIssueDataAccessOtherIssueModule,
    SharedUtilFieldValidatorsModule
  ]
})
export class EpossOtherIssueFeatureOtherIssueAdjDetailsModule {}
