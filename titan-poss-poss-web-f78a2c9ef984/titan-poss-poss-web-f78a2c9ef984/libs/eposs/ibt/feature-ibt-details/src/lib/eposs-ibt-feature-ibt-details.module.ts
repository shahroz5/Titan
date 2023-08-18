import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossIbtUiIbtItemListModule } from '@poss-web/eposs/ibt/ui-ibt-item-list';
import { EpossIbtDataAccessIbtModule } from '@poss-web/eposs/ibt/data-access-ibt';
import { InterBoutiqueTransferDetailsComponent } from './inter-boutique-transfer-details.component';
import { HistoryDetailsComponent } from './history-details/history-details.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
const routes: Routes = [
  {
    path: ':requestType/:actionType/:_requestId',
    component: HistoryDetailsComponent
  },
  {
    path: ':requestType/:_requestId',
    component: InterBoutiqueTransferDetailsComponent
  }
];

@NgModule({
  declarations: [
    InterBoutiqueTransferDetailsComponent,
    HistoryDetailsComponent
  ],
  imports: [
    //loading Angular Material and ngx-translate modules
    CommonModule,
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,

    //loading the app specific shared components
    EpossIbtUiIbtItemListModule,
    EpossIbtDataAccessIbtModule
  ]
})
export class EpossIbtFeatureIbtDetailsModule {}
