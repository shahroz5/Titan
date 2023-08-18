import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PayeeBankDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-bank-details-view',
  templateUrl: './bank-details-view.component.html'
})
export class BankDetailsViewComponent implements OnInit {
  @Input() bankDetails$: Observable<PayeeBankDetails>;


  ngOnInit(): void {
    this.bankDetails$.subscribe(val => console.log(val));
  }
}
