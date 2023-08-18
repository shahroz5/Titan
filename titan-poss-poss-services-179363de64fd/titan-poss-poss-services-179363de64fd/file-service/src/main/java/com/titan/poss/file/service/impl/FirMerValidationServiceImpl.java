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
import com.titan.poss.file.dto.FirMerFileDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.FirMerValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class FirMerValidationServiceImpl implements FirMerValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(FirMerFileDto firMerFileDto) {
		boolean valid = true;
		if (!checkForNull(firMerFileDto, valid)) {
			return false;
		}
		return checkForInvalidData(firMerFileDto, valid);
	}

	private boolean checkForNull(FirMerFileDto firMerFileDto, boolean valid) {
		if (StringUtils.isEmpty(firMerFileDto.getItemCode())) {
			valid = false;
			saveErrorAudit(firMerFileDto, "Item code cannot be empty");
		}
		if (StringUtils.isEmpty(firMerFileDto.getLotNumber())) {
			valid = false;
			saveErrorAudit(firMerFileDto, "lot number cannot be empty");
		}
		if (StringUtils.isEmpty(firMerFileDto.getUnitWeight())) {
			valid = false;
			saveErrorAudit(firMerFileDto, "Unit weight cannot be empty");
		}
		if (StringUtils.isEmpty(firMerFileDto.getQuantity())) {
			valid = false;
			saveErrorAudit(firMerFileDto, "Quantity cannot be empty");
		}
		if (StringUtils.isEmpty(firMerFileDto.getInitiatedLocationCode())) {
			valid = false;
			saveErrorAudit(firMerFileDto, "Initiated location code cannot be empty");
		}
		if (StringUtils.isEmpty(firMerFileDto.getSourceLocationCode())) {
			valid = false;
			saveErrorAudit(firMerFileDto, "Source location code cannot be empty");
		}
		if (StringUtils.isEmpty(firMerFileDto.getDestinationLocationCode())) {
			valid = false;
			saveErrorAudit(firMerFileDto, "Destination location code cannot be empty");
		}
		return valid;
	}

	private boolean checkForInvalidData(FirMerFileDto firMerFileDto, boolean valid) {
		if (!StringUtils.isEmpty(firMerFileDto.getInitiatedLocationCode())
				&& !firMerFileDto.getInitiatedLocationCode().matches(RegExConstants.LOCATION_CODE_REGEX)) {
			valid = false;
			saveErrorAudit(firMerFileDto, "Invalid Initiated Location code. It can be upto 20 Alphanumeric characters");
		}
		if (!StringUtils.isEmpty(firMerFileDto.getSourceLocationCode())
				&& !firMerFileDto.getInitiatedLocationCode().matches(RegExConstants.LOCATION_CODE_REGEX)) {
			valid = false;
			saveErrorAudit(firMerFileDto, "Invalid Source Location code. It can be upto 20 Alphanumeric characters");
		}
		if (!StringUtils.isEmpty(firMerFileDto.getDestinationLocationCode())
				&& !firMerFileDto.getInitiatedLocationCode().matches(RegExConstants.LOCATION_CODE_REGEX)) {
			valid = false;
			saveErrorAudit(firMerFileDto,
					"Invalid Destination Location code. It can be upto 20 Alphanumeric characters");
		}
		return valid;
	}

	private void saveErrorAudit(FirMerFileDto firMerFileDto, String errorMsg) {
		String primaryData = StringUtils.isEmpty(firMerFileDto.getItemCode()) ? firMerFileDto.getLotNumber()
				: firMerFileDto.getItemCode();
		dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(firMerFileDto), errorMsg,
				firMerFileDto.getFileId(), ErrorTypeEnum.ERROR.toString());
	}

}
