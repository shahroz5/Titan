import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-state-list-items',
  templateUrl: './state-list-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateListItemsComponent implements OnDestroy {
  @Input() stateList;
  @Input() count;
  @Input() pageEvent: PageEvent;
  @Input() minPageSize = 0;
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions: number[] = [];

  @Output() stateCodeView = new EventEmitter<any>();
  @Output() stateCode = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<any>();



  emitStateCodeView(regionCode: string) {
    this.stateCodeView.emit(regionCode);
  }

  emitStateCode(regionCode: string) {
    this.stateCode.emit(regionCode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
}
