/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */


package com.titan.poss.sales.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.sales.dto.COInBoundItemDetailsDto;
import com.titan.poss.sales.service.CustomerOrderInBoundService;

import io.swagger.annotations.ApiOperation;

/**
 * CustomerOrder Inbound controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@RequestMapping(value = "sales/v2/customer-orders/inbound")
public class CustomerOrderInBoundController 
{
	@Autowired
	private CustomerOrderInBoundService coInBoundService;
	

	/**
	 * 
	 * @param itemCode
	 * @param locationCode
	 * @return
	 */
	@ApiOperation(value = "API to search stock availability in nearest 5 locations", notes ="This API will list  nearest 5 locations along with price , tax and distance calculated between source locatiion and destinantion locations..")
	@GetMapping("/customer-orders/inbound")
	public List<COInBoundItemDetailsDto> searchAvailableItem(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = true) String locationCode) {
		return coInBoundService.searchAvailableItemList(itemCode, locationCode);
	}

}
