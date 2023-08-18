import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { InvoiceResult } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-documents-search-list-item',
  templateUrl: './documents-search-list-item.component.html',
  styleUrls: ['./documents-search-list-item.component.scss']
})
export class DocumentsSearchListItemComponent implements OnInit {
  @Input() invoice: InvoiceResult;

  @Output() download = new EventEmitter<InvoiceResult>();

  // isCompleted = () => this.report.status === ReportStatus.COMPLETED;
  // isInProgress = () => this.report.status === ReportStatus.IN_PROGRESS;
  // isFailed = () => this.report.status === ReportStatus.FAILED;



  ngOnInit() {
    console.log('REPORT 123 :', this.invoice);
  }

  downloadReport() {
    this.download.emit(this.invoice);
  }
  getDocumentName(documentPath: string): string {
    let documentName = '';
    if (documentPath) {
      const documentNameFirstIndex = documentPath.lastIndexOf('/') + 1;
      documentName = documentPath.substring(documentNameFirstIndex);
    }
    return documentName;
  }
}
