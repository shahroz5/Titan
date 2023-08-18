/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountTypeMetaDataDao;
import com.titan.poss.config.repository.DiscountRepository;
import com.titan.poss.config.repository.DiscountTypeMetaDataRepository;
import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.DiscountExcludeItemMappingDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.DiscountExcludeItemMappingValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class DiscountExcludeItemMappingValidationServiceImpl implements DiscountExcludeItemMappingValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	DiscountTypeMetaDataRepository discountTypeMetaDataRepository;

	@Autowired
	DiscountRepository discountRepository;

	@Override
	public boolean dataValidation(DiscountExcludeItemMappingDto item) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item);
	}

	private boolean checkForInvalidData(DiscountExcludeItemMappingDto item) {
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

	private boolean checkForNull(DiscountExcludeItemMappingDto item) {
		if (StringUtils.isEmpty(item.getItemCode())) {
			saveErrorAudit(item, "Item Code cannot be empty");
			return false;
		}
		if (!BooleanUtils.isTrue(item.getIsExcluded()) && !BooleanUtils.isFalse(item.getIsExcluded())) {
			saveErrorAudit(item, "is Excluded cannot be empty");
			return false;
		}
		DiscountDao discountDao = discountRepository.findOneById(item.getDiscountId());
		if (discountDao == null) {
			saveErrorAudit(item, "Invalid discountId");
			return false;
		}
		DiscountTypeMetaDataDao discountTypeMetaDataDao = discountTypeMetaDataRepository
				.findByDiscountType(discountDao.getDiscountType());
		if (!discountTypeMetaDataDao.getExcludeMapping()) {
			saveErrorAudit(item, "Discount exclude item mapping is not allowed");
			return false;
		}
		return true;
	}

	private void saveErrorAudit(DiscountExcludeItemMappingDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(
				StringUtils.isEmpty(item.getItemCode()) ? MapperUtil.getJsonString(item) : item.getItemCode());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

}
