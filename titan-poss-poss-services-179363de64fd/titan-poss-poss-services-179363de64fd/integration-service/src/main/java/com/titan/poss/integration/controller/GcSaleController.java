/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseActivateRequestDto;
import com.titan.poss.core.dto.GiftCardBaseCancelActivateDto;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.GiftCardService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for gift card sale.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationGcController")
@RequestMapping(value = "integration/v2/sale/gift-cards")
public class GcSaleController {

	@Autowired
	private GiftCardService giftCardService;

	private static final String GIFT_CARD_SALE_PERMISSION = START + SalesAccessControls.GIFT_CARD_SALE + END;

	private static final String GIFT_CARD_CANCEL_PERMISSION = START + SalesAccessControls.GIFT_CARD_CANCEL + END;

	@ApiOperation(value = "Activate gift card", notes = "This API will activate the gift card from 3rd party application which ever 3rd party is active at an instant")
	@PostMapping()
	@PreAuthorize(GIFT_CARD_SALE_PERMISSION)
	public GcActivateResponseDto activateGiftCard(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Gift card activate dto", required = true) @RequestBody @Valid GiftCardBaseActivateRequestDto giftCardActivateRequestDto) {
		VendorDao vendorDao = new VendorDao();
		vendorDao.setVendorCode(vendorCode);
		return giftCardService.activateGiftCard(vendorDao, giftCardActivateRequestDto);

	}

	@ApiOperation(value = "Cancel activate gift card", notes = "This API will cancel the activation of the gift card  from 3rd party application which ever 3rd party is active at an instant")
	@PutMapping()
	@PreAuthorize(GIFT_CARD_CANCEL_PERMISSION)
	public GcResponseDto cancelActivateGiftCard(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Gift card cancel activate dto", required = true) @RequestBody @Valid GiftCardBaseCancelActivateDto giftCardCancelActivateDto) {
		VendorDao vendorDao = new VendorDao();
		vendorDao.setVendorCode(vendorCode);
		return giftCardService.cancelActivate(vendorDao, giftCardCancelActivateDto);

	}
}
