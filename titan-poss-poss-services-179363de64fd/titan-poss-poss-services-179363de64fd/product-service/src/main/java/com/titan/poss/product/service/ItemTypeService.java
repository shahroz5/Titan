/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.constants.ItemGroupEnum;
import com.titan.poss.product.dto.response.ItemTypeDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("itemTypeService")
public interface ItemTypeService {

	/**
	 * @param itemGroup
	 * @param isActive
	 * @param pageable
	 * @return
	 */
	public PagedRestResponse<List<ItemTypeDto>> listItemTypes(
			@ValueOfEnum(enumClass = ItemGroupEnum.class) String itemGroup, Boolean isActive, Pageable pageable);

}
