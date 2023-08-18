import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
const route: Routes = [{ path: '', component: ConfigurationHomeComponent }];
import { ConfigurationHomeComponent } from './configuration-home/configuration-home.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiCardMenuModule
  ],
  declarations: [ConfigurationHomeComponent]
})
export class PossConfigurationHomeFeatureConfigurationHomeModule {}
