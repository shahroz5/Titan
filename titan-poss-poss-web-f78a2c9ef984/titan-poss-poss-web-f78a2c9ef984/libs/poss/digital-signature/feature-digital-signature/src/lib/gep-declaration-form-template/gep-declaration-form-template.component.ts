import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import {
  InvoiceDeliveryTypes,
  PrintingServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  printTransactionTypesEnum
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-gep-declaration-form-template',
  templateUrl: './gep-declaration-form-template.component.html'
})
export class GepDeclarationFormTemplateComponent implements OnInit {
  declarationFormGroup: FormGroup;
  customerSignature = '';
  isGepForm: boolean;
  moment = moment;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public printingService: PrintingServiceAbstraction,
    private dialogRef: MatDialogRef<GepDeclarationFormTemplateComponent>
  ) {
    this.declarationFormGroup = new FormGroup({
      customerName: new FormControl(''),
      mobileNumber: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.customerSignature = this.data.customerSignature;
    const findTepForm = JSON.parse(
      this.data.customerDetailsForDigitalSignature.applicableTransactionTypes
    );
    this.isGepForm = findTepForm.data.isGEPDeclarationAndExchangeForm;
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
      printType: 'GEP_DIGITAL_SIGNATURE',
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      customerId: this.data.customerId,
      transacionId: customerDocumentTxnId.data.gepDeclarationTxnId,
      reprint: true,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });
  }

  close() {
    this.dialogRef.close(null);
  }
}
