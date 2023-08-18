import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FtepApprovalConfig } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-ftep-approval-config-list-items',
  templateUrl: './ftep-approval-config-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FtepApprovalConfigListItemsComponent implements OnInit {
  @Input() ftepApprovalConfigList: FtepApprovalConfig[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  minPageSize: number;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() ruleId = new EventEmitter<{ ruleId; ruleType }>();
  @Output() toggleValue = new EventEmitter<FtepApprovalConfig>();
  @Output() openViewPage = new EventEmitter<{ ruleId; ruleType }>();


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  edit(event) {
    this.ruleId.emit(event);
  }
  change(event) {
    this.toggleValue.emit(event);
  }
  trackBy(_: number, item: FtepApprovalConfig) {
    return item.ruleId;
  }
  viewMode($event) {
    this.openViewPage.emit($event);
  }
}
