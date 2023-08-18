/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.enums.DocumentTypeEnum;
import com.titan.poss.engine.service.StoreService;
import com.titan.poss.store.dto.respond.PrinterConfigDto;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("storeEngineController")
@RequestMapping(value = "engine/v2/stores")
public class StoreController {

	@Autowired
	private StoreService storeService;

	@ApiOperation(value = "Get a Printer Configs", notes = "This API returns an active Pinter Configs based on **documentType**")
	@GetMapping("/printer-configs")
	public PrinterConfigDto getPrinterConfig(
			@RequestParam(required = true) @ApiParam(required = true, value = "Document Type", allowableValues = "CUSTOMER_PRINT, GUARANTEE_CARD, DEPOSIT_SLIP, STOCK_PRINT") @ValueOfEnum(enumClass = DocumentTypeEnum.class) String documentType) {
		return storeService.getPrinterConfigService(documentType);
	}
}