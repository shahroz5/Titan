import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { ProductCategory } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-product-category-listing-item',
  templateUrl: './product-category-listing-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryListingItemComponent implements OnInit {
  @Input() productCategoryDetailsList: ProductCategory;
  @Output() productCategoryCodeView = new EventEmitter<any>();
  @Output() productCategoryCode = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  checked: boolean;


  ngOnInit() {
    this.checked = this.productCategoryDetailsList.isActive;
  }

  getProductCategoryCodeView(productCategoryCode: string) {
    this.productCategoryCodeView.emit(productCategoryCode);
  }
  getProductCategoryCode(productCategoryCode: string) {
    this.productCategoryCode.emit(productCategoryCode);
  }

  change(event) {
    this.checked = event.checked;
    const obj = {
      isActive: event.checked,
      productCategoryCode: this.productCategoryDetailsList.productCategoryCode
    };
    this.emitToggle.emit(obj);
  }
}
