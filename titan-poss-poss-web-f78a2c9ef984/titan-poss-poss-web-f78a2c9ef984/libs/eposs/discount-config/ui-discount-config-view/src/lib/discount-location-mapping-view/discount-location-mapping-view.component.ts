import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Moment } from 'moment';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DiscountTypeEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-discount-location-mapping-view',
  templateUrl: './discount-location-mapping-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountLocationMappingViewComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() isApplicableField;
  @Input() mappedLocation;
  @Input() levels: [] = [];
  @Input() isPreviewApplicable;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Input() allSelectedLocations: {
    id: string;
    description: string;
  }[] = [];

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize;

  @Output() loadItems = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  filterForm = new FormGroup({
    searchValue: new FormControl(),
    offerStartDate: new FormControl(),
    offerEndDate: new FormControl(),
    previewStartDate: new FormControl(),
    previewEndDate: new FormControl()
  });
  searchValue: string;
  offerStartDate: Moment;
  offerEndDate: Moment;
  previewStartDate: Moment;
  previewEndDate: Moment;
  rowData = [];
  destroy$ = new Subject();
  expanded = true;
  discountType = DiscountTypeEnum;
  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  ngOnInit(): void {
    this.filterForm
      .get('offerStartDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((date: Moment) => {
        console.log(this.dateCompare(date, this.offerEndDate));
        console.log(date, 'offerStartDate');

        if (this.dateCompare(date, this.offerStartDate)) {
          this.offerStartDate = date;

        }
      });

    this.filterForm
      .get('offerEndDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (this.dateCompare(date, this.offerEndDate)) {
          this.offerEndDate = date;
          this.pageEvent.pageIndex = 0;
          this.loadMappedLocation();
        }
      });

    this.filterForm
      .get('previewStartDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (this.dateCompare(date, this.previewStartDate)) {
          this.previewStartDate = date;
          this.previewEndDate = null;

          this.pageEvent.pageIndex = 0;

        }
      });

    this.filterForm
      .get('previewEndDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        if (this.dateCompare(date, this.previewEndDate)) {
          this.previewEndDate = date;
          this.pageEvent.pageIndex = 0;
          this.loadMappedLocation();
        }
      });

    this.filterForm
      .get('offerStartDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.filterForm.get('offerEndDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'OfferEndDate')
        ]);
        endDate.updateValueAndValidity();
      });

    this.filterForm
      .get('previewStartDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.filterForm.get('previewEndDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'PreviewEndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }
  dateCompare(date1: Moment, date2: Moment) {

    return moment(date1)?.valueOf() !== moment(date2)?.valueOf();
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('isApplicableField', this.isApplicableField);
    if (changes['mappedLocation']) {

      console.log(this.mappedLocation, 'rowData');
      this.rowData = [];
      this.mappedLocation?.forEach(row => {
        this.rowData.push({
          description: row.description ? row.description : '',
          id: row.id ? row.id : '',
          locationCode: row.locationCode ? row.locationCode : '',
          offerEndDate: row.offerEndDate ? moment(row.offerEndDate) : '',
          offerStartDate: row.offerStartDate ? moment(row.offerStartDate) : '',
          previewEndDate: row.previewEndDate ? moment(row.previewEndDate) : '',
          previewStartDate: row.previewStartDate
            ? moment(row.previewStartDate)
            : '',
          isActive: row.isActive ? row.isActive : false,
          subBrandCode: row.subBrandCode ? row.subBrandCode : ''
        });
      });
    }
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.filterForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  search(searchValue: string) {
    this.searchValue = searchValue;
    this.pageEvent.pageIndex = 0;
    this.loadMappedLocation();
  }

  clearSearch() {
    this.filterForm.get('searchValue').reset();
    this.searchValue = null;
    this.pageEvent.pageIndex = 0;
    this.clear.emit({
      searchValue: this.searchValue,
      offerStartDate: this.offerStartDate,
      offerEndDate: this.offerEndDate,
      previewStartDate: this.previewStartDate,
      previewEndDate: this.previewEndDate,
      pageEvent: this.pageEvent
    });
  }
  paginate(data) {
    this.pageEvent = data;
    this.loadMappedLocation();
  }

  loadMappedLocation() {
    console.log(this.offerStartDate, this.offerEndDate, 'load ');

    this.loadItems.emit({
      searchValue: [this.searchValue],
      offerStartDate: this.offerStartDate,
      offerEndDate: this.offerEndDate,
      previewStartDate: this.previewStartDate,
      previewEndDate: this.previewEndDate,
      pageEvent: this.pageEvent
    });
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
  }
  ngDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clearOfferRange() {
    this.filterForm.get('offerStartDate').reset();
    this.filterForm.get('offerEndDate').reset();
    this.offerStartDate = null;
    this.offerEndDate = null;
    this.clear.emit({
      searchValue: this.searchValue,
      offerStartDate: this.offerStartDate,
      offerEndDate: this.offerEndDate,
      previewStartDate: this.previewStartDate,
      previewEndDate: this.previewEndDate,
      pageEvent: this.pageEvent
    });
  }
  dateFormatting(date) {
    if (date) {
      return moment(date);
    }
  }
  clearPreviewRange() {
    this.filterForm.get('previewStartDate').reset();
    this.filterForm.get('previewEndDate').reset();
    this.previewStartDate = null;
    this.previewEndDate = null;
    this.clear.emit({
      searchValue: this.searchValue,
      offerStartDate: this.offerStartDate,
      offerEndDate: this.offerEndDate,
      previewStartDate: this.previewStartDate,
      previewEndDate: this.previewEndDate,
      pageEvent: this.pageEvent
    });
  }
}
