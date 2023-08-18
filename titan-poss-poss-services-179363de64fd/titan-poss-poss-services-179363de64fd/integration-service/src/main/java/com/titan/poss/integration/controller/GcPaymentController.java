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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.GiftCardService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for corporate user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("IntegrationGcPaymentController")
@RequestMapping(value = "integration/v2/payment/gift-cards")
public class GcPaymentController {

	@Autowired
	private GiftCardService giftCardService;

	// @formatter:off
		private static final String BALANCE_VIEW_PERMISSION =  START+ SalesAccessControls.CASH_MEMO_PAYMENT_VIEW + END + OR 
			+ START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_VIEW + END + OR
			+ START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_VIEW + END;
	// @formatter:off
		
	// @formatter:off
	private static final String GC_REDEEM_PERMISSION =  START+ SalesAccessControls.CASH_MEMO_PAYMENT_ADD_EDIT + END + OR 
			+ START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_ADD_EDIT + END + OR
			+ START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_ADD_EDIT + END;
	// @formatter:off
		
	@ApiOperation(value = "Get gift card balance", notes = "This API will return the gift card balance from 3rd party application which ever 3rd party is active at an instant"
			+ "<br>" + "Set otp required to true for ghs cards")
	@GetMapping()
	@PreAuthorize(BALANCE_VIEW_PERMISSION)
	public GcResponseDto getGiftCardBalance(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "cardNumber", value = "Gift Card Number", required = false) @RequestParam(name = "cardNumber", required = false) @PatternCheck(regexp = RegExConstants.GIFT_CARD_NUMBER_REGEX, message = "Invalid gift card number", nullCheck = false) @Valid String cardNumber,
			@ApiParam(name = "trackData", value = "Track data", required = false) @RequestParam(name = "trackData", required = false) @PatternCheck(regexp = RegExConstants.TRACK_DATA_REGEX, message = "Invalid track data", nullCheck = false) @Valid String trackData,
			@ApiParam(name = "otpRequired", value = "OTP required", required = true) @RequestParam(name = "otpRequired", required = true) Boolean otpRequired,
			@ApiParam(name = "giftCardType", value = "Gift card type", required = true) @RequestParam(name = "giftCardType", required = true) GiftCardTypeEnum giftCardType) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return giftCardService.getBalance(vendor, cardNumber, trackData, otpRequired, giftCardType);

	}

	@ApiOperation(value = "Redeem gift card balance", notes = "This API will redeem the gift card balance from 3rd party application which ever 3rd party is active at an instant")
	@PostMapping(value = "")
	@PreAuthorize(GC_REDEEM_PERMISSION)
	public GcResponseDto redeemGiftCardBalance(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Gift card redeem dto", required = true) @RequestBody @Valid GiftCardBaseRedeemRequestDto giftCardRedeemRequestDto,
			@ApiParam(name = "giftCardType", value = "Gift card type", required = true) @RequestParam(name = "giftCardType", required = true) GiftCardTypeEnum giftCardType) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return giftCardService.redeemGiftCardBalanace(vendor, giftCardRedeemRequestDto, giftCardType);
	}
	
	@ApiOperation(value = "Reverse Redeem gift card balance", notes = "This API will redeem the gift card balance from 3rd party application which ever 3rd party is active at an instant")
	@PostMapping(value = "/reverse-redeem")
	@PreAuthorize(GC_REDEEM_PERMISSION)
	public GcResponseDto reverseRedeemGiftCardBalance(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "body", value = "Gift card redeem dto", required = true) @RequestBody @Valid GiftCardBaseReverseRedeemRequestDto giftCardReverseRedeemRequestDto,
			@ApiParam(name = "giftCardType", value = "Gift card type",allowableValues = "EMPLOYEE_CODE,GIFTCARD_CODE", required = true) @RequestParam(name = "giftCardType", required = true) GiftCardTypeEnum giftCardTypeEnum) {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(vendorCode);
		return giftCardService.reverseRedeem(vendor, giftCardReverseRedeemRequestDto, giftCardTypeEnum);
	}

	@ApiOperation(value = "Get gift card customer info", notes = "This API will return the gift card customer info from 3rd party application which ever 3rd party is active at an instant")
	@GetMapping(value = "/customer")
	@PreAuthorize(BALANCE_VIEW_PERMISSION)
	public GcCustomerResponseDto getGiftCardCustomerInfo(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "giftCardNumber", value = "Gift card number", required = true) @PatternCheck(regexp = RegExConstants.GIFT_CARD_NUMBER_REGEX, message = "Invalid gift card number", nullCheck = false) @RequestParam @Valid String giftCardNumber) {
		VendorDao vendorDao = new VendorDao();
		vendorDao.setVendorCode(vendorCode);
		return giftCardService.getCustomerInfo(vendorDao, giftCardNumber);
	}

}
