import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { StoneTypeDetails } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-stone-type-items',
  templateUrl: './stone-type-items.component.html'
})
export class StoneTypeItemsComponent implements OnDestroy {
  @Input() stoneTypeDetailsList: StoneTypeDetails;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() stoneTypeCode = new EventEmitter<any>();
  @Output() stoneTypeCodeView = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Input() minPageSize;
  @Output() toggleEvent = new EventEmitter<any>();


  emitstoneTypeCodeView(stoneTypeCode) {
    this.stoneTypeCodeView.emit(stoneTypeCode);
  }
  emitStoneTypeCode(stoneTypeCode) {
    this.stoneTypeCode.emit(stoneTypeCode);
  }
  emitToggleEvent(event) {
    this.toggleEvent.emit(event);
    console.log('check', event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackBy(index: number, item: StoneTypeDetails) {
    return item.stoneTypeCode;
  }
}
