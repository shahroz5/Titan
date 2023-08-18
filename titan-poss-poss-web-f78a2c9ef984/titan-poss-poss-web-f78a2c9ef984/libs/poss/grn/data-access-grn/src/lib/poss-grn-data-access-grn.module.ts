import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GrnEffect } from './+state/grn.effects';
import { grnKey, grnReducer } from './+state/grn.reducer';
import { GrnService } from '../lib/grn.service';
import { GrnFacade } from './+state/grn.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(grnKey, grnReducer),
    EffectsModule.forFeature([GrnEffect])
  ],
  providers: [GrnEffect, GrnService, GrnFacade]
})
export class PossGrnDataAccessGrnModule {}
