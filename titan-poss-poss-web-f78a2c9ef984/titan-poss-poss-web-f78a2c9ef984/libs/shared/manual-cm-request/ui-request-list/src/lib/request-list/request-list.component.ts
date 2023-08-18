import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { FormControl } from '@angular/forms';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { CmRequestList, RequestStatusTypesEnum } from '@poss-web/shared/models';
import {
  getCMRequestApprovalsDetailsRouteUrl,
  getCMRequestDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'poss-web-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TitleCasePipe]
})
export class RequestListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() cmRequestList$: Observable<CmRequestList[]>;
  @Input() selectedStatus: RequestStatusTypesEnum;
  pageSize = 4;
  searchValue = 0;
  @Input() user: boolean;
  destroy$: Subject<null> = new Subject<null>();
  cmRequestList: CmRequestList[] = [];
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchFormControl = new FormControl();
  statusFormControl = new FormControl(RequestStatusTypesEnum.APPROVED);
  selectLocationLableText: string;
  searchLocationPlaceHolder: string;
  locationCode: string[] = [];
  selectedLocation: SelectionDailogOption;
  @Input() locationForSelection: SelectionDailogOption[] = [];
  @Input() isLoading$: Observable<any>;
  @Output() locationSearch = new EventEmitter<string>();
  @Output() requestNoSearch = new EventEmitter<number>();
  @Output() clearSearchEvent = new EventEmitter<boolean>();
  @Output() clearSearchData = new EventEmitter<null>();
  @Output() loadMore = new EventEmitter<any>();
  @Output() statusChangeEvent = new EventEmitter<string>();
  availableStatus = [
    {
      value: RequestStatusTypesEnum.APPROVED,
      description: this.titlecasePipe.transform(RequestStatusTypesEnum.APPROVED)
    },
    {
      value: RequestStatusTypesEnum.PENDING,
      description: this.titlecasePipe.transform(RequestStatusTypesEnum.PENDING)
    },
    {
      value: RequestStatusTypesEnum.REJECTED,
      description: this.titlecasePipe.transform(RequestStatusTypesEnum.REJECTED)
    },
    // {
    //   value: RequestStatusTypesEnum.CANCELLED,
    //   description: this.titlecasePipe.transform(
    //     RequestStatusTypesEnum.CANCELLED
    //   )
    // }
  ];
  requestListCount: number;
  status: string;
  statusColor: string;
  noDataFoundMessage: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private selectionDialog: SelectionDialogService,
    public translate: TranslateService,
    private titlecasePipe: TitleCasePipe
  ) {
    this.translate
      .get(
        [
          'pw.approvals.searchByLocationCode',
          'pw.approvals.selectLocationCode',
          'pw.global.noDataFoundMessage'
        ],
        {
          entityName: 'Requests'
        }
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.selectLocationLableText =
          translatedMessages['pw.approvals.selectLocationCode'];
        this.searchLocationPlaceHolder =
          translatedMessages['pw.approvals.searchByLocationCode'];
        this.noDataFoundMessage =
          translatedMessages['pw.global.noDataFoundMessage'];
      });
  }

  ngOnInit() {
    this.cmRequestList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data.length !== 0) {
          this.cmRequestList = data;
          this.requestListCount = data[0].totalElements;
        } else {
          this.cmRequestList = [];
          this.requestListCount = 0;
        }
      });
    this.statusFormControl.patchValue(this.selectedStatus);
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.searchFormControl.value;
        if (searchValue !== '') {
          if (this.validateSearch(searchValue)) {
            this.searchValue = searchValue;
            this.requestNoSearch.emit(this.searchValue);
          } else {
            this.clearSearchData.emit();
          }
        } else {
          this.clearSearch();
        }
      });
  }

  onRequestSelected(request) {
    if (this.user) {
      this.router.navigate([
        getCMRequestApprovalsDetailsRouteUrl(request.taskId, request.processId)
      ]);
    } else {
      this.router.navigate([
        getCMRequestDetailsRouteUrl(
          request.headerData.data.txnType,
          request.processId
        )
      ]);
    }
  }

  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }

  loadRequests(pageIndex: number) {
    this.loadMore.emit(pageIndex);
  }

  clearSearch() {
    this.searchFormControl.reset();
    this.clearSearchEvent.emit(true);
  }

  openLocationPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: this.selectLocationLableText,
        placeholder: this.searchLocationPlaceHolder,
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.locationCode = [selectedOption.id];
          this.locationSearch.emit(selectedOption.id);
        }
      });
  }

  clearPopup() {
    this.locationCode = [];
    this.selectedLocation = null;
    this.clearSearchEvent.emit(false);
  }

  dateFormat(date) {
    return moment(date);
  }

  statusChange(event) {
    this.statusChangeEvent.emit(this.statusFormControl.value);
  }

  getStatus(status: string) {
    let key;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
