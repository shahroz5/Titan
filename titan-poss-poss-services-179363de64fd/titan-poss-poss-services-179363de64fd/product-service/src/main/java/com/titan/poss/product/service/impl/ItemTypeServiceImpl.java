/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dto.constants.ItemGroupEnum;
import com.titan.poss.product.dto.response.ItemTypeDto;
import com.titan.poss.product.repository.ItemTypeRepository;
import com.titan.poss.product.service.ItemTypeService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("itemTypeServiceImpl")
public class ItemTypeServiceImpl implements ItemTypeService {

	@Autowired
	ItemTypeRepository itemTypeRepo;

	@Override
	public PagedRestResponse<List<ItemTypeDto>> listItemTypes(
			@ValueOfEnum(enumClass = ItemGroupEnum.class) String itemGroup, Boolean isActive, Pageable pageable) {
		ItemTypeDao itemTypeCriteria = new ItemTypeDao();
		itemTypeCriteria.setIsActive(isActive);
		itemTypeCriteria.setItemGroup(itemGroup);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ItemTypeDao> criteria = Example.of(itemTypeCriteria, matcher);

		Page<ItemTypeDao> itemTypePage = itemTypeRepo.findAll(criteria, pageable);

		List<ItemTypeDto> itemTypeList = new ArrayList<>();

		itemTypePage.forEach(
				itemType -> itemTypeList.add((ItemTypeDto) MapperUtil.getObjectMapping(itemType, new ItemTypeDto())));

		return (new PagedRestResponse<>(itemTypeList, itemTypePage));
	}

}
