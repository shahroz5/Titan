import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedBodEodFeatureServiceAbstraction } from '@poss-web/shared/models';
import { BodEodFeatureService } from './bod-eod-feature.service';

@NgModule({
  imports: [CommonModule, SharedBodEodDataAccessBodEodModule],
  providers: [
    {
      provide: SharedBodEodFeatureServiceAbstraction,
      useClass: BodEodFeatureService
    }
  ]
})
export class SharedBodEodFeatureBodEodModule {}
