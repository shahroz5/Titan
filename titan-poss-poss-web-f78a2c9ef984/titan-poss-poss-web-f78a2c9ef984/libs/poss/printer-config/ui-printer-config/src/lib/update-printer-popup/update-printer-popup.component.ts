import {
  Component,
  Inject,
  OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  PrinterConfigDetails,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-update-printer-popup',
  templateUrl: './update-printer-popup.component.html',
  styleUrls: []
})
export class UpdatePrinterPopupComponent implements OnDestroy {
  filteredOptions: Observable<string[]>;

  typeLabel: string;
  updatePrinterForm: FormGroup;

  amountLabel: string;
  destroy$: Subject<null> = new Subject<null>();
  fieldTypeLabel: string;
  constructor(
    public dialogRef: MatDialogRef<UpdatePrinterPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      printer: PrinterConfigDetails;

      printerNames: SelectDropDownOption[];
    },
    private translateService: TranslateService,

    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.updatePrinterForm = new FormGroup({
      locationCode: new FormControl(
        { value: this.data.printer.locationCode, disabled: true },
        [this.fieldValidatorsService.requiredField('Location Code')]
      ),
      hostName: new FormControl(
        { value: this.data.printer.hostname, disabled: true },
        [this.fieldValidatorsService.requiredField('Host Name')]
      ),

      docType: new FormControl(
        { value: this.data.printer.documentType, disabled: true },
        [this.fieldValidatorsService.requiredField('Doc Type')]
      ),
      printerName: new FormControl('', [
        this.fieldValidatorsService.requiredField('Printer Name')
      ])
    });
  }



  updatePrinter() {
    const printer: PrinterConfigDetails = {
      id: this.data.printer.id,
      isActive: this.data.printer.isActive,
      documentType: this.updatePrinterForm.get('docType').value,
      hostname: this.updatePrinterForm.get('hostName').value,
      locationCode: this.updatePrinterForm.get('locationCode').value,
      printerName: this.updatePrinterForm.get('printerName').value
    };

    console.log(printer);

    this.dialogRef.close(printer);
  }

  close() {
    this.dialogRef.close(null);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
