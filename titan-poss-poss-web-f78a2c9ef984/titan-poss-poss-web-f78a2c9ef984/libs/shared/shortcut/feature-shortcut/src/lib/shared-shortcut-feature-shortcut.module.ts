import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortcutInfoPopupComponent } from './shortcut-info-popup/shortcut-info-popup.component';
import { ShortcutService } from './shortcut.service';
import { ShortcutServiceAbstraction } from '@poss-web/shared/models';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { FillRowsPipe } from './fill-rows.pipe';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ShortcutInfoPopupComponent, FillRowsPipe],
  entryComponents: [ShortcutInfoPopupComponent],
  providers: [
    {
      provide: ShortcutServiceAbstraction,
      useClass: ShortcutService
    }
  ]
})
export class SharedShortcutFeatureShortcutModule {}
