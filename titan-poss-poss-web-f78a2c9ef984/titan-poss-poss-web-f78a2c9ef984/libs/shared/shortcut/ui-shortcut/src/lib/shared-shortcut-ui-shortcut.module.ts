import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortcutPanelComponent } from './shortcut-panel/shortcut-panel.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ShortcutPanelComponent],
  exports: [ShortcutPanelComponent]
})
export class SharedShortcutUiShortcutModule {}
