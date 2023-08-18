import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Report } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-ui-report-list',
  templateUrl: './report-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportListComponent implements OnInit {
  @Input() reports: Report[] = [];
  @Input() count = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() download = new EventEmitter<string>();

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
