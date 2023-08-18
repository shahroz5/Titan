import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { UpgradeVersionKey } from './+state/upgrade-version.state';
import { UpgradeVersionReducer } from './+state/upgrade-version.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UpgradeVersionFacade } from './+state/upgrade-version.facade';
import { UpgradeVersionService } from './upgrade-version.service';
import { UpgradeVersionEffects } from './+state/upgrade-version.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(UpgradeVersionKey, UpgradeVersionReducer),
    EffectsModule.forFeature([UpgradeVersionEffects])
  ],
  providers: [UpgradeVersionFacade, UpgradeVersionService]
})
export class PossUpgradeVersionDataAccessUpgradeVersionModule {}
