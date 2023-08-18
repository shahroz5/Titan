package com.titan.poss.file.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.EmployeeLoanValidationService;

@Component
public class EmployeeLoanValidationServiceImpl implements EmployeeLoanValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(EmployeeLoanConfigWriterDto item) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item);
	}

	private boolean checkForInvalidData(EmployeeLoanConfigWriterDto item) {

		if (!item.getMobileNo().matches(RegExConstants.IND_MOBILE_REGEX)) {
			saveErrorAudit(item, "Mobile Number Validation Failed");
			return false;
		}

		if (item.getAmountEligibility().compareTo(BigDecimal.ZERO) == 0) {
			saveErrorAudit(item, "Eligible Amount Validation Failed");
			return false;
		}

		if (!item.getMobileNo().matches(RegExConstants.IND_MOBILE_REGEX)) {
			saveErrorAudit(item, "Mobile Number Validation Failed");
			return false;
		}

		// Split the product group with "," and add those records to
		// employee_product_mapping table
		String[] productGrp = item.getProductGrpCodes().trim().split(",");
		for (String products : productGrp) {
			if (!products.matches(RegExConstants.PRODUCT_GROUP_CODE_REGEX)) {
				saveErrorAudit(item, "Product Group Code - " + products + "  Invalid");
				return false;
			}
		}

		// Split the product group with "," and add those records to
		// employee_location_mapping table
		String[] locationCodes = item.getLocationCodes().trim().split(",");

		for (String locationCode : locationCodes) {
			if (!locationCode.matches(RegExConstants.LOCATION_CODE_REGEX)) {
				saveErrorAudit(item, "Location Code - " + locationCode + " Invalid");
				return false;
			}
		}

//		if (!checkDateValid(item.getApprovalDate())) {
//			saveErrorAudit(item, "Approval Date- "+ item.getApprovalDate().toString() + " Format is Invalid");
//			return false;
//		}
//		
//		if (!checkDateValid(item.getValidaityDate())) {
//			saveErrorAudit(item, "Validity Date- "+ item.getValidaityDate().toString() + "  Format is Invalid");
//			return false;
//		}

		return true;
	}

	private boolean checkForNull(EmployeeLoanConfigWriterDto item) {

		if (StringUtils.isEmpty(item.getEmployeeName())) {
			saveErrorAudit(item, "Employee Name cannot be empty");
			return false;
		}
		if (StringUtils.isEmpty(item.getEmployeeCode())) {
			saveErrorAudit(item, "Employee Code cannot be empty");
			return false;
		}

		if (StringUtils.isEmpty(item.getMobileNo())) {
			saveErrorAudit(item, "Mobile Number cannot be empty");
			return false;
		}

		if (item.getAmountEligibility() == null) {
			saveErrorAudit(item, "Amount Eligibility cannot be empty");
			return false;
		}

		if (item.getApprovalDate() == null) {
			saveErrorAudit(item, "Approval Date cannot be empty");
			return false;
		}

		if (item.getValidaityDate() == null) {
			saveErrorAudit(item, "Validity Date cannot be empty");
			return false;
		}

		if (StringUtils.isEmpty(item.getProductGrpCodes().toString())) {
			saveErrorAudit(item, "Applicable CFA Code cannot be empty");
			return false;
		}

		if (StringUtils.isEmpty(item.getLocationCodes().toString())) {
			saveErrorAudit(item, "Location Codes cannot be empty");
			return false;
		}

		if (StringUtils.isEmpty(item.getMargin())) {
			saveErrorAudit(item, "Margin cannot be empty");
			return false;
		}

		if (StringUtils.isEmpty(item.getOtpRequired())) {
			saveErrorAudit(item, "OTP Required cannot be empty");
			return false;
		}

		if (StringUtils.isEmpty(item.getRedeemability())) {
			saveErrorAudit(item, "Readeemablity cannot be empty");
			return false;
		}

		return true;
	}

	private void saveErrorAudit(EmployeeLoanConfigWriterDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(
				StringUtils.isEmpty(item.getEmployeeName()) ? MapperUtil.getJsonString(item) : item.getEmployeeName());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

	private boolean checkDateValid(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
		try {
			sdf.setLenient(false);
			sdf.format(date);
			sdf.parse(sdf.format(date));
			return true;
		} catch (Exception e) {
			return false;
		}
	}

}
