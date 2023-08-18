import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { WeightValueConfigDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-weight-value-config-items',
  templateUrl: './weight-value-config-items.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightValueConfigItemsComponent implements OnInit {
  @Input() weightValueConfigListing: WeightValueConfigDetails[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];

  @Output() weightValueConfigRuleId = new EventEmitter<string>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() viewPage = new EventEmitter<string>();
  @Output() emitToggleValue = new EventEmitter<{
    isActive: boolean;
    ruleId: number;
  }>();

  minPageSize = 0;
  pageSizeOptions: number[] = [];


  ngOnInit() {
    this.pageSizeOptions = this.pageSize;

    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  emitId($event: string) {
    this.weightValueConfigRuleId.emit($event);
  }

  emitToggle($event: any) {
    this.emitToggleValue.emit($event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
