import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Subject, Observable } from 'rxjs';
import { debounceTime, takeUntil, take } from 'rxjs/operators';

import {
  RequestList,
  CustomErrors,
  BoutiqueList,
  ItemSummary,
  Request,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  Command,
  ShortcutServiceAbstraction,
  IBTBoutiquesFilterEnum
} from '@poss-web/shared/models';
import { InterBoutiqueTransferFacade } from '@poss-web/eposs/ibt/data-access-ibt';
import {
  getInterBoutiqueTransferRouteUrl,
  getInterBoutiqueTransferDefaultRouteUrl
} from '@poss-web/shared/util-site-routes';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

const searchShortcutKey =
  'InterBoutiqueTransferCreateRequestComponent.MAIN_SEARCH';
const backShortcutKey = 'InterBoutiqueTransferCreateRequestComponent.BACK';
const cardListShortcutKey =
  'InterBoutiqueTransferCreateRequestComponent.CARD_LIST';
const filterShortcutKey = 'InterBoutiqueTransferCreateRequestComponent.FILTER';
const componentName = 'InterBoutiqueTransferCreateRequestComponent';

@Component({
  selector: 'poss-web-inter-boutique-transfer-create-request',
  templateUrl: './inter-boutique-transfer-create-request.component.html',
  styleUrls: ['./inter-boutique-transfer-create-request.component.scss']
})
export class InterBoutiqueTransferCreateRequestComponent
  implements OnInit, AfterViewInit, OnDestroy {
  boutiqueList$: Observable<BoutiqueList[]>;
  boutiqueListCount$: Observable<number>;
  createRequestResponse$: Observable<RequestList>;
  searchItemResponse$: Observable<{
    searchResult: ItemSummary;
    isSearchSuccess: boolean;
  }>;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @ViewChild('clickMenuTrigger')
  clickMenuTrigger: MatMenuTrigger;

  searchForm: FormGroup;
  itemForm: FormGroup;
  itemList: FormArray;
  request: Request;
  boutiqueListCount: number;
  regionType = null;
  checkAvailabilityClick = false;
  filterShow = false;
  filterValue = null;
  filterTranslation = null;
  itemArray = [];

  searchedItems = [''];
  isLoading = false;
  pageSize = 4;
  initalPageSize = 8;
  pageIndex = 0;
  boutiqueListLoadedOnce = true;
  destroy$: Subject<null> = new Subject<null>();

  panelOpenState = false;
  _allExpandState = false;
  IBTBoutiquesFilterEnumRef = IBTBoutiquesFilterEnum;
  productCategory: string;
  productCategoryDescription: string;
  hasNotification = false;
  @ViewChild(CardListComponent)
  cardListComponentRef: CardListComponent;

  validationMessages = {
    quantity: [
      { type: 'required', message: 'Required' },
      { type: 'pattern', message: 'Invalid Quantity' },
      { type: 'max', message: 'Maximum Value must be 5' }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private interBoutiqueTransferFacade: InterBoutiqueTransferFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private shortcutService: ShortcutServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.searchForm = this.formBuilder.group({
      searchValue: [null, this.fieldValidatorsService.itemCodeField('Search')]
    });
    /**
     * creates a form group with form array
     * form array contains array of form groups
     */
    this.itemForm = this.formBuilder.group({
      searchItem: this.formBuilder.array([])
    });
    /**
     * set searchList to the form control containing search
     */
    this.itemList = this.itemForm.get('searchItem') as FormArray;
    this.itemList.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.resetBoutiqueList();
    });
  }

  ngOnInit() {
    this.interBoutiqueTransferFacade.resetRequestList();
    this.componentInit();
    this.shortcutService.componentNames = [componentName]; 
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));

    const filterKey = 'pw.interboutiqueTransfer.filterButtonText';
    this.translate
      .get(filterKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.filterTranslation = translatedMessage;
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.overlayNotification.close();
        const searchValue = this.searchForm
          .get('searchValue')
          .value.toUpperCase()
          .trim();
        if (searchValue !== '') {
          if (this.searchForm.get('searchValue').valid) {
            this.searchItems(searchValue);
          }
        } else if (searchValue === '') {
          this.clearSearch();
        }
      });
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case searchShortcutKey: {
        if (this.searchBox) {
          this.searchBox.nativeElement.focus();
        }
        break;
      }
      case backShortcutKey: {
        this.back();
        break;
      }
      case cardListShortcutKey: {
        if (this.cardListComponentRef) {
          this.cardListComponentRef.focus();
        }
        break;
      }

      case filterShortcutKey: {
        if (this.clickMenuTrigger) {
          this.clickMenuTrigger.openMenu();
        }
        break;
      }
    }
  }

  componentInit() {
    this.searchItemResponse$ = this.interBoutiqueTransferFacade.getSearchItemResponse();
    this.boutiqueList$ = this.interBoutiqueTransferFacade.getBoutiqueList();
    this.boutiqueListCount$ = this.interBoutiqueTransferFacade.getBoutiqueListCount();
    this.createRequestResponse$ = this.interBoutiqueTransferFacade.getCreateRequestResponse();

    this.interBoutiqueTransferFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.interBoutiqueTransferFacade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });

    this.searchItemResponse$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.searchResult !== null && data.isSearchSuccess) {
        if (!this.searchedItems.includes(data.searchResult.itemCode)) {
          this.productCategory = data.searchResult.productCategoryCode;
          this.productCategoryDescription =
            data.searchResult.productCategoryDesc;
          this.itemList.push(this.createItemList(data.searchResult.itemCode));
          this.allExpandState = true;
          this.searchedItems.push(data.searchResult.itemCode);
          this.clearSearch();
        }
      }
    });

    this.boutiqueListCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.boutiqueListCount = count;
        if (
          this.checkAvailabilityClick === true &&
          count !== 0 &&
          count !== -1
        ) {
          // this.filterShow = true;
        } else if (this.checkAvailabilityClick === true && count === 0) {
          // this.filterShow = false;
        }
        this.checkAvailabilityClick = false;
        if (this.boutiqueListCount !== 0 && this.boutiqueListCount !== -1) {
          this.allExpandState = false;
          this.interBoutiqueTransferFacade.loadBoutiqueList({
            item: this.itemArray,
            regionType: this.regionType,
            pageIndex: this.pageIndex,
            pageSize: this.boutiqueListLoadedOnce
              ? this.initalPageSize
              : this.pageSize
          });
          this.boutiqueListLoadedOnce = false;
        } else if (this.boutiqueListCount === 0) {
          this.interBoutiqueTransferBoutiqueListNotifications();
        }
      });

    this.createRequestResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          if (data.reqDocNo) {
            this.interBoutiqueTransferSendRequestSuccessNotifications(
              data.reqDocNo
            );
          }
        }
      });
  }

  createItemList(searchValue: string): FormGroup {
    return this.formBuilder.group({
      itemCode: [searchValue],
      quantity: [
        1,
        Validators.compose([
          this.fieldValidatorsService.requiredField('Quantity'),
          this.fieldValidatorsService.quantityField('Quantity'),
          this.fieldValidatorsService.max(5, 'Quantity')
        ])
      ],
      productCategory: this.productCategory,
      productCategoryDescription: this.productCategoryDescription
    });
  }

  /**
   * to get into exact field
   * @param index index of particular searchForm field
   */
  getSearchItemFormGroup(index: number): FormGroup {
    this.itemList = this.itemForm.get('searchItem') as FormArray;
    const formGroup = this.itemList.controls[index] as FormGroup;
    return formGroup;
  }

  /**
   *remove Search from group
   */
  removeSearchedItem(index: number) {
    this.itemList.removeAt(index);
    this.searchedItems.splice(index + 1, 1);
    if (this.itemList.length === 0) {
      this.allExpandState = false;
      this.clearSearch();
    }
    this.resetBoutiqueList();
  }

  /**
   * Method to check quantity input field
   */
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  increaseQuantity(i: number) {
    let quantity = this.itemList.controls[i].value.quantity;
    if (quantity < 5) {
      quantity = quantity + 1;
    }
    this.itemList.controls[i].patchValue({ quantity: quantity });
  }

  decreaseQuantity(i: number) {
    let quantity = this.itemList.controls[i].value.quantity;
    if (quantity > 1) {
      quantity = quantity - 1;
    }
    this.itemList.controls[i].patchValue({ quantity: quantity });
  }

  searchItems(searchValue: string) {
    if (this.searchForm.valid) {
      this.interBoutiqueTransferFacade.loadSearchItem(searchValue);
    }
  }

  checkAvailability() {
    this.itemArray = [];
    this.regionType = IBTBoutiquesFilterEnum.TOWN.toUpperCase();
    this.filterShow = true;
    this.filterValue = IBTBoutiquesFilterEnum.TOWN;
    this.checkAvailabilityClick = true;
    this.boutiqueListLoadedOnce = true;
    this.itemForm.value.searchItem.forEach(element => {
      this.itemArray.push({
        itemCode: element.itemCode,
        quantity: element.quantity
      });
    });
    this.loadBoutiques(0);
    this.overlayNotification.close();
  }

  /**
   * To send request to the selected boutique
   *  @param boutique: selected boutique by user to send request
   */
  onSelectedBoutique(boutique: BoutiqueList) {
    this.request = {
      items: this.itemArray,
      remarks: '',
      srcLocationCode: boutique.locationCode
    };
    this.interBoutiqueTransferSendRequestNotifications();
  }

  /**
   * Notification overlay for sending request
   */
  interBoutiqueTransferSendRequestNotifications() {
    const key = 'pw.interBoutiqueTransferNotifications.sendRequestMsg';
    const buttonKey = 'pw.instock.sendRequestButtonText';
    this.translate
      .get([key, buttonKey])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: translatedMessages[key],
            buttonText: translatedMessages[buttonKey],
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            this.showProgressNotification();
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.request.remarks = event.data;
              this.interBoutiqueTransferFacade.createRequest(this.request);
            }
          });
      });
  }

  /**
   * Notification overlay for sending request success message
   */
  interBoutiqueTransferSendRequestSuccessNotifications(docNum: number) {
    const key = 'pw.interBoutiqueTransferNotifications.requestSendSection';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message: translatedMessage + ' ' + docNum,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.resetValue();
            }
          });
      });
  }

  /**
   * empty boutique list notifications
   */
  interBoutiqueTransferBoutiqueListNotifications() {
    const key =
      'pw.interBoutiqueTransferNotifications.emptyBoutiqueListNotifications';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }

  /**
   * Load Requests data based on the type of the request
   * @param pageIndex: page number index
   */
  loadBoutiques(pageIndex: number): void {
    this.interBoutiqueTransferFacade.resetBoutiqueListCount();
    this.interBoutiqueTransferFacade.loadBoutiqueListCount({
      item: this.itemArray,
      regionType: this.regionType
    });
    this.pageIndex = pageIndex;
  }

  clearSearch() {
    this.searchForm.reset();
    this.interBoutiqueTransferFacade.clearSearchItemResponse();
  }

  resetValue() {
    this.itemForm.reset();
    this.itemList.clear();
    this.clearSearch();
    this.searchedItems = [''];
    this.resetBoutiqueList();
    this.allExpandState = false;
  }

  resetBoutiqueList() {
    this.overlayNotification.close();
    this.filterShow = false;
    this.boutiqueListCount = -1;
    this.interBoutiqueTransferFacade.clearBoutiqueList();
  }

  back() {
    this.router.navigate([
      getInterBoutiqueTransferRouteUrl(
        getInterBoutiqueTransferDefaultRouteUrl()
      )
    ]);
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  public set allExpandState(value: boolean) {
    this._allExpandState = value;
    this.togglePanels(value);
  }

  public get allExpandState(): boolean {
    return this._allExpandState;
  }

  public togglePanels(value: boolean) {
    this.viewPanels.forEach(p => (value ? p.open() : p.close()));
  }

  filterBoutiqueList(regType: string) {
    this.boutiqueListCount = -1;
    this.boutiqueListLoadedOnce = true;
    this.interBoutiqueTransferFacade.clearBoutiqueList();
    this.overlayNotification.close();
    if (regType === IBTBoutiquesFilterEnum.ALL) {
      this.regionType = null;
    } else {
      this.regionType = regType.toUpperCase();
    }
    this.filterValue = regType;
    this.loadBoutiques(0);
  }

  getFilterValue() {
    return this.filterValue === null
      ? this.filterTranslation
      : this.filterValue;
  }

  showProgressNotification(): void {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
