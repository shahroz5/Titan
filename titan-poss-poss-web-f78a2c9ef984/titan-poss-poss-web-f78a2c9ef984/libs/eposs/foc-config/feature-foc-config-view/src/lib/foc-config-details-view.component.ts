import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FocConfigurationFacade } from '@poss-web/eposs/foc-config/data-access-foc-config';
import {
  focSchemeBasedEnums,
  ValueBasedVariantDetails,
  WeightBasedVariantDetails,
  SchemeDetails,
  FOCItemCodes,
  FocLocationList,
  LoadProductGroupPayload
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getFocConfigurationListRouteUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';

import {
  TableViewDialogConfig,
  TableViewDialogService
} from '@poss-web/shared/components/ui-table-view-dialog';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
@Component({
  selector: 'poss-web-foc-config-details-view',
  templateUrl: './foc-config-details-view.component.html'
})
export class FocConfigDetailsViewComponent implements OnInit, OnDestroy {
  constructor(
    public focConfigurationFacade: FocConfigurationFacade,
    private tableViewDialogService: TableViewDialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dateFormatterService: DateFormatterService
  ) {}

  isLoading$: Observable<boolean>;
  configId: string;
  destroy$ = new Subject<null>();
  destroy1$: Subject<null> = new Subject<null>();
  destroy2$: Subject<null> = new Subject<null>();
  schemeDetails$: Observable<SchemeDetails>;
  valueBasedVariantDetailsGoldStandard$: Observable<ValueBasedVariantDetails[]>;
  valueBasedVariantDetailsGoldSlab$: Observable<ValueBasedVariantDetails[]>;
  valueBasedVariantDetailsOthersStandard$: Observable<
    ValueBasedVariantDetails[]
  >;
  valueBasedVariantDetailsOthersSlab$: Observable<ValueBasedVariantDetails[]>;
  weightBasedVariantDetailsGoldStandard$: Observable<
    WeightBasedVariantDetails[]
  >;
  weightBasedVariantDetailsGoldSlab$: Observable<WeightBasedVariantDetails[]>;
  weightBasedVariantDetailsOthersStandard$: Observable<
    WeightBasedVariantDetails[]
  >;
  weightBasedVariantDetailsOthersSlab$: Observable<WeightBasedVariantDetails[]>;

  category: string;
  itemType: string;
  offerType: string;
  mappedFocItems: FOCItemCodes[];
  locationList: FocLocationList[] = [];
  totalLocations$: Observable<number>;

  ngOnInit(): void {
    this.focConfigurationFacade.loadReset();
    this.isLoading$ = this.focConfigurationFacade.getIsloading();
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];

        if (this.configId !== focSchemeBasedEnums.NEW) {
          this.focConfigurationFacade.loadFocSchemeConfigurationByConfigId(
            this.configId
          );
        }
      });

    this.schemeDetails$ = this.focConfigurationFacade.getSchemeDetailsById();

    this.valueBasedVariantDetailsGoldStandard$ = this.focConfigurationFacade.getValueBasedVariantDetailsGoldStandard();
    this.valueBasedVariantDetailsGoldSlab$ = this.focConfigurationFacade.getValueBasedVariantDetailsGoldSlab();
    this.valueBasedVariantDetailsOthersStandard$ = this.focConfigurationFacade.getValueBasedVariantDetailsOthersStandard();
    this.valueBasedVariantDetailsOthersSlab$ = this.focConfigurationFacade.getValueBasedVariantDetailsOthersSlab();

    this.weightBasedVariantDetailsGoldStandard$ = this.focConfigurationFacade.getWeightBasedVariantDetailsGoldStandard();
    this.weightBasedVariantDetailsGoldSlab$ = this.focConfigurationFacade.getWeightBasedVariantDetailsGoldSlab();
    this.weightBasedVariantDetailsOthersStandard$ = this.focConfigurationFacade.getWeightBasedVariantDetailsOthersStandard();
    this.weightBasedVariantDetailsOthersSlab$ = this.focConfigurationFacade.getWeightBasedVariantDetailsOthersSlab();

    this.focConfigurationFacade.loadVariantDetailsValueGoldStandardById({
      id: this.configId,
      category: focSchemeBasedEnums.VALUE_BASED,
      itemType: focSchemeBasedEnums.GOLD_COIN,
      offerType: focSchemeBasedEnums.STANDARD
    });
    this.focConfigurationFacade.loadVariantDetailsValueGoldSlabById({
      id: this.configId,
      category: focSchemeBasedEnums.VALUE_BASED,
      itemType: focSchemeBasedEnums.GOLD_COIN,
      offerType: focSchemeBasedEnums.SLAB
    });
    this.focConfigurationFacade.loadVariantDetailsValueOthersStandardById({
      id: this.configId,
      category: focSchemeBasedEnums.VALUE_BASED,
      itemType: focSchemeBasedEnums.OTHERS,
      offerType: focSchemeBasedEnums.STANDARD
    });
    this.focConfigurationFacade.loadVariantDetailsValueOthersSlabById({
      id: this.configId,
      category: focSchemeBasedEnums.VALUE_BASED,
      itemType: focSchemeBasedEnums.OTHERS,
      offerType: focSchemeBasedEnums.SLAB
    });

    this.focConfigurationFacade.loadVariantDetailsWeightGoldStandardById({
      id: this.configId,
      category: focSchemeBasedEnums.WEIGHT_BASED,
      itemType: focSchemeBasedEnums.GOLD_COIN,
      offerType: focSchemeBasedEnums.STANDARD
    });
    this.focConfigurationFacade.loadVariantDetailsWeightGoldSlabById({
      id: this.configId,
      category: focSchemeBasedEnums.WEIGHT_BASED,
      itemType: focSchemeBasedEnums.GOLD_COIN,
      offerType: focSchemeBasedEnums.SLAB
    });

    this.focConfigurationFacade.loadVariantDetailsWeightOthersStandardById({
      id: this.configId,
      category: focSchemeBasedEnums.WEIGHT_BASED,
      itemType: focSchemeBasedEnums.OTHERS,
      offerType: focSchemeBasedEnums.STANDARD
    });
    this.focConfigurationFacade.loadVariantDetailsWeightOthersSlabById({
      id: this.configId,
      category: focSchemeBasedEnums.WEIGHT_BASED,
      itemType: focSchemeBasedEnums.OTHERS,
      offerType: focSchemeBasedEnums.SLAB
    });

    this.focConfigurationFacade.loadMappedFocItems({
      id: this.configId,
      pageIndex: 0,
      pageSize: 0
    });

    this.focConfigurationFacade
      .getMappedFocItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedFocItems: FOCItemCodes[]) => {
        if (mappedFocItems) {
          this.mappedFocItems = mappedFocItems;
        }
      });

    this.focConfigurationFacade.loadLocationListById({
      pageIndex: 0,
      pageSize: 0,
      length: 0,
      id: this.configId
    });

    this.focConfigurationFacade
      .getLocationList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locationList: FocLocationList[]) => {
        if (locationList) {
          this.locationList = locationList;
        }
      });

    this.focConfigurationFacade
      .getAllSelectedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locationList: any) => {
        if (locationList && locationList.locationList.length > 0) {
          this.locationList = locationList.locationList;
        }
      });

    this.focConfigurationFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.productGroupingViewDialog(data);
        }
      });

    this.totalLocations$ = this.focConfigurationFacade.getLocationCount();
    this.totalLocations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        if (count) {
          this.focConfigurationFacade.loadAllLocations({
            pageIndex: 0,
            pageSize: count,
            length: null,
            id: this.configId
          });
        }
      });
  }

  back() {
    this.router.navigate([getFocConfigurationListRouteUrl()]);
    this.focConfigurationFacade.loadReset();
  }

  focItemCodeMapping() {
    const tableValues: string[][] = [];

    this.mappedFocItems.forEach(item => {
      tableValues.push([
        item.itemCode,
        item.stdWeight.toString(),
        item.karat.toString()
      ]);
    });

    const config: TableViewDialogConfig = {
      title: 'FOC ITEM CODE MAPPING',
      placeholder: 'Placeholder',
      headerLabels: ['FOC Item Code', 'Standard Wt.', 'Karatage'],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }

  locationMapping() {
    const tableValues: string[][] = [];

    this.locationList.forEach(item => {
      tableValues.push([
        item.locationCode,
        item.description,
        this.dateFormatterService.format(moment(item.startDate)),
        this.dateFormatterService.format(moment(item.endDate)),
        item.subBrandCode,
        item.isActive ? 'Active' : 'Inactive'
      ]);
    });

    const config: TableViewDialogConfig = {
      title: 'Location Mapping View',
      placeholder: 'Placeholder',
      headerLabels: [
        'Location Code',
        'Location Name',
        'Start Date',
        'End Date',
        'Subbrand code',
        'Status'
      ],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }

  productGroupMapping(event: LoadProductGroupPayload) {
    this.focConfigurationFacade.loadMappedProductGroupByConfigId({
      ...event,
      masterId: this.configId
    });
  }

  productGroupingViewDialog(productGroup: { id: string }[]) {
    const tableValues: string[][] = [];

    productGroup.forEach(item => {
      tableValues.push([item.id]);
    });

    const config: TableViewDialogConfig = {
      title: 'Product Group Mapping View',
      placeholder: 'Placeholder',
      headerLabels: ['Product Group'],
      tableValues
    };
    this.tableViewDialogService.open(config);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy1$.next();
    this.destroy1$.complete();
  }
}
