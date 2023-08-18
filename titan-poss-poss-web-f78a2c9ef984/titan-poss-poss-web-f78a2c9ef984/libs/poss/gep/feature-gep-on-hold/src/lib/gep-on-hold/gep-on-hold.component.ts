import { GepFacade } from '@poss-web/poss/gep/data-access-gep';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-gep-on-hold',
  templateUrl: './gep-on-hold.component.html',
  styleUrls: ['./gep-on-hold.component.scss']
})
export class GepOnHoldComponent implements OnInit, AfterViewInit, OnDestroy {
  searchOnHoldGepResponse$: Observable<any[]>;
  transactionListResponse$: Observable<any[]>;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  onHoldGepForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  pageIndex = 0;
  pageSize = 10;
  statusGep = 'HOLD';
  defaultTransactionType = 'NEW_GEP';
  totalElements: number;
  onHoldGepCount: number;
  customerInfo = false;
  totalPages = 1;
  tab: string;
  @Output() selectedOnHoldGepEmit = new EventEmitter<any>();
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  id: any;

  constructor(
    private onHoldFacade: GepFacade,
    private formBuilder: FormBuilder,
    public customerFacade: CustomerFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.onHoldGepForm = this.formBuilder.group({
      searchValue: ['']
      // transactionValue: null
    });
    // this.router.events
    //   .pipe(
    //     filter((event: Event) => event instanceof NavigationEnd),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(() => {
    //     this.tab = this.activatedRoute.snapshot.params['type'];
    //     this.id = this.activatedRoute.snapshot.params['_id'];
    //     console.log(this.tab || this.id);
    //     if (this.tab === 'new') {
    //       this.onHoldFacade.loadOnoldCount({
    //         status: 'HOLD',
    //         subTxnType: 'NEW_GEP'
    //       });
    //       this.defaultTransactionType = 'NEW_GEP';
    //       // this.transactionTypeChange('NEW_GEP');
    //     }
    //   });
  }

  ngOnInit() {
    this.componentInit();
    this.defaultTransactionType = 'NEW_GEP';
    this.onHoldFacade.loadOnoldCount({
      status: 'HOLD',
      subTxnType: this.defaultTransactionType
    });
    this.loadOnHoldGep(
      this.onHoldGepForm.get('searchValue').value,
      'NEW_GEP',
      this.pageIndex
    );
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.onHoldGepForm.get('searchValue').value;
        if (searchValue !== '') {
          this.loadOnHoldGep(searchValue, this.defaultTransactionType, 0);
        } else if (searchValue === '') {
          this.clearSearch();
        }
      });
  }

  componentInit() {
    this.onHoldFacade
      .getloadCountHold()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        if (data) this.onHoldGepCount = data[0].count;

        console.log(this.onHoldGepCount);
      });
    this.onHoldFacade
      .getloadOnHold()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.searchOnHoldGepResponse$ = data.results;
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
          console.log(this.totalPages);
        }
        console.log(this.onHoldGepCount);
      });

    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customerInfo = true;
        } else {
          this.customerInfo = false;
        }
      });
  }
  formatTime(time) {
    const momentTime = moment(time);
    return momentTime.format('hh:mm A');
  }
  searchItems(searchValue: any) {
    let searchType: any;
    if (searchValue.match('^[0-9]')) {
      searchType = 'docNo';
    } else if (!searchValue && !searchValue.match('^[0-9]')) {
      searchType = 'customerName';
    } else searchType = 'noSearch';

    return searchType;
  }

  clearSearch() {
    // TODO: check for store resetting
    this.loadOnHoldGep('', this.defaultTransactionType, 0);
    this.onHoldGepForm.get('searchValue').reset('');
  }

  // TODO: NEED TO BE CHECKED AND REMOVED EVERYWHERE
  // deleteonHoldCM(id: string) {
  //   this.onHoldFacade.loadDeleteOnHoldCM(id);
  // }

  paginate() {
    this.loadOnHoldGep(
      this.onHoldGepForm.get('searchValue').value,
      this.defaultTransactionType,
      this.pageIndex
    );
  }

  loadOnHoldGep(searchValue: any, transactionType: string, pageIndex: number) {
    const searchType = this.searchItems(searchValue);
    if (searchType === 'docNo')
      this.onHoldFacade.loadOnHoldGep({
        docNo: searchValue,
        status: this.statusGep,
        subTxnType: transactionType,
        page: pageIndex,
        size: this.pageSize
      });
    else if (searchType === 'customerName')
      this.onHoldFacade.loadOnHoldGep({
        customerName: searchValue,
        status: this.statusGep,
        subTxnType: transactionType,
        page: pageIndex,
        size: this.pageSize
      });
    else {
      this.onHoldFacade.loadOnHoldGep({
        status: this.statusGep,
        subTxnType: transactionType,
        page: pageIndex,
        size: this.pageSize
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  decreasePageIndex() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      this.paginate();
    }
  }

  increasePageIndex() {
    console.log(this.pageIndex, this.totalPages);
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex = this.pageIndex + 1;
      this.paginate();
    }
  }

  selectedOnHoldGep(gep) {
    this.trigger.closeMenu();
    this.selectedOnHoldGepEmit.emit(gep);
    // this.commonFacade.setTransactionTD(cashMemo.id)
  }
}
