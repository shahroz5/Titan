import { Injectable } from '@angular/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  Customers, CUSTOMER_TYPE_ENUM, LocationSettingAttributesEnum,
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidateCustomerService {
  destroy$ = new Subject();
  isEmailRequiredForEncircle: any;

  constructor(
    public locationSettingsFacade: LocationSettingsFacade,
  ) { }

  validateCustomer(customer: Customers): boolean{
    if(customer.customerType === CUSTOMER_TYPE_ENUM.REGULAR){
      console.log("customer details", customer);
      console.log("customer id number", customer.customerDetails.data.idNumber);
      console.log("customer id proof", customer.customerDetails.data.idProof);
      this.locationSettingsFacade
        .getLocationSetting(
          LocationSettingAttributesEnum.CUSTOMER_IS_EMAIL_FOR_ENCIRCLE_CUSTOMER
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(isEmailRequiredForEncircle => {
          this.isEmailRequiredForEncircle = isEmailRequiredForEncircle;
        });
      if(customer.title === null || customer.title === '') return false;
      if(customer.customerName === null || customer.customerName === '') return false;
      if(customer.mobileNumber === null || customer.mobileNumber === '') return false;
      if(this.isEmailRequiredForEncircle === 'true'){
        if(customer.emailId === null || customer.emailId === '') return false;
      }
      if(
        (customer.customerDetails.data.idProof !== null && customer.customerDetails.data.idNumber === null) ||
        (customer.customerDetails.data.idProof === null && customer.customerDetails.data.idNumber !== null)
      ) return false;
      if(customer.customerDetails.data.addressLines[0] === null || customer.customerDetails.data.addressLines[0] === '') return false;
      if(customer.customerDetails.data.addressLines[1] === null || customer.customerDetails.data.addressLines[1] === '') return false;
      if(customer.customerDetails.data.country === null || customer.customerDetails.data.country === '') return false;
      if(customer.customerDetails.data.pinCode === null || customer.customerDetails.data.pinCode === '') return false;
      if(customer.customerDetails.data.state === null || customer.customerDetails.data.state === '') return false;
      if(customer.customerDetails.data.city === null || customer.customerDetails.data.city === '') return false;
      if(customer.customerDetails.data.zone === null || customer.customerDetails.data.zone === '') return false;
      return true;
    } else {
      return true;
    }
  }
}
