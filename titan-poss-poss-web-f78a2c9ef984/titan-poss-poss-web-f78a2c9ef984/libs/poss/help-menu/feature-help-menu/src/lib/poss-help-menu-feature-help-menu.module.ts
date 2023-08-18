import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpMenuComponent } from './help-menu/help-menu.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsUiCardMenuModule } from '@poss-web/shared/components/ui-card-menu';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
const route: Routes = [
  { path: '', component: HelpMenuComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HelpMenuComponent, pathMatch: 'full' }
    ]),
    CommonCustomMaterialModule,
    SharedComponentsUiCardMenuModule
  ],
  declarations: [HelpMenuComponent]
})
export class PossHelpMenuFeatureHelpMenuModule {}
