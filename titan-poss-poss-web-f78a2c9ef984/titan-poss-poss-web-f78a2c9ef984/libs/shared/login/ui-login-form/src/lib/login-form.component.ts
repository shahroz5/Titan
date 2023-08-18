import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  Input,
  Inject
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  AppTypesEnum,
  FileNamesEnum,
  FilePathEnum
} from '@poss-web/shared/models';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { POSS_APP_TYPE, POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { getTitanADSamlLoginUrl } from '@poss-web/shared/util-api-service';

@Component({
  selector: 'poss-web-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Input() authError;
  @Output() login = new EventEmitter<any>();

  loginForm: FormGroup;
  loginIdLable: string;
  passwordLable: string;
  loginClicked = false;
  appTypesEnum = AppTypesEnum;

  passwordCharPattern = fieldValidation.passwordallowedCharPattern.pattern;

  constructor(
    private formBuilder: FormBuilder,
    private fileDownloadService: FileDownloadService,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    @Inject(POSS_WEB_API_URL) private apiURL: string,
    @Inject(POSS_APP_TYPE) public appType
  ) {
    this.translateService
      .get(['pw.login.loginIdLable', 'pw.login.passwordLable'])
      .subscribe((translatedLabels: any) => {
        this.loginIdLable = translatedLabels['pw.login.loginIdLable'];
        this.passwordLable = translatedLabels['pw.login.passwordLable'];
      });
  }

  // convenience getter for easy access to form fields
  get IsValid() {
    if (this.loginForm !== undefined) {
      return this.loginForm.valid;
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name: ['', this.fieldValidatorsService.requiredField(this.loginIdLable)],
      password: [
        '',
        this.fieldValidatorsService.requiredField(this.passwordLable)
      ]
    });
  }

  //temp to be removed later
  //

  loginUser(loginForm) {
    this.loginClicked = true;
    this.login.emit(loginForm.value);
  }

  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.USER_AGENT,
      FilePathEnum.USER_AGENT
    );
  }

  getTitanADLoginUrl() {
    const url = getTitanADSamlLoginUrl();
    return `${this.apiURL}${url}`;
  }
}
