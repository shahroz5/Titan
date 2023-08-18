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
import com.titan.poss.file.dto.ComplexityPriceGroupConfigReaderDto;
import com.titan.poss.file.service.ComplexityPriceGroupMappingValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.product.repository.ComplexityRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class ComplexityPriceGroupMappingValidationServiceImpl implements ComplexityPriceGroupMappingValidationService {

	@Autowired
	private DataAuditService dataAuditService;
	@Autowired
	private ComplexityRepository complexityRepository;

	@Override
	public boolean dataValidation(ComplexityPriceGroupConfigReaderDto item) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item);

	}

	private boolean checkForInvalidData(ComplexityPriceGroupConfigReaderDto item) {
		if (!item.getComplexitycode().matches(RegExConstants.COMPLEXITY_CODE_REGEX)) {
			saveErrorAudit(item, "Complexity Code Invalid");
			return false;
		}
		
		/*String[] complexitycode = item.getComplexitycode().trim().split(",");
		for (String complexity : complexitycode ) {
			if (!complexity.matches(RegExConstants.COMPLEXITY_CODE_REGEX)) {
				saveErrorAudit(item, "Complexity Code - " + complexity + "Invalid");
				return false;
			}*/
		//}
		

		if (!item.getPricegroup().matches(RegExConstants.PRICE_GROUP_REGEX)) {
			saveErrorAudit(item, "PriceGroup Invalid");
			return false;
		}
		
		if (!item.getWastagepercentage().matches(RegExConstants.WASTAGE_PCT_REGEX)) {
			saveErrorAudit(item, "Wastage Pct Invalid");
			return false;
		}
		

		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "is Active should be true or false");
			return false;
		}

		return true;
	}

	private boolean checkForNull(ComplexityPriceGroupConfigReaderDto item) {
		if (StringUtils.isEmpty(item.getComplexitycode())) {
			saveErrorAudit(item, "Complexity code cannot be empty");
			return false;
		}
		
		if (StringUtils.isEmpty(item.getPricegroup())) {
			saveErrorAudit(item, "Price Group cannot be empty");
			return false;
		}
		
		if (!BooleanUtils.isTrue(item.getIsActive()) && !BooleanUtils.isFalse(item.getIsActive())) {
			saveErrorAudit(item, "is Active cannot be empty");
			return false;
		}
		
		if (StringUtils.isEmpty(item.getMakingChargesPerUnit())) {
			saveErrorAudit(item, "Making Charge Per Unit cannot be empty");
			return false;
		}
		
		if (StringUtils.isEmpty(item.getMakingchargespergram())) {
			saveErrorAudit(item, "Making Charges Per Gram cannot be empty");
			return false;
		}
		
		if (StringUtils.isEmpty(item.getMakingChargePercentage())) {
			saveErrorAudit(item, "Making Charges Percentage cannot be empty");
			return false;
		}
		
		if (StringUtils.isEmpty(item.getWastagepercentage())) {
			saveErrorAudit(item, "Wastage Percentage cannot be empty");
			return false;
		}
		return true;
	}

	private void saveErrorAudit(ComplexityPriceGroupConfigReaderDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(StringUtils.isEmpty(item.getComplexitycode()) ? item.getPricegroup()
				: item.getComplexitycode());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

}
