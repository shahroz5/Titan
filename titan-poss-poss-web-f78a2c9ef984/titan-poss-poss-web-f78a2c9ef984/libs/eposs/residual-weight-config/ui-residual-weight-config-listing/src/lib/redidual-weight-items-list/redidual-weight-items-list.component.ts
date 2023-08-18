import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ResidualWeightConfigResponse } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
@Component({
  selector: 'poss-web-redidual-weight-items-list',
  templateUrl: './redidual-weight-items-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedidualWeightItemsListComponent implements OnInit {
  @Input() residualWeightItemList: any[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() permissions$: Observable<any[]>;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<ResidualWeightConfigResponse>();
  @Output() viewPage = new EventEmitter<string>();
  minPageSize: number;

  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  trackBy(index: number, item: any) {
    return item.ruleId;
  }
  change(event) {
    this.toggleValue.emit(event);
  }
  edit(event) {
    this.configId.emit(event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
