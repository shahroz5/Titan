import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { BgrConfigDetails } from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-bgr-config-items',
  templateUrl: './bgr-config-items.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgrConfigItemsComponent implements OnInit {
  @Input() bgrConfigListing: BgrConfigDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];

  @Output() bgrConfigRuleId = new EventEmitter<string>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<{
    isActive: boolean;
    ruleId: number;
    ruleType: string;
  }>();
  @Output() viewPage = new EventEmitter<string>();
  @Input() permissions$: Observable<any[]>;

  minPageSize = 0;
  pageSizeOptions: number[] = [];

  ngOnInit() {
    this.pageSizeOptions = this.pageSize;

    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  emitId($event: string) {
    this.bgrConfigRuleId.emit($event);
  }

  emitToggle($event: any) {
    this.emitToggleValue.emit($event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
