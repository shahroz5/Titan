import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EghsOfflineBodPopupComponent } from './eghs-offline-bod-popup/eghs-offline-bod-popup.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [EghsOfflineBodPopupComponent],
  entryComponents: [EghsOfflineBodPopupComponent]
})
export class PossBodEodUiEghsOfflineBodPopupModule {}
