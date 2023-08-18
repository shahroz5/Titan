/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.constants.InvoiceDocumentTypeEnum;
import com.titan.poss.sales.service.CMNotificationService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("salesNotificationController")
@RequestMapping(value = "sales/v2/notifications")
public class CMNotificationController {
	
	@Autowired
	CMNotificationService cmNotificationService;
	
	// @formatter:off
		@ApiOperation(value = "This API will send notification according to document type", notes = " This API will will send the notification<br/>"
				+ "Ignore option field. No need to pass anything<br/>"
				+ "invoiceType - MAIL,PRINT,BOTH")
		// @formatter:on
		@PostMapping()
		public void sendNotification(
				@RequestParam(required = false)  String transactionId,
				@RequestParam(required = false, defaultValue="PRINT") @ApiParam(value = "provide Invoice Type", allowableValues = "PRINT, MAIL, BOTH", required = false) @ValueOfEnum(enumClass = InvoiceDocumentTypeEnum.class) String invoiceType,
				@RequestParam(required = false, defaultValue = "false") @ApiParam (value = "isReprint", required = false)  Boolean isReprint,
				HttpServletRequest request)
		{
			cmNotificationService.sendNotification(transactionId, invoiceType, isReprint, null, null);
		}

}
