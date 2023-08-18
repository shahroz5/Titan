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
import com.titan.poss.file.dto.PayerBankDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.PayerBankValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class PayerBankValidationServiceImpl implements PayerBankValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(PayerBankDto item) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item);

	}
	private boolean checkForInvalidData(PayerBankDto item) {
		
		if(!item.getBankName().matches(RegExConstants.BANK_NAME_REGEX)) {
			saveErrorAudit(item, "Bank Name Validation Failed");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "is Active should be true or false");
			return false;
		}
		return true;
	}

	private boolean checkForNull(PayerBankDto item) {
		if (StringUtils.isEmpty(item.getBankName())) {
			saveErrorAudit(item, "Bank Name cannot be empty");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "is Active cannot be empty");
			return false;
		}
		return true;
	}

	private void saveErrorAudit(PayerBankDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(StringUtils.isEmpty(item.getBankName()) ? MapperUtil.getJsonString(item)
				: item.getBankName());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

}
