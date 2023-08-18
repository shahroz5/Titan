import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AlertPopupServiceAbstraction } from '@poss-web/shared/models';
import { AlertPopupService } from './alert-popup.service';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [AlertPopupComponent],
  entryComponents: [AlertPopupComponent],
  providers: [
    {
      provide: AlertPopupServiceAbstraction,
      useClass: AlertPopupService
    }
  ]
})
export class SharedAlertPopupFeatureAlertPopupModule {}
