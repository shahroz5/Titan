import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { GrnApprovalConfig } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
@Component({
  selector: 'poss-web-grn-approval-config-list-items',
  templateUrl: './grn-approval-config-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrnApprovalConfigListItemsComponent implements OnInit {
  @Input() grnApprovalConfigList: GrnApprovalConfig[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  minPageSize: number;
  @Input() permissions$: Observable<any[]>;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() ruleId = new EventEmitter<{ ruleId; ruleType }>();
  @Output() view = new EventEmitter<{ ruleId; ruleType }>();
  @Output() toggleValue = new EventEmitter<GrnApprovalConfig>();


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  edit(event) {
    this.ruleId.emit(event);
  }

  viewMode(event) {
    this.view.emit(event);
  }
  change(event) {
    this.toggleValue.emit(event);
  }
  trackBy(_: number, item: GrnApprovalConfig) {
    return item.ruleId;
  }
}
