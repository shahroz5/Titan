import {
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  AdjustmentItem,
  BinCode,
  ImageEvent,
  OtherReceiptUpdateAdjustementItemPayload
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-psv-receipt-item-list',
  templateUrl: './psv-receipt-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsvReceiptItemListComponent implements OnDestroy {
  @Input() itemList: AdjustmentItem[];
  @Input() selectionEvents: Observable<boolean>;
  @Input() hasRemove;
  @Input() binGroupCode: string;
  @Input() binCodes: BinCode[];

  @Output() removeItem = new EventEmitter<AdjustmentItem>();
  @Output() selection: EventEmitter<{
    selected: boolean;
    id: number;
  }> = new EventEmitter();
  @Output() updateItem = new EventEmitter<
    OtherReceiptUpdateAdjustementItemPayload
  >();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  destroy$: Subject<null> = new Subject<null>();


  selectionEmit(selection: { selected: boolean; id: number }) {
    this.selection.emit(selection);
  }
  updateItems(item: OtherReceiptUpdateAdjustementItemPayload) {
    this.updateItem.emit(item);
  }
  remove(item: AdjustmentItem) {
    this.removeItem.emit(item);
  }
  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
