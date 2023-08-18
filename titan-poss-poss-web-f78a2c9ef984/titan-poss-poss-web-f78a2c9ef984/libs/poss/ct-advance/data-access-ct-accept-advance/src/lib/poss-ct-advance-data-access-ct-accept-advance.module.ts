import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { CtAcceptAdvanceReducer, ctAcceptAdvanceFeatureKey } from './+state/ct-accept-advance.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CtAcceptAdvanceEffects} from './+state/ct-accept-advance.effects';
import { CtAcceptAdvanceFacade } from './+state/ct-accept-advance.facade';
import { CtAcceptAdvanceService } from './ct-accept-advance.service';

@NgModule({
  imports: [CommonModule,
    StoreModule.forFeature(
      ctAcceptAdvanceFeatureKey,
      CtAcceptAdvanceReducer
    ),
    EffectsModule.forFeature([CtAcceptAdvanceEffects])],
  providers: [CtAcceptAdvanceFacade, CtAcceptAdvanceService]
})
export class PossCtAdvanceDataAccessCtAcceptAdvanceModule {}
