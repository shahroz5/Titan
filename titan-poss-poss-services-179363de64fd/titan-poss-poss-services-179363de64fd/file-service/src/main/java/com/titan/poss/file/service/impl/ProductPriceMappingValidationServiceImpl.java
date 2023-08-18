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
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.ProductPriceMappingDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.ProductPriceMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ProductPriceMappingValidationServiceImpl implements ProductPriceMappingValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Override
	public boolean dataValidation(ProductPriceMappingDto item) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item);

	}

	private boolean checkForInvalidData(ProductPriceMappingDto item) {
		if (!item.getProductGroupCode().matches(RegExConstants.PRODUCT_GROUP_CODE_REGEX)) {
			saveErrorAudit(item, "Product Group Code Invalid");
			return false;
		}
		return true;
	}

	private boolean checkForNull(ProductPriceMappingDto item) {
		if (StringUtils.isEmpty(item.getProductGroupCode())) {
			saveErrorAudit(item, "Product Group code cannot be empty");
			return false;
		}
		return true;
	}

	private void saveErrorAudit(ProductPriceMappingDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(StringUtils.isEmpty(item.getProductGroupCode()) ? MapperUtil.getJsonString(item)
				: item.getProductGroupCode());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

}
