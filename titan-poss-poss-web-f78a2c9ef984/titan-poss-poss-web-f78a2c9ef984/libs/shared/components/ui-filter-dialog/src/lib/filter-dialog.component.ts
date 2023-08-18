import {
  Component,
  Inject,
  ElementRef,
  Renderer2,
  AfterViewChecked,
  AfterViewInit,
  ViewChildren,
  QueryList,
  OnDestroy
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { Filter } from './models/filter-dialog.model';

@Component({
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent
  implements AfterViewChecked, AfterViewInit, OnDestroy {
  filterTypes: string[];
  selectedFilterList: { [key: string]: Map<string | number, Filter> };
  currentFilterType: string;
  filterOptionsData: { [key: string]: Filter[] };
  searchSubscription: Subscription = new Subscription();
  destroy$: Subject<null> = new Subject<null>();

  @ViewChildren('searchBox')
  searchBox: QueryList<ElementRef>;
  noDataFoundMessage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productFilterDialog: MatDialogRef<FilterDialogComponent>,
    private el: ElementRef,
    private renderer: Renderer2,
    public translateService: TranslateService
  ) {
    this.selectedFilterList = data.selected;
    this.filterTypes = Object.keys(data.filterdata);
    this.filterOptionsData = { ...data.filterdata };
    this.currentFilterType = this.filterTypes[0];

    this.translateService
      .get(['pw.entity.inputEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translateService
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.inputEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngAfterViewChecked(): void {
    if (this.selectedFilterList[this.currentFilterType].size > 0) {
      this.renderer.setStyle(
        this.el.nativeElement.querySelector(
          '.chip-tab-group > .mat-tab-header .mat-tab-label-container > .mat-tab-list .mat-ink-bar'
        ),
        'background-color',
        'transparent'
      );

      this.renderer.setStyle(
        this.el.nativeElement.querySelector(
          '.chip-tab-group > .mat-tab-header .mat-tab-label-container > .mat-tab-list > .mat-tab-labels > .mat-tab-label'
        ),
        'padding',
        '0'
      );
    }
  }

  ngAfterViewInit(): void {
    this.searchBox.forEach((element: ElementRef) =>
      this.searchSubscription.add(
        fromEvent(element.nativeElement, 'input')
          .pipe(debounceTime(1000))
          .subscribe((event: any) => this.onSearchChange(event.target.value))
      )
    );
  }

  onSearchChange(value: string) {
    this.filterOptionsData[this.currentFilterType] = !!value
      ? this.data.filterdata[this.currentFilterType].filter(
          (item: Filter) =>
            item.description &&
            item.description.toLowerCase().includes(value.toLowerCase())
        )
      : this.data.filterdata[this.currentFilterType];
  }

  updateFilterList(filterType: string, event: MatSelectionListChange) {
    const filter: Filter = (event.option.value as unknown) as Filter;
    event.option.selected
      ? this.selectedFilterList[filterType].set(filter.id, {
          ...filter,
          selected: event.option.selected
        })
      : this.removeFilterChip(filterType, filter);
  }

  removeFilterChip(filterType: string, filter: Filter) {
    this.selectedFilterList[filterType].delete(filter.id);
  }

  closePopUp() {
    const response = {};
    this.searchSubscription.unsubscribe();
    Object.keys(this.selectedFilterList).forEach(filterType => {
      response[filterType] = [];
      this.selectedFilterList[filterType].forEach(filter => {
        response[filterType].push(filter);
      });
    });
    this.productFilterDialog.close(response);
  }

  onTabFocus(event: MatTabChangeEvent) {
    this.currentFilterType = event.tab.textLabel;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
