import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ProductGroupDetails,ItemTypesResponse } from '@poss-web/shared/models';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'poss-web-productgroup-view',
  templateUrl: './productgroup-view.component.html'
})
export class ProductgroupViewComponent implements OnInit, OnDestroy {
  @Input() CFAProduct$: Observable<ProductGroupDetails>;
  @Input() itemTypes$: Observable<ItemTypesResponse[]>;
  @Input() plainStuddedType$: Observable<{ id: string; name: string }[]>;
  @Input() pricingType$: Observable<{ id: string; name: string }[]>;
  destroy$ = new Subject<null>();
  itemTypes: ItemTypesResponse[] = [];
  plainStuddedTypes: { id: string; name: string }[] = [];
  pricingTypes: { id: string; name: string }[] = [];


  ngOnInit(): void {
    combineLatest([this.itemTypes$, this.plainStuddedType$, this.pricingType$])
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe(results => {
        this.itemTypes = results[0];
        this.plainStuddedTypes = results[1];
        this.pricingTypes = results[2];
      });
  }
  getMetalType(metalTypeCode) {
    const val = this.itemTypes.filter(obj => obj.id === metalTypeCode);
    if (val.length > 0) {
      return val[0].name;
    } else {
      return '';
    }
  }
  getPlainStudded(code) {
    const val = this.plainStuddedTypes.filter(data => data.id === code);

    if (val.length > 0) {
      return val[0].name;
    } else {
      return '';
    }
  }
  getPricingType(id) {
    const val = this.pricingTypes.filter(data => data.id === id);
    console.log('value', val);
    if (val.length > 0) {
      return val[0].name;
    } else {
      return '';
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
