import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeVersionComponent } from './upgrade-version/upgrade-version.component';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossUpgradeVersionDataAccessUpgradeVersionModule } from '@poss-web/poss/upgrade-version/data-access-upgrade-version';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: UpgradeVersionComponent, pathMatch: 'full' }
    ]),
    PossUpgradeVersionDataAccessUpgradeVersionModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule
  ],
  exports: [UpgradeVersionComponent],
  declarations: [UpgradeVersionComponent]
})
export class PossUpgradeVersionFeatureUpgradeVersionModule {}
