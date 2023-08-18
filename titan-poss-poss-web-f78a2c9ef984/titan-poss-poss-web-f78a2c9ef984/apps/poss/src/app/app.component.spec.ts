import { RouterTestingModule } from '@angular/router/testing';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from '@poss-web/shared/auth/feature-auth';
import { AppSettingService } from '@poss-web/shared/appsetting/feature-appsetting';
import { LocationSettingsFeatureService } from '@poss-web/shared/location-settings/feature-location-settings';
import { TranslateService } from '@ngx-translate/core';

describe('AppComponent', () => {
  // let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let authServiceSpy;
  let appSettingSpy;
  let locationSettingsServiceSpy;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj(['isUserLoggedIn']);
    appSettingSpy = jasmine.createSpyObj(['getLanguage']);
    locationSettingsServiceSpy = jasmine.createSpyObj(['loadLocationSettings']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        CommonCustomMaterialModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceSpy
        },
        {
          provide: AppSettingService,
          useValue: appSettingSpy
        },
        {
          provide: LocationSettingsFeatureService,
          useValue: locationSettingsServiceSpy
        },

        {
          provide: TranslateService,
          useValue: {
            use: () => {}
          }
        }
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    appSettingSpy.getLanguage.and.returnValue(of(null));
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'POSS - Boutique Point Of Sale'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('POSS - Boutique Point Of Sale');
  });
});
