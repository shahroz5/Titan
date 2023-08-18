import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
  InterBoutiqueTransferRequestTypesEnum,
  InterBoutiqueTransferStatusTypesEnum,
  ItemList,
  IsSelectedData,
  IsSelectedItemCode,
  IsSelectedItem,
  ImageEvent
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-inter-boutique-transfer-item-list',
  templateUrl: './inter-boutique-transfer-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterBoutiqueTransferItemListComponent
  implements OnDestroy {
  @Input() itemList$: Observable<ItemList[]>;
  @Input() isHistory = false;
  @Input() requestType: string;
  @Input() selectedRequestStatus: string;
  @Input() selectedItemCodeEvents: Observable<IsSelectedItemCode>;
  @Input() dateFormat$: Observable<string>;
  @Output() isSelected = new EventEmitter<IsSelectedData>();
  @Output() isSelectedItem = new EventEmitter<IsSelectedItem>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  interBoutiqueTransferRequestTypesEnumRef = InterBoutiqueTransferRequestTypesEnum;
  interBoutiqueTransferStatusTypesEnumRef = InterBoutiqueTransferStatusTypesEnum;
  status: string;
  statusColor: string;

  selectedItemCode$: Subject<IsSelectedItemCode> = new Subject<
    IsSelectedItemCode
  >();
  destroy$: Subject<null> = new Subject<null>();



  /**
   * gets triggered when any change happens in check box field
   * @param event
   */
  isSelectedChange(event: IsSelectedData) {
    this.isSelected.emit(event);
  }

  isSelectedItemChange(event: IsSelectedItem) {
    this.isSelectedItem.emit(event);
  }

  trackBy(index: number, item: ItemList) {
    return item.id;
  }

  loadImageUrl(event) {
    this.loadImageEvent.emit(event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
