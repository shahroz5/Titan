import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { InvoiceResult, Report } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-documents-search-list',
  templateUrl: './documents-search-list.component.html',
  styleUrls: ['./documents-search-list.component.scss']
})
export class DocumentsSearchListComponent implements OnInit {
  @Input() invoiceList: InvoiceResult[] = [];
  @Input() count = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() download = new EventEmitter<InvoiceResult>();

  minPageSize: number;



  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  trackBy(index: number, item: Report) {
    return item.id;
  }
}
