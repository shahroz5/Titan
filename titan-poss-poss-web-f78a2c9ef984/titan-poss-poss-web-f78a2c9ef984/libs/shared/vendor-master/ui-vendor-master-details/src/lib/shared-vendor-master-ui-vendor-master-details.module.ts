import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PaymentAirpayComponent } from './payment-airpay/payment-airpay.component';
import { AwsS3Component } from './aws-s3/aws-s3.component';
import { DialMilestoneComponent } from './dial-milestone/dial-milestone.component';
import { DialTridentComponent } from './dial-trident/dial-trident.component';
import { EmailValidationTitanComponent } from './email-validation-titan/email-validation-titan.component';
import { EmailGmailComponent } from './email-gmail/email-gmail.component';
import { ErpApiComponent } from './erp-api/erp-api.component';
import { GhsComponent } from './ghs/ghs.component';
import { IrnAsptaxComponent } from './irn-asptax/irn-asptax.component';
import { LegacyApiComponent } from './legacy-api/legacy-api.component';
import { UlpNetcarrotsComponent } from './ulp-netcarrots/ulp-netcarrots.component';
import { PanKhoslaComponent } from './pan-khosla/pan-khosla.component';
import { PaymentRazorpayComponent } from './payment-razorpay/payment-razorpay.component';
import { SafeGoldComponent } from './safe-gold/safe-gold.component';
import { EpossSftpComponent } from './eposs-sftp/eposs-sftp.component';
import { SmsKapComponent } from './sms-kap/sms-kap.component';
import { PossTitanComponent } from './poss-titan/poss-titan.component';
import { QcGcComponent } from './qc-gc/qc-gc.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [
    PaymentAirpayComponent,
    AwsS3Component,
    DialMilestoneComponent,
    DialTridentComponent,
    EmailValidationTitanComponent,
    EmailGmailComponent,
    ErpApiComponent,
    GhsComponent,
    IrnAsptaxComponent,
    LegacyApiComponent,
    UlpNetcarrotsComponent,
    PanKhoslaComponent,
    PaymentRazorpayComponent,
    SafeGoldComponent,
    EpossSftpComponent,
    SmsKapComponent,
    PossTitanComponent,
    QcGcComponent
  ]
})
export class SharedVendorMasterUiVendorMasterDetailsModule {}
