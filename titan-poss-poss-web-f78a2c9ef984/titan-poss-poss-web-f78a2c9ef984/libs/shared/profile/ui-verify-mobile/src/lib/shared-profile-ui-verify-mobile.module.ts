import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ValidateMobileChangeOTPComponent } from './validate-mobile-change-otp.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ValidateMobileChangeOTPComponent],
  entryComponents: [ValidateMobileChangeOTPComponent]
})
export class SharedProfileUiVerifyMobileModule {}
