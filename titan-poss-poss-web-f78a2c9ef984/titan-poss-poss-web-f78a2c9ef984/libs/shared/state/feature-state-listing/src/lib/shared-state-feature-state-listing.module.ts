import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { StateListingComponent } from './state-listing.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedStateUiStateListModule } from '@poss-web/shared/state/ui-state-list';
import { SharedStateDataAccessStateModule } from '@poss-web/shared/state/data-access-state';
import { SharedStateUiStateViewModule } from '@poss-web/shared/state/ui-state-view';
import {
  SharedStateUiStateDetailModule,
  StateDetailsComponent
} from '@poss-web/shared/state/ui-state-detail';

const route = [
  { path: '', component: StateListingComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [StateListingComponent],
  imports: [
    CommonModule,
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedStateUiStateListModule,
    SharedStateDataAccessStateModule,
    SharedStateUiStateDetailModule,
    SharedStateUiStateViewModule
  ],
  entryComponents: [StateDetailsComponent]
})
export class SharedStateFeatureStateListingModule {}
