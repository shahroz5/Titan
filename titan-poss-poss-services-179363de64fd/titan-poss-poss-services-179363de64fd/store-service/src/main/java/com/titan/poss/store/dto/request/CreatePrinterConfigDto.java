/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.dto.request;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.DocumentTypeEnum;
import com.titan.poss.store.dto.constants.StoreConstants;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CreatePrinterConfigDto {
	@ValueOfEnum(enumClass = DocumentTypeEnum.class)
	private String documentType;
	@PatternCheck(message = StoreConstants.INVALID_PRINTER, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255)
	private String printerName;
}
