import { NgModule } from '@angular/core';
import {
  ExpansionPanelComponent,
  ExpansionPanelContentComponent,
  ExpansionPanelSummaryComponent
} from './expansion-panel.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  declarations: [
    ExpansionPanelComponent,
    ExpansionPanelSummaryComponent,
    ExpansionPanelContentComponent
  ],
  imports: [CommonCustomMaterialModule],
  exports: [
    ExpansionPanelComponent,
    ExpansionPanelSummaryComponent,
    ExpansionPanelContentComponent
  ]
})
export class SharedComponentsUiExpansionPanelModule {}
