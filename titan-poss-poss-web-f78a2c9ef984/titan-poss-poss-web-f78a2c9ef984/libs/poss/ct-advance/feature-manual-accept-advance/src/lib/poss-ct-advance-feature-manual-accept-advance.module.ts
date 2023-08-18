import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManualAcceptAdvanceComponent } from './manual-accept-advance/manual-accept-advance.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ManualAcceptAdvanceComponent }
    ])
  ],
  declarations: [ManualAcceptAdvanceComponent],
  exports: [ManualAcceptAdvanceComponent]
})
export class PossCtAdvanceFeatureManualAcceptAdvanceModule {}
