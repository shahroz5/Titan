import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CnPriorityConfig } from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-cn-priority-config-items',
  templateUrl: './cn-priority-config-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnPriorityConfigItemsComponent implements OnInit {
  @Input() cnPriorityConfigList: CnPriorityConfig[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  minPageSize: number;
  @Input() permissions$: Observable<any[]>;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() configId = new EventEmitter<{ configId; isActive }>();
  @Output() viewMode = new EventEmitter<{ configId; isActive }>();
  @Output() toggleValue = new EventEmitter<CnPriorityConfig>();


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  edit(event) {
    this.configId.emit(event);
  }

  view(event) {
    this.viewMode.emit(event);
  }
  change(event) {
    this.toggleValue.emit(event);
  }
  trackBy(_: number, item: CnPriorityConfig) {
    return item.configId;
  }
}
