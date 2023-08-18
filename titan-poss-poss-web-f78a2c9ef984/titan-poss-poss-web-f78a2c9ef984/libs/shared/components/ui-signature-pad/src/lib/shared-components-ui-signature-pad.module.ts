import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureCanvasComponent } from './signature-pad/signature-canvas.component';
import { SignaturePadComponent } from './signature-pad/signature-pad.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SignaturePadComponent, SignatureCanvasComponent],
  exports: [SignaturePadComponent]
})
export class SharedComponentsUiSignaturePadModule {}
