import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileComponent } from './user-profile.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [UserProfileComponent],
  exports: [UserProfileComponent]
})
export class SharedProfileUiProfileModule {}
