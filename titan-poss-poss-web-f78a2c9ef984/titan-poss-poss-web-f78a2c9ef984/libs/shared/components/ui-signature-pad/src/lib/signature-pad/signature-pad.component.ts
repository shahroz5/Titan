import {
  Component,
  ViewChild,
  forwardRef,
  ElementRef,
  AfterViewInit,
  Input
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SignatureCanvasComponent } from './signature-canvas.component';

@Component({
  selector: 'poss-web-signature-pad',
  templateUrl: 'signature-pad.component.html',
  styleUrls: ['signature-pad.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignaturePadComponent),
      multi: true
    }
  ]
})
export class SignaturePadComponent
  implements ControlValueAccessor, AfterViewInit {
  @Input() disableSignaturePad = false;

  @ViewChild(SignatureCanvasComponent)
  public signatureCanvas: SignatureCanvasComponent;

  @ViewChild('container')
  public container: ElementRef;

  public options: Object = {};

  public _signature: any = null;

  public propagateChange: Function = null;

  get signature(): any {
    return this._signature;
  }

  set signature(value: any) {
    this._signature = value;

    this.propagateChange(this.signature);
  }
  constructor(private eleRef: ElementRef) {}

  public writeValue(value: any): void {
    if (!value) {
      return;
    }
    this._signature = value;
    this.signatureCanvas.fromDataURL(this.signature);
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // no-op
  }

  public drawBegin(): void {
    // no-op
  }

  public drawComplete(): void {
    this.signature = this.signatureCanvas.toDataURL('image/png', 0.5);
  }

  public clear(): void {
    this.signatureCanvas.clear();
    this.signature = '';
  }

  public undo(): void {
    this.signatureCanvas.undo();
    this.drawComplete();
  }

  public ngAfterViewInit() {
    this.beResponsive();
    this.setOptions();
    this.signatureCanvas.clear();
  }

  // set the dimensions of the signature pad canvas
  public beResponsive() {
    this.signatureCanvas.set(
      'canvasWidth',
      this.container.nativeElement.clientWidth
    );
    this.signatureCanvas.set(
      'canvasHeight',
      this.container.nativeElement.clientHeight
    );
  }

  public setOptions() {
    this.signatureCanvas.set('penColor', 'rgb(0, 0, 255)');
    this.signatureCanvas.set('backgroundColor', 'rgb(255, 255, 255)');
  }
}
