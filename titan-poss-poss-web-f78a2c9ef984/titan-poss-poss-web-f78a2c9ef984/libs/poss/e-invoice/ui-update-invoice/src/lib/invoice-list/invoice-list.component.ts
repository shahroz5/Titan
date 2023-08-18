import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'poss-web-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnChanges {
  @Input() invoices = [];

  defaultColDef = {
    resizable: false,
    suppressMovable: true,
    suppressSizeToFit: true
  };

  failedInvoices = [];
  columnDefs = [];
  domLayout = 'autoHeight';
  constructor() {
    this.columnDefs = [
      {
        headerName: 'Transaction ID',
        flex: 1,
        field: 'id'
      }
    ];
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoices']) {
      this.failedInvoices = [];
      this.invoices?.forEach(element => {
        this.failedInvoices.push({ id: element });
      });

    }
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }
}
