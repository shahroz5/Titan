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
import com.titan.poss.file.dto.CardDetailsDto;
import com.titan.poss.file.service.CardDetailsValidationService;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class CardDetailsValidationServiceImpl implements CardDetailsValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(CardDetailsDto item) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item);

	}

	private boolean checkForInvalidData(CardDetailsDto item) {
		if (!item.getCardNo().matches(RegExConstants.CARD_NO_LENGTH_REGEX)) {
			saveErrorAudit(item, "Card Number Validation Failed:Please check the CardNumber");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "is Active should be true or false");
			return false;
		}
		return true;
	}

	private boolean checkForNull(CardDetailsDto item) {
		if (StringUtils.isEmpty(item.getCardNo())) {
			saveErrorAudit(item, "Card Number cannot be empty");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "is Active cannot be empty");
			return false;
		}
		return true;
	}

	private void saveErrorAudit(CardDetailsDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(StringUtils.isEmpty(item.getCardNo()) ? MapperUtil.getJsonString(item)
				: item.getCardNo());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

}
