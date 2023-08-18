/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.PaymentAuditDto;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.PaymentAuditService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for card payment audit
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationPaymentAuditController")
@RequestMapping(value = "integration/v2/payment/audit")
public class PaymentAuditController {

	@Autowired
	private PaymentAuditService paymentAuditService;

	// @formatter:off
	private static final String SAVE_PAYMENT_PERMISSION =  START+ SalesAccessControls.CASH_MEMO_PAYMENT_ADD_EDIT + END + OR 
			+ START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_ADD_EDIT + END + OR
			+ START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_ADD_EDIT + END;
	// @formatter:off

	@ApiOperation(value = "Save payment audit data", notes = "This API will return the saved payment audit data")
	@PostMapping()
	@PreAuthorize(SAVE_PAYMENT_PERMISSION)
	public PaymentAuditDto savePaymentCardAuditData(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "PAYMENT_UNIPAY", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "cardPaymentAuditDto", required = true) @RequestBody @Valid PaymentAuditDto cardPaymentAuditDto) {

		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return paymentAuditService.savePaymentAuditData(vendor, cardPaymentAuditDto);
	}
}
