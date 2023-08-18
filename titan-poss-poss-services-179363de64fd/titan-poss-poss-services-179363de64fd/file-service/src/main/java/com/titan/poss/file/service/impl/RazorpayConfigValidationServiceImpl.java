/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.RazorpayConfigDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.RazorpayConfigValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class RazorpayConfigValidationServiceImpl implements RazorpayConfigValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(RazorpayConfigDto razorpayConfigDto) {
		if (!checkForNull(razorpayConfigDto)) {
			return false;
		}
		return checkForInvalidData(razorpayConfigDto);
	}

	private boolean checkForNull(RazorpayConfigDto razorpayConfigDto) {
		if (StringUtils.isEmpty(razorpayConfigDto.getLocationCode())) {
			saveErrorAudit(razorpayConfigDto, "Location code cannot be empty");
			return false;
		}
		if (StringUtils.isEmpty(razorpayConfigDto.getAccountId())) {
			saveErrorAudit(razorpayConfigDto, "Account Id cannot be empty");
			return false;
		}
		return true;
	}

	private boolean checkForInvalidData(RazorpayConfigDto razorpayConfigDto) {
		if (!StringUtils.isEmpty(razorpayConfigDto.getLocationCode())
				&& !razorpayConfigDto.getLocationCode().matches(RegExConstants.LOCATION_CODE_REGEX)) {
			saveErrorAudit(razorpayConfigDto, "Invalid Location code. It can be upto 20 Alphanumeric characters");
			return false;

		}
		if (!StringUtils.isEmpty(razorpayConfigDto.getAccountId())
				&& !razorpayConfigDto.getAccountId().matches(RegExConstants.ALPHA_NUMERIC_REGEX_MAX_50)) {
			saveErrorAudit(razorpayConfigDto, "Invalid Account Id. It can be upto 50 Alphanumeric characters");
			return false;

		}
		return true;
	}

	private void saveErrorAudit(RazorpayConfigDto item, String errorMsg) {
		String primaryData = StringUtils.isEmpty(item.getLocationCode()) ? item.getAccountId()
				: item.getLocationCode();
		dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(item), errorMsg, item.getFileAuditId(),
				ErrorTypeEnum.ERROR.toString());
	}
}
