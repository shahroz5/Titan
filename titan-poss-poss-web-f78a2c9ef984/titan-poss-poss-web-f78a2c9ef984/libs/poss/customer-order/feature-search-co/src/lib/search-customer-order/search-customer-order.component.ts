import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import {
  SubTransactionTypeEnum,
  ToolbarConfig,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-search-customer-order',
  templateUrl: './search-customer-order.component.html',
  styleUrls: ['./search-customer-order.component.scss']
})
export class SearchCustomerOrderComponent implements OnInit, OnDestroy {
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CO,
    subTxnType: SubTransactionTypeEnum.NEW_CO,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  searchCOForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  coFunctions = [
    {
      value: 'Cancel_CO',
      description: 'Cancel CO',
      isActive: true
    },
    {
      value: 'Freeze_CO',
      description: 'Freeze CO',
      isActive: true
    },
    {
      value: 'Add_Payment',
      description: 'Add Payment',
      isActive: true
    },
    {
      value: 'All',
      description: 'View All',
      isActive: true
    }
  ];
  currentFiscalYear: string;
  data;

  constructor(
    private toolbarFacade: ToolbarFacade,
    private bodeodFacade: SharedBodEodFacade
  ) {}

  ngOnInit(): void {
    this.createSearchCOForm();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.componentInit();
  }

  componentInit() {
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });
  }

  createSearchCOForm() {
    this.searchCOForm = new FormGroup({
      coFunction: new FormControl(''),
      fiscalYear: new FormControl(''),
      docNumber: new FormControl(''),
      mobileNumber: new FormControl('')
    });
  }

  valueChanged(value) {}

  searchCO(value) {}

  ngOnDestroy(): void {
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.destroy$.next();
    this.destroy$.complete();
  }
}
