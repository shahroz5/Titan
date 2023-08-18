import {
  EmployeeLoanSuccessList,
  EmployeeLoanConfigList
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class EmployeeLoanConfigurationAdaptor {

  static employeeLoanConfigList(data: any): EmployeeLoanSuccessList {
    const empConfigList: EmployeeLoanConfigList[] = [];

    if (!data) {
      return null;
    } else {
      data.results.forEach(element => {
        if (element) {
          empConfigList.push({
            id: element.id,
            empName: element.employeeDetails ? JSON.parse(element.employeeDetails)?.employeeName : undefined,
            empMobileNum: element.employeeDetails ? JSON.parse(element.employeeDetails)?.mobileNumber : undefined,
            eligibleAmount: element.eligibleAmount,
            approvalDate: moment(element.approvalDate),
            validityDate: moment(element.validityDate),
            applicableCFACodes: element.productGroupCodes?.toString(),
            applicableLocationCodes: element.locationCode?.toString(),
            marginPercentage: element.loanConfigDetails ? JSON.parse(element.loanConfigDetails)?.margin : undefined,
            validationOTP: element.loanConfigDetails ? JSON.parse(element.loanConfigDetails)?.otpRequired : undefined,
            partialRedeemableAmt: element.loanConfigDetails ? JSON.parse(element.loanConfigDetails)?.partlyRedeemable : undefined,
            empCode: element.employeeCode
          });
        }
      });
      return { configList: empConfigList, count: data.totalElements };
    }
  }

  static employeeLoanDetails(data: any): EmployeeLoanConfigList {
    if (!data) {
      return null;
    } else {
      const empConfigList: EmployeeLoanConfigList = {
        id: data.id,
        empName: data.employeeDetails ? JSON.parse(data.employeeDetails)?.employeeName : undefined,
        empMobileNum: data.employeeDetails ? JSON.parse(data.employeeDetails)?.mobileNumber : undefined,
        eligibleAmount: data.eligibleAmount,
        customerId: data.customerId,
        approvalDate: moment(data.approvalDate),
        validityDate: moment(data.validityDate),
        applicableCFACodes: data.productGroupCodes?.toString(),
        applicableLocationCodes: data.locationCode?.toString(),
        marginPercentage: data.loanConfigDetails ? JSON.parse(data.loanConfigDetails)?.margin : undefined,
        validationOTP: data.loanConfigDetails ? JSON.parse(data.loanConfigDetails)?.otpRequired : undefined,
        partialRedeemableAmt: data.loanConfigDetails ? JSON.parse(data.loanConfigDetails)?.partlyRedeemable : undefined,
        empCode: data.employeeCode
      }
      return empConfigList;
    }
  }
}
