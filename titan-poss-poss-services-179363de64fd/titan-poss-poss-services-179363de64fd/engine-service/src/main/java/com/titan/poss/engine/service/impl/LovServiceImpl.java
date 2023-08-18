/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.dto.response.LovTypeDto;
import com.titan.poss.engine.service.LovService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("engineLovService")
public class LovServiceImpl implements LovService {

	@Override
	public ListResponse<LovTypeDto> getLocationLovTypes() {

		List<LovTypeDto> lovTypes = new ArrayList<>();

		// @formatter:off
		// PRODUCT
		com.titan.poss.product.constant.LovTypeEnum[] productEnumList = com.titan.poss.product.constant.LovTypeEnum.values();
		for (com.titan.poss.product.constant.LovTypeEnum lovTypeEnum : productEnumList) {
			lovTypes.add(new LovTypeDto(lovTypeEnum.toString(), lovTypeEnum.getLovName(), "product"));
		}
		
		// LOCATION
		com.titan.poss.location.dto.constants.LovTypeEnum[] locationEnumsList = com.titan.poss.location.dto.constants.LovTypeEnum.values();
		for (com.titan.poss.location.dto.constants.LovTypeEnum lovTypeEnum : locationEnumsList) {
			lovTypes.add(new LovTypeDto(lovTypeEnum.toString(), lovTypeEnum.getLovName(), "location"));
		}
		
		// INVENTORY
		com.titan.poss.inventory.constant.LovTypeEnum[] inventoryEnumList = com.titan.poss.inventory.constant.LovTypeEnum.values();
		for (com.titan.poss.inventory.constant.LovTypeEnum lovTypeEnum : inventoryEnumList) {
			lovTypes.add(new LovTypeDto(lovTypeEnum.toString(), lovTypeEnum.getLovName(), "inventory"));
		}

		// PAYMENT
		com.titan.poss.payment.constants.LovTypeEnum[] paymentEnumsList = com.titan.poss.payment.constants.LovTypeEnum.values();
		for (com.titan.poss.payment.constants.LovTypeEnum lovTypeEnum : paymentEnumsList) {
			lovTypes.add(new LovTypeDto(lovTypeEnum.toString(), lovTypeEnum.getLovName(), "payment"));
		}

		// CONFIG
		com.titan.poss.config.dto.constants.LovTypeEnum[] configEnumsList = com.titan.poss.config.dto.constants.LovTypeEnum.values();
		for (com.titan.poss.config.dto.constants.LovTypeEnum lovTypeEnum : configEnumsList) {
			lovTypes.add(new LovTypeDto(lovTypeEnum.toString(), lovTypeEnum.getLovName(), "config"));
		}
		
		// REPORT
		com.titan.poss.report.constants.LovTypeEnum[] reportEnumsList = com.titan.poss.report.constants.LovTypeEnum.values();
		for (com.titan.poss.report.constants.LovTypeEnum lovTypeEnum : reportEnumsList) {
			lovTypes.add(new LovTypeDto(lovTypeEnum.toString(), lovTypeEnum.getLovName(), "report"));
		}
		
		// @formatter:on

		// sort it based on LOV name
		Collections.sort(lovTypes);

		return new ListResponse<>(lovTypes);
	}

}
