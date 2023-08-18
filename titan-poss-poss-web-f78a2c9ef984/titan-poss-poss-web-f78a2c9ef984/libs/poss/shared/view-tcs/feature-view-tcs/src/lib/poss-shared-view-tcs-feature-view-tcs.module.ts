import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { ViewTcsServiceAbstraction } from '@poss-web/shared/models';
import { ViewTcsService } from './view-tcs/view-tcs.service';
import { PossSharedViewTcsDataAccessViewTcsModule } from '@poss-web/poss/shared/view-tcs/data-access-view-tcs';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { ViewTcsComponent } from './view-tcs/view-tcs.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiLoaderModule,
    PossSharedViewTcsUiViewTcsModule,
    PossSharedViewTcsDataAccessViewTcsModule
  ],
  declarations: [ViewTcsComponent],
  entryComponents: [ViewTcsComponent],
  exports: [ViewTcsComponent],
  providers: [
    {
      provide: ViewTcsServiceAbstraction,
      useClass: ViewTcsService
    }
  ]
})
export class PossSharedViewTcsFeatureViewTcsModule {}
