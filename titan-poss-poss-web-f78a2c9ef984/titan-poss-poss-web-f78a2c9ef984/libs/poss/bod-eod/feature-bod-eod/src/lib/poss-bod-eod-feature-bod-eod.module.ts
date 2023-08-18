import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossBodEodDataAccessBodEodModule } from '@poss-web/poss/bod-eod/data-access-bod-eod';
import { PossBodEodUiBodProcessModule } from '@poss-web/poss/bod-eod/ui-bod-process';
import { PossBodEodUiEodProcessModule } from '@poss-web/poss/bod-eod/ui-eod-process';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { BodEodProcessService } from './bod-eod-process.service';
import { BodEodComponent } from './bod-eod/bod-eod.component';

const routes: Routes = [
  {
    path: '',
    component: BodEodComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    PossBodEodUiBodProcessModule,
    PossBodEodUiEodProcessModule,
    PossBodEodDataAccessBodEodModule,
    SharedComponentsUiLoaderModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  declarations: [BodEodComponent],
  providers: [BodEodProcessService]
})
export class PossBodEodFeatureBodEodModule {}
