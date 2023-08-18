import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import {
  InvoiceDeliveryTypes,
  PrintingServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  printTransactionTypesEnum,
  printTypesEnum
} from '@poss-web/shared/models';
import { PrintingService } from '@poss-web/shared/printing/data-access-printing';

@Component({
  selector: 'poss-web-tep-declaration-form-template',
  templateUrl: './tep-declaration-form-template.component.html'
})
export class TepDeclarationFormTemplateComponent implements OnInit {
  declarationFormGroup: FormGroup;
  customerSignature = '';
  isTepForm: boolean;
  moment = moment;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public printingService: PrintingServiceAbstraction,
    private dialogRef: MatDialogRef<TepDeclarationFormTemplateComponent>
  ) {
    this.declarationFormGroup = new FormGroup({
      customerName: new FormControl(''),
      mobileNumber: new FormControl('')
    });
  }

  ngOnInit(): void {
    const findTepForm = JSON.parse(
      this.data.customerDetailsForDigitalSignature.applicableTransactionTypes
    );
    this.isTepForm = findTepForm.data.isTEPDeclarationAndExchangeForm;
    this.customerSignature = this.data.customerSignature;
    this.declarationFormGroup
      .get('customerName')
      .setValue(this.data.customerName);
    this.declarationFormGroup
      .get('mobileNumber')
      .setValue(this.data.mobileNumber);
    // this.declarationFormGroup.disable();
    this.declarationFormGroup.updateValueAndValidity();
  }

  print() {
    const customerDocumentTxnId = JSON.parse(
      this.data.customerDetailsForDigitalSignature.customerDocumentTxnId
    );
    this.printingService.loadPrintData({
      printType: 'TEP_DIGITAL_SIGNATURE',
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      customerId: this.data.customerId,
      transacionId: customerDocumentTxnId.data.tepDeclarationTxnId,
      reprint: true,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });
  }

  close() {
    this.dialogRef.close(null);
  }
}
