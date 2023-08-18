import { Component, Input, OnInit } from '@angular/core';
import { CreateConfig, ProductGroups } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-conversion-config-view',
  templateUrl: './conversion-config-view.component.html',
  styleUrls: ['./conversion-config-view.component.scss']
})
export class ConversionConfigViewComponent implements OnInit {


  @Input() createConfigDetails: CreateConfig;
  @Input() selectedGroups: ProductGroups[];

  ngOnInit(): void {
    console.log(
      '%cLog%cline:16%cthis.selectedGroups',
      'color:#fff;background:#ee6f57;padding:3px;border-radius:2px',
      'color:#fff;background:#1f3c88;padding:3px;border-radius:2px',
      'color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px',
      this.selectedGroups
    );
  }
}
