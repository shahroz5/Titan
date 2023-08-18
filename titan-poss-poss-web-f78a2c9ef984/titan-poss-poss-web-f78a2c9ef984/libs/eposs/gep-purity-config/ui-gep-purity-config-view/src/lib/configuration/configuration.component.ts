import { Component, Input } from '@angular/core';

@Component({
  selector: 'poss-web-configuration',
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent {
  @Input() gepDetails;

}
