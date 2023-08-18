import {
  Component,
  OnDestroy,
  Input,
  ContentChild,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { ItemSearchResponse, SelectableItem } from '../model/item-search.model';
import { ItemSearchComponent } from '../item-search/item-search.component';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-item-search-list',
  templateUrl: './item-search-list.component.html',
  styleUrls: ['./item-search-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSearchListComponent implements OnDestroy, OnChanges {
  @Input() placeholder;
  @Input() hasResults = true;
  @Input() itemList: any[];
  @Input() autocomplete = 'off';
  @Input() multipleSelection = false;
  @Input() validate = true;
  @Input() hasSuggestiveSearch = false;
  @Input() isMaintainSelection = false;
  @Input() isBinToBinTransfer = false;

  @Output() search = new EventEmitter<ItemSearchResponse>();
  @Output() clear = new EventEmitter<null>();
  noDataFoundMessageItems;

  /**
   * Single item if multipleSelection is false
   * Array of Selected Items if multipleSelection is true
   */
  @Output() selected = new EventEmitter<any>();
  @ContentChild(TemplateRef, { static: true }) templateRef: TemplateRef<any>;
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;
  itemCheckList: SelectableItem[] = [];
  selectedLength = 0;
  destroy$: Subject<null> = new Subject<null>();

  constructor(private translate: TranslateService) {
    this.translate
      .get(['pw.entity.productEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.productEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['itemList']) {
      if (this.isMaintainSelection) {
        let tempItemCheckList = this.itemCheckList;
        this.itemCheckList = changes['itemList'].currentValue.map(
          (item: any, index: number): SelectableItem => {
            return {
              item: item,
              isSelected:
                tempItemCheckList.length && tempItemCheckList[index]?.isSelected
                  ? tempItemCheckList[index]?.isSelected
                  : false
            };
          }
        );
      } else {
        this.itemCheckList = changes['itemList'].currentValue.map(
          (item: any): SelectableItem => {
            return { item: item, isSelected: false };
          }
        );
        this.selectedLength = 0;
      }
    }
  }

  invalidInput() {
    this.itemList = [];
    this.itemCheckList = [];
    this.selectedLength = 0;
    this.hasResults = false;
  }

  onSearch(searchResponse: ItemSearchResponse) {
    if (this.validate && !searchResponse.isValid) {
      this.invalidInput();
    } else {
      this.selectedLength = 0;
      this.hasResults = true;
      this.search.emit(searchResponse);
    }
  }

  clearResults() {
    this.reset();
    this.clear.emit();
  }

  reset() {
    this.searchRef.reset();
    this.itemList = [];
    this.itemCheckList = [];
    this.selectedLength = 0;
    this.hasResults = true;
  }

  add(item: any) {
    this.selected.emit(item);
    this.clearResults();
  }

  onSelectionChange(isChecked) {
    if (isChecked) {
      this.selectedLength++;
    } else {
      this.selectedLength--;
    }
  }

  multipleAdd() {
    this.selected.emit(
      this.itemCheckList
        .filter((selectableItem: SelectableItem) => selectableItem.isSelected)
        .map((selectableItem: SelectableItem) => selectableItem.item)
    );
    this.clearResults();
  }

  focus() {
    if (this.searchRef) {
      this.searchRef.focus();
    }
  }

  trackBy(_: number, item) {
    return item?.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
