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
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-add-printer-popup',
  templateUrl: './add-printer-popup.component.html',
  styleUrls: []
})
export class AddPrinterPopupComponent implements OnDestroy {
  filteredOptions: Observable<string[]>;
  currentDate = moment();
  selectedDateCtrl;
  minDate;
  maxDate;

  typeLabel: string;
  addPrinterForm: FormGroup;

  destroy$: Subject<null> = new Subject<null>();
  fieldTypeLabel: string;
  constructor(
    public dialogRef: MatDialogRef<AddPrinterPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      locationCode: string;
      hostName: string;
      docType: SelectDropDownOption[];
      printerName: SelectDropDownOption[];
    },
    private translateService: TranslateService,

    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.addPrinterForm = new FormGroup({
      locationCode: new FormControl(
        { value: this.data.locationCode, disabled: true },
        [this.fieldValidatorsService.requiredField('Location Code')]
      ),
      hostName: new FormControl({ value: this.data.hostName, disabled: true }, [
        this.fieldValidatorsService.requiredField('Host Name')
      ]),

      docType: new FormControl('', [
        this.fieldValidatorsService.requiredField('Doc Type')
      ]),
      printerName: new FormControl('', [
        this.fieldValidatorsService.requiredField('Printer Name')
      ])
    });
  }



  addPrinter() {
    const printer: PrinterConfigDetails = {
      documentType: this.addPrinterForm.get('docType').value,
      hostname: this.addPrinterForm.get('hostName').value,
      locationCode: this.addPrinterForm.get('locationCode').value,
      printerName: this.addPrinterForm.get('printerName').value
    };
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
