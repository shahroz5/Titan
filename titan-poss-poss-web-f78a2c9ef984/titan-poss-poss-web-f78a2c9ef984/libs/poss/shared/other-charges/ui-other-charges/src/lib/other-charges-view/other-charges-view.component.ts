import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'poss-web-other-charges-view',
  templateUrl: './other-charges-view.component.html',
  styleUrls: []
})
export class OtherChargesViewComponent implements OnInit {
  @Input() otherCharges: any;

  constructor() { }

  ngOnInit(): void {
  }

}
