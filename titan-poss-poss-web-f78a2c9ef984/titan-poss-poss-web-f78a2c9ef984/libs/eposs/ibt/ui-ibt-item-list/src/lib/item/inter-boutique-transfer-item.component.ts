import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import {
  InterBoutiqueTransferRequestTypesEnum,
  InterBoutiqueTransferStatusTypesEnum,
  ItemList,
  IsSelectedData,
  IsSelectedItemCode,
  IsSelectedItem,
  ItemData,
  ImageEvent
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-inter-boutique-transfer-item',
  templateUrl: './inter-boutique-transfer-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterBoutiqueTransferItemComponent implements OnInit, OnDestroy {
  @Input() item: ItemList;
  @Input() selectedItemCodeEvents: Observable<IsSelectedItemCode>;
  @Input() selectedRequestStatus: string;
  @Input() dateFormat: string;

  @Output() isSelected = new EventEmitter<IsSelectedData>();
  @Output() isSelectedItem = new EventEmitter<IsSelectedItem>();
  @Output() loadImageEvent = new EventEmitter<ImageEvent>();

  interBoutiqueTransferRequestTypesEnumRef = InterBoutiqueTransferRequestTypesEnum;
  interBoutiqueTransferStatusTypesEnumRef = InterBoutiqueTransferStatusTypesEnum;

  itemForm: FormGroup;
  weightToDisplay: string;
  quantityToDisplay: number;
  requestId: number;
  requestType: string;
  disabled: boolean;
  status: string;
  statusColor: string;
  itemData: ItemData;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.requestId = this.activatedRoute.snapshot.params['requestId'];
    this.requestType = this.activatedRoute.snapshot.params['requestType'];

    this.itemData = {
      itemCode: this.item.itemCode,
      lotNumber: this.item.lotNumber,
      productGroup: this.item.productGroupDesc,
      productCategory: this.item.productCategoryDesc,
      stdValue: this.item.stdValue,
      stdWeight: this.item.stdWeight,
      currencyCode: this.item.currencyCode,
      weightUnit: this.item.weightUnit,
      imageURL: this.item.imageURL,
      thumbnailURL: this.item.thumbnailImageURL,
      mfgDate: this.item.mfgDate,
      isStudded: this.item.isStudded,
      isHallmarked:
        this.item?.itemDetails?.data?.isHallMarking === 'true' ||
        this.item?.itemDetails?.data?.isHallMarking === true
          ? true
          : false,
      isLoadingImage: this.item.isLoadingImage,
      isLoadingThumbnailImage: this.item.isLoadingThumbnailImage,
      taxDetails: this.item?.taxDetails ? this.item.taxDetails : null,
    };

    if (this.item.requestedQuantity > this.item.availableQuantity) {
      this.quantityToDisplay = this.item.acceptedQuantity
        ? this.item.acceptedQuantity
        : this.item.availableQuantity;
    } else {
      this.quantityToDisplay = this.item.acceptedQuantity
        ? this.item.acceptedQuantity
        : this.item.requestedQuantity;
    }
    this.weightToDisplay = this.item.requestedWeight.toFixed(3);

    this.itemForm = this.createForm();

    if (
      this.requestType === InterBoutiqueTransferRequestTypesEnum.RECEIVED &&
      this.item.availableQuantity === 0
    ) {
      this.itemForm.disable();
      this.disabled = true;
    }
    if (
      (this.item.status === InterBoutiqueTransferStatusTypesEnum.ACCEPTED ||
        this.item.status === InterBoutiqueTransferStatusTypesEnum.APPROVED) &&
      this.selectedRequestStatus ===
        InterBoutiqueTransferStatusTypesEnum.REQUESTED &&
      this.requestType === InterBoutiqueTransferRequestTypesEnum.RECEIVED
    ) {
      this.itemForm.patchValue({ isSelected: true });
      this.isSelectedItem.emit({
        itemId: this.item.id,
        itemCode: this.item.itemCode
      });
    }

    this.selectedItemCodeEvents
      .pipe(debounceTime(10), takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.itemId === this.item.id) {
          this.itemForm.patchValue({ isSelected: data.isSelected });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.itemData = {
        ...this.itemData,
        imageURL: this.item.imageURL,
        thumbnailURL: this.item.thumbnailImageURL,
        isLoadingImage: this.item.isLoadingImage,
        isLoadingThumbnailImage: this.item.isLoadingThumbnailImage
      };
    }
  }

  /**
   * gets triggered when any change happens in select item check box
   */
  isSelectedChange(): void {
    const isSelectedData = {
      itemId: this.item.id,
      isSelected: this.itemForm.value.isSelected,
      itemCode: this.item.itemCode,
      quantity: this.itemForm.value.requestedQuantity
    };
    this.isSelected.emit(isSelectedData);
  }

  /**
   * form for quantity and check box
   * @param item: item received
   */
  createForm(): FormGroup {
    return new FormGroup({
      requestedQuantity: new FormControl(this.quantityToDisplay),
      isSelected: new FormControl(false)
    });
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  getStatusDisplay(status: string): boolean {
    switch (status) {
      case InterBoutiqueTransferStatusTypesEnum.ACCEPTED:
      case InterBoutiqueTransferStatusTypesEnum.APPROVED:
      case InterBoutiqueTransferStatusTypesEnum.APVL_PENDING:
      case InterBoutiqueTransferStatusTypesEnum.ISSUED:
        return true;
      case InterBoutiqueTransferStatusTypesEnum.REQUESTED:
      case InterBoutiqueTransferStatusTypesEnum.ACPT_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.APVL_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.ISSUE_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.CANCELLED:
      case InterBoutiqueTransferStatusTypesEnum.EXPIRED:
      case InterBoutiqueTransferStatusTypesEnum.CLOSED:
        return false;
      default:
        return false;
    }
  }

  getErrorMsgDisplay(status: string): boolean {
    switch (status) {
      case InterBoutiqueTransferStatusTypesEnum.REQUESTED:
      case InterBoutiqueTransferStatusTypesEnum.ACCEPTED:
      case InterBoutiqueTransferStatusTypesEnum.APPROVED:
      case InterBoutiqueTransferStatusTypesEnum.APVL_PENDING:
        return true;

      case InterBoutiqueTransferStatusTypesEnum.ACPT_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.APVL_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.ISSUE_REJECTED:
      case InterBoutiqueTransferStatusTypesEnum.CANCELLED:
      case InterBoutiqueTransferStatusTypesEnum.EXPIRED:
      case InterBoutiqueTransferStatusTypesEnum.ISSUED:
      case InterBoutiqueTransferStatusTypesEnum.CLOSED:
        return false;
      default:
        return false;
    }
  }

  loadImage() {
    this.loadImageEvent.emit({
      id: this.item.id,
      imageUrl: this.item.imageURL
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
