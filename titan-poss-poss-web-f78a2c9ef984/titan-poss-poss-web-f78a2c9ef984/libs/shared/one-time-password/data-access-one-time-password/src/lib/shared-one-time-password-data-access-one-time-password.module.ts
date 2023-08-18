import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneTimePasswordService } from './one-time-password.service';

@NgModule({
  imports: [CommonModule],
  providers: [OneTimePasswordService]
})
export class SharedOneTimePasswordDataAccessOneTimePasswordModule {}
