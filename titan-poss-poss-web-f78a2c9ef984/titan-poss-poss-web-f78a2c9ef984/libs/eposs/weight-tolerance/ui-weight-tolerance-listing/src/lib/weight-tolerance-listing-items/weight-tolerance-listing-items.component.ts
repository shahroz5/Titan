import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { ConfigDetails } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-weight-tolerance-listing-items',
  templateUrl: './weight-tolerance-listing-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightToleranceListingItemsComponent implements OnInit {
  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() configList: ConfigDetails[];
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() loadSelectedConfigIdView = new EventEmitter<string>();
  @Output() loadSelectedConfigId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<{
    isActive: boolean;
    configId: string;
  }>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  destroy$ = new Subject<null>();

  emitSelectedToleranceIdView(configId: any) {
    this.loadSelectedConfigIdView.emit(configId);
  }
  emitSelectedToleranceId(configId: any) {
    this.loadSelectedConfigId.emit(configId);
  }
  ngOnInit() {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  emitToggle(toggleValue) {
    this.toggleValue.emit(toggleValue);
  }

  trackBy(index: number, item: ConfigDetails) {
    return item.configId;
  }
}
