/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.service.AirpayConfigValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.integration.dto.AirpayConfigDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class AirpayConfigValidationServiceImpl implements AirpayConfigValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(AirpayConfigDto airpayConfigDto) {
		if (!checkForNull(airpayConfigDto)) {
			return false;
		}
		return checkForInvalidData(airpayConfigDto);
	}

	private boolean checkForNull(AirpayConfigDto airpayConfigDto) {
		if (StringUtils.isEmpty(airpayConfigDto.getLocationCode())) {
			saveErrorAudit(airpayConfigDto, "Location code cannot be empty");
			return false;
		}
		if (StringUtils.isEmpty(airpayConfigDto.getMerchantId())) {
			saveErrorAudit(airpayConfigDto, "Merchant Id cannot be empty");
			return false;
		}
		if (StringUtils.isEmpty(airpayConfigDto.getUsername())) {
			saveErrorAudit(airpayConfigDto, "User name cannot be empty");
			return false;

		}
		if (StringUtils.isEmpty(airpayConfigDto.getPassword())) {
			saveErrorAudit(airpayConfigDto, "Password cannot be empty");
			return false;

		}
		if (StringUtils.isEmpty(airpayConfigDto.getSecretKey())) {
			saveErrorAudit(airpayConfigDto, "Secret key cannot be empty");
			return false;

		}
		if (StringUtils.isEmpty(airpayConfigDto.getSecretToken())) {
			saveErrorAudit(airpayConfigDto, "Secret token cannot be empty");
			return false;

		}
		return true;
	}

	private boolean checkForInvalidData(AirpayConfigDto airpayConfigDto) {
		if (!StringUtils.isEmpty(airpayConfigDto.getLocationCode())
				&& !airpayConfigDto.getLocationCode().matches(RegExConstants.LOCATION_CODE_REGEX)) {
			saveErrorAudit(airpayConfigDto, "Invalid Location code. It can be upto 20 Alphanumeric characters");
			return false;

		}
		if (!StringUtils.isEmpty(airpayConfigDto.getMerchantId())
				&& !airpayConfigDto.getMerchantId().matches(RegExConstants.AIRPAY_MERCHANT_ID_REGEX)) {
			saveErrorAudit(airpayConfigDto, "Invalid Merchant Id. It can be upto 12 digits");
			return false;

		}
		if (!StringUtils.isEmpty(airpayConfigDto.getUsername())
				&& !airpayConfigDto.getUsername().matches(RegExConstants.AIRPAY_USERNAME_REGEX)) {
			saveErrorAudit(airpayConfigDto, "Invalid user name. It should be 7 digits");
			return false;

		}
		if (!StringUtils.isEmpty(airpayConfigDto.getPassword())
				&& !airpayConfigDto.getPassword().matches(RegExConstants.AIRPAY_PASS_WORD_REGEX)) {
			saveErrorAudit(airpayConfigDto, "Invalid password. It should be 8 Alphanumeric characters");
			return false;

		}
		if (!StringUtils.isEmpty(airpayConfigDto.getSecretKey())
				&& !airpayConfigDto.getSecretKey().matches(RegExConstants.AIRPAY_SECRET_KEY_REGEX)) {
			saveErrorAudit(airpayConfigDto, "Invalid secret key. It should be 16 Alphanumeric characters");
			return false;

		}
		if (!StringUtils.isEmpty(airpayConfigDto.getSecretToken())
				&& !airpayConfigDto.getSecretToken().matches(RegExConstants.AIRPAY_SECRET_TOKEN_REGEX)) {
			saveErrorAudit(airpayConfigDto, "Invalid secret token. It should be 15 Alphanumeric characters");
			return false;

		}
		return true;
	}

	private void saveErrorAudit(AirpayConfigDto item, String errorMsg) {
		String primaryData = StringUtils.isEmpty(item.getLocationCode()) ? item.getMerchantId()
				: item.getLocationCode();
		dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(item), errorMsg, item.getFileAuditId(),
				ErrorTypeEnum.ERROR.toString());
	}
}
