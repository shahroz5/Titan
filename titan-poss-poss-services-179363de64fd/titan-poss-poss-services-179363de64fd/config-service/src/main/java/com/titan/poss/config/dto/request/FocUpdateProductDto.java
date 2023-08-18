/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request;

import java.util.List;

import com.titan.poss.config.dto.constants.CategoryEnum;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.ItemTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocUpdateProductDto {

	List<String> addProducts;

	List<String> removeProducts;

	@ValueOfEnum(message = ConfigConstants.INVALID_CATEGORY, enumClass = CategoryEnum.class)
	private String category;
	
	@ValueOfEnum(message = ConfigConstants.INVALID_ITEM_TYPE, enumClass = ItemTypeEnum.class)
	private String itemType;
}
