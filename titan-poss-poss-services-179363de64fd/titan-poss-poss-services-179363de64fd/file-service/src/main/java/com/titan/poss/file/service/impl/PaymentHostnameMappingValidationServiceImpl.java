/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.PaymentHostnameMappingDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.PaymentHostnameMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PaymentHostnameMappingValidationServiceImpl implements PaymentHostnameMappingValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(PaymentHostnameMappingDto item, String paymentCode) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item, paymentCode);

	}

	private boolean checkForInvalidData(PaymentHostnameMappingDto item, String paymentCode) {
		if (!item.getPaymentCode().matches(paymentCode)) {
			saveErrorAudit(item, "Payment code should be " + paymentCode);
			return false;
		}
		if (!item.getHostName().matches(RegExConstants.ALPHA_NUMERIC_SPL_CHAR_REGEX_MAX_250)) {
			saveErrorAudit(item, "Host name should be alphanumeric");
			return false;
		}
		if (!StringUtils.isEmpty(item.getDeviceId()) && !item.getDeviceId().matches(RegExConstants.DEVICE_ID_REGEX)) {
			saveErrorAudit(item, "Device id should be 8 digit alphanumeric");
			return false;
		}
		if (!item.getLocationCode().matches(RegExConstants.LOCATION_CODE_REGEX)) {
			saveErrorAudit(item, "Incorrect location Code");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "is Active should be true or false");
			return false;
		}
		return true;
	}

	private boolean checkForNull(PaymentHostnameMappingDto item) {
		if (StringUtils.isEmpty(item.getPaymentCode())) {
			saveErrorAudit(item, "Payment code cannot be empty");
			return false;
		}
		if (StringUtils.isEmpty(item.getHostName())) {
			saveErrorAudit(item, "hostname cannot be empty");
			return false;
		}
		if (StringUtils.isEmpty(item.getLocationCode())) {
			saveErrorAudit(item, "Location code cannot be empty");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "Is Active cannot be empty");
			return false;
		}
		return true;
	}

	private void saveErrorAudit(PaymentHostnameMappingDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(
				StringUtils.isEmpty(item.getLocationCode()) ? MapperUtil.getJsonString(item) : item.getLocationCode());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

}
