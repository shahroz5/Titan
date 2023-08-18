import { Component, Input } from '@angular/core';
import { TcsList } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-view-tcs-popup',
  templateUrl: './view-tcs-popup.component.html',
  styleUrls: ['./view-tcs-popup.component.scss']
})
export class ViewTcsPopupComponent {
  @Input() tcsDetail: TcsList[];
  columnDetails: string[] = [
    'slNo',
    'brandCode',
    'ownerType',
    'locationCode',
    'docNo',
    'transactionDate',
    'fiscalYear',
    'netInvoiceValue',
    'tcsApplicableAmount',
    'tcsPercentage',
    'tcsAmountPaid'
  ];


}
