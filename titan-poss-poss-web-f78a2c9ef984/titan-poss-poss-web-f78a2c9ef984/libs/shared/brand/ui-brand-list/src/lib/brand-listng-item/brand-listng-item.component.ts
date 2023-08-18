import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { BrandMaster } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-brand-listng-item',
  templateUrl: './brand-listng-item.component.html',
  styleUrls: ['./brand-listng-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandListngItemComponent implements OnInit, OnChanges {
  @Input() listItem: BrandMaster;

  @Output() emitBrandCode = new EventEmitter<string>();
  @Output() emitViewBrandCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    brandCode: string;
  }>();
  checked: boolean;
  isActive: any;



  ngOnInit() {
    this.checked = this.listItem.isActive;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.checked = this.listItem.isActive;
  }

  emitBrandcode() {
    this.emitBrandCode.emit(this.listItem.brandCode);
  }

  viewDetailsPage() {
    this.emitViewBrandCode.emit(this.listItem.brandCode);
  }

  changeEvent(event) {
    this.checked = event.checked;
    const obj = {
      isActive: event.checked,
      brandCode: this.listItem.brandCode
    };
    this.emitToggle.emit(obj);
  }
}
