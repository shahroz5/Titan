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
import com.titan.poss.file.dto.GepConfigExcludeMappingDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.GepConfigExcludeMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class GepConfigExcludeMappingValidationServiceImpl implements GepConfigExcludeMappingValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(GepConfigExcludeMappingDto item) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item);
	}


	private boolean checkForInvalidData(GepConfigExcludeMappingDto item) {
		if (!item.getItemCode().matches(RegExConstants.ITEM_CODE_REGEX)) {
			saveErrorAudit(item, "Item code validation failed");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsExcluded()) && !BooleanUtils.isFalse(item.getIsExcluded())) {
			saveErrorAudit(item, "Is Excluded should be true or false");
			return false;
		}
		return true;
	}

	
	private boolean checkForNull(GepConfigExcludeMappingDto item) {
		if (StringUtils.isEmpty(item.getItemCode())) {
			saveErrorAudit(item, "Item Code cannot be empty");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsExcluded()) && !BooleanUtils.isFalse(item.getIsExcluded())) {
			saveErrorAudit(item, "is Excluded cannot be empty");
			return false;
		}
		return true;
	}

	private void saveErrorAudit(GepConfigExcludeMappingDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(StringUtils.isEmpty(item.getItemCode()) ? MapperUtil.getJsonString(item)
				: item.getItemCode());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

}
