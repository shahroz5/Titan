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
  OtherReceiptUpdateAdjustementItemPayload,
  BinCode,
  ImageEvent
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-adjustment-receipts-item-list',
  templateUrl: './adjustment-receipts-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdjustmentReceiptsItemListComponent implements  OnDestroy {
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

  selectionAllSubscription: any;
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
