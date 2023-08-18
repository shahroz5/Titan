import { BinToBinTransferService } from './bin-to-bin-transfer.service';
import { BinToBinTransferFacade } from './+state/bin-to-bin-transfer.facade';
import { BinToBinTransferEffect } from './+state/bin-to-bin-transfer.effect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { binToBinTransferFeatureKey } from './+state/bin-to-bin-transfer.state';
import { BinToBinTransferReducer } from './+state/bin-to-bin-transfer.reducer';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(binToBinTransferFeatureKey, BinToBinTransferReducer),
    EffectsModule.forFeature([BinToBinTransferEffect])
  ],
  providers: [BinToBinTransferFacade, BinToBinTransferService]
})
export class EpossBinBinTransferDataAccessBinBinTransferModule {}
