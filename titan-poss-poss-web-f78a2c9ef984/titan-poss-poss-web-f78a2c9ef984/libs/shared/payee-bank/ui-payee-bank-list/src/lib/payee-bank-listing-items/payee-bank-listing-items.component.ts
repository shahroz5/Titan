import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { PayeeBankDetails } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-payee-bank-listing-items',
  templateUrl: './payee-bank-listing-items.component.html'
})
export class PayeeBankListingItemsComponent implements OnChanges {
  @Input() payeeBankDetailsList: PayeeBankDetails;
  @Input() permissions$: Observable<any[]>;
  @Output() bankName = new EventEmitter<any>();
  @Output() emitToggle = new EventEmitter<any>();
  ADD_EDIT_PAYEE_BANK_PERMISSIONS = 'Payee Bank - Add/Edit Payee Bank';
  isActive: any;
  @Output() viewPage = new EventEmitter<string>();
  constructor(private elementPermission: ElementPermissionService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.payeeBankDetailsList.isActive;
  }

  getBankName(bankName: string) {
    console.log(bankName);

    this.bankName.emit(bankName);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      bankName: this.payeeBankDetailsList.bankName
        ? this.payeeBankDetailsList.bankName
        : null,
      bankCode: this.payeeBankDetailsList.bankCode
        ? this.payeeBankDetailsList.bankCode
        : null,
      addressOne: this.payeeBankDetailsList.addressOne
        ? this.payeeBankDetailsList.addressOne
        : null,
      addressTwo: this.payeeBankDetailsList.addressTwo
        ? this.payeeBankDetailsList.addressTwo
        : null,
      townName: this.payeeBankDetailsList.townName,
      stateName: this.payeeBankDetailsList.stateName
        ? this.payeeBankDetailsList.stateName
        : null,
      mailId: this.payeeBankDetailsList.mailId
        ? this.payeeBankDetailsList.mailId
        : null,
      ownerType: this.payeeBankDetailsList.ownerType
        ? this.payeeBankDetailsList.ownerType
        : null,
      contactPerson: this.payeeBankDetailsList.contactPerson
        ? this.payeeBankDetailsList.contactPerson
        : null,
      isActive: event.checked
    };

    this.emitToggle.emit(obj);
  }
  openViewPage(bankName) {
    this.viewPage.emit(bankName);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
