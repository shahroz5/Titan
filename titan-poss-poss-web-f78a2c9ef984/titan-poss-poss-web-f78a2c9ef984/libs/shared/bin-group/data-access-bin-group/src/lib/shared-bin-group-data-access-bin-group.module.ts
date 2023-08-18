import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinGroupReducer, BINGROUP_FEATURE_KEY } from './+state/bin-group.reducer';
import { BinGroupEffect } from './+state/bin-group.effect';
import { BinGroupFacade } from './+state/bin-group.facade';
import { BinGroupService } from './bin-group.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [CommonModule,
    StoreModule.forFeature(BINGROUP_FEATURE_KEY, BinGroupReducer),
    EffectsModule.forFeature([BinGroupEffect])],
  providers: [BinGroupFacade, BinGroupService]
})
export class SharedBinGroupDataAccessBinGroupModule { }
