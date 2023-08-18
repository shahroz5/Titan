import {
  Component,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SignaturePadComponent } from '@poss-web/shared/components/ui-signature-pad';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { DigitalSignatureFacade } from '@poss-web/poss/digital-signature/data-access-digital-signature';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
//import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
//import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';

@Component({
  selector: 'poss-web-cashier-signature',
  templateUrl: './cashier-signature.component.html',
  styleUrls: ['./cashier-signature.component.scss']
})
export class CashierSignatureComponent implements OnChanges, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  form: FormGroup;
  sign;
  showSignatureError = false;

  @Input() disableSignaturePad = false;
  @Input() cashierDigitalSignature = '';
  @Input() clearSignaturePad = false;

  @ViewChild(SignaturePadComponent) signaturePad: SignaturePadComponent;

  @Output() signatureEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    fb: FormBuilder,
    public router: Router,
    private dialog: MatDialog
  ) {
    this.form = fb.group({
      cashierSignatureField: ['', Validators.required]
    });
  }

  ngOnChanges(): void {
    if (this.clearSignaturePad) {
      this.clear();
    }
  }

  viewAvailableSignature() {
    this.dialog.open(FilePreviewComponent, {
      // height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.cashierDigitalSignature,
        imageUrl: this.cashierDigitalSignature,
        previewHeader: 'Cashier Signature',
        type: 'DIGITAL_SIGNATURE'
      }
    });
  }

  submit() {
    this.showSignatureError = false;

    this.sign = this.signaturePad.signature;

    this.cashierDigitalSignature = this.signaturePad.signature;

    this.signatureEmit.emit(this.sign);

    console.log('CashierDigitalSignature :', this.cashierDigitalSignature);
  }

  clear() {
    this.signaturePad.clear();
    this.sign = null;
  }

  undo() {
    this.signaturePad.undo();
    this.sign = null;
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
