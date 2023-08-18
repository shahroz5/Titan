import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CnValidation } from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-cn-validation-listing-items',
  templateUrl: './cn-validation-listing-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnValidationListingItemsComponent implements OnInit {
  @Input() cnValidationList: CnValidation[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() permissions$: Observable<any[]>;
  minPageSize: number;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() ruleId = new EventEmitter<{ ruleId; ruleType; isActive }>();
  @Output() view = new EventEmitter<{ ruleId; ruleType; isActive }>();
  @Output() toggleValue = new EventEmitter<CnValidation>();


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
  trackBy(_: number, item: CnValidation) {
    return item.ruleId;
  }
}
