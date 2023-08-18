/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.math.BigDecimal;

import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.sales.dto.CustomerCouponDto;
import com.titan.poss.sales.dto.response.AccountDetailsDto;
import com.titan.poss.sales.dto.response.DiscountVoucherResponseDto;
import com.titan.poss.sales.service.BalanceService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Balance controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesBalanceController")
@RequestMapping(value = "sales/v2/balances")
public class BalanceController {

	@Autowired
	private BalanceService balanceService;

	// @formatter:off
	private static final String BALANCE_VIEW_PERMISSION = START + SalesAccessControls.CASH_MEMO_PAYMENT_VIEW + END + OR
			+ START + SalesAccessControls.ADVANCE_BOOKING_PAYMENT_VIEW + END + OR + START
			+ SalesAccessControls.CUSTOMER_ORDER_PAYMENT_VIEW + END;
	// @formatter:off

	/**
	 * This method will get gift card balance.
	 * 
	 * @param vendorCode
	 * @param cardNumber
	 * @param trackData
	 * @param otpRequired
	 * @return GcResponseDto
	 */
	@ApiOperation(value = "Get gift card balance", notes = "This API will return the gift card balance from 3rd party application which ever 3rd party is active at an instant")
	@GetMapping(value = "gift-cards")
	@PreAuthorize(BALANCE_VIEW_PERMISSION)
	public GcResponseDto giftCardBalance(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "cardNumber", value = "Gift Card Number", required = false) @RequestParam(name = "cardNumber", required = false) @PatternCheck(regexp = RegExConstants.GIFT_CARD_NUMBER_REGEX, message = "Invalid gift card number", nullCheck = false) String cardNumber,
			@ApiParam(name = "trackData", value = "Track data", required = false) @RequestParam(name = "trackData", required = false) @PatternCheck(regexp = RegExConstants.TRACK_DATA_REGEX, message = "Invalid track data", nullCheck = false) String trackData,
			@ApiParam(name = "otpRequired", value = "OTP required", required = false) @RequestParam(name = "otpRequired", required = false) Boolean otpRequired) {

		return balanceService.giftCardBalance(vendorCode, cardNumber, trackData, otpRequired);

	}

	/**
	 * This method will get ULP balance.
	 * 
	 * @param vendorCode
	 * @param ulpNo
	 * @return BigDecimal
	 */
	@ApiOperation(value = "Gets the Loyalty points balance", notes = "This API will return the balance points of the loyalty card in 3rd party loyalty application which ever 3rd party is active at an instant")
	@GetMapping(value = "ulp")
	@PreAuthorize(BALANCE_VIEW_PERMISSION)
	public BigDecimal loyaltyPointsBalance(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "ULP_NETCARROTS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "ulp_no", required = true) @RequestParam(name = "ulp_no", required = true) @PatternCheck(regexp = RegExConstants.ULP_ID_REGEX, message = "Invalid Ulp Id", nullCheck = true) String ulpNo) {

		return balanceService.loyaltyPointsBalance(vendorCode, ulpNo);
	}

	/**
	 * This method will give gift card/voucher customer details along with balance.
	 * 
	 * @param vendorCode
	 * @param giftCardNumber
	 * @return GcCustomerResponseDto
	 */
	@ApiOperation(value = "Get gift card customer info", notes = "This API will return the gift card customer info from 3rd party application which ever 3rd party is active at an instant")
	@GetMapping(value = "gift-cards/customer")
	@PreAuthorize(BALANCE_VIEW_PERMISSION)
	public GcCustomerResponseDto getGiftCardCustomerInfo(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "giftCardNumber", value = "Gift card number", required = true) @RequestParam(name = "giftCardNumber", required = true) @PatternCheck(regexp = RegExConstants.GIFT_CARD_NUMBER_REGEX, message = "Invalid gift card number", nullCheck = true) String giftCardNumber) {

		return balanceService.getGiftCardCustomerInfo(vendorCode, giftCardNumber);

	}

	/**
	 * This method will give account details based on account number.
	 * 
	 * @param vendorCode
	 * @param accountNumber
	 * @return AccountDetailsDto
	 */
	@ApiOperation(value = "Get account details", notes = "This API will return the account details and customer info from 3rd party application which ever 3rd party is active at an instant.<br>")
	@GetMapping(value = "account")
	@PreAuthorize(BALANCE_VIEW_PERMISSION)
	public AccountDetailsDto getAccountDetails(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "accountNo", value = "Account number", required = true) @RequestParam(name = "accountNo", required = true) @Positive Integer accountNo) {

		return balanceService.getAccountDetails(vendorCode, accountNo);

	}

	/**
	 * This method will get discount voucher details.
	 * 
	 * @param vendorCode
	 * @param discountVoucher
	 * @param accountNumber
	 * @return DiscountVoucherResponseDto
	 */
	@ApiOperation(value = "Get discount voucher details", notes = "This API will return the discount voucher details and customer info from 3rd party application which ever 3rd party is active at an instant.<br>")
	@GetMapping(value = "discount-voucher")
	public DiscountVoucherResponseDto getDiscountVoucherDetails(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "GHS", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "voucherNo", value = "Voucher number", required = true) @RequestParam(name = "voucherNo", required = true) @Positive Integer voucherNo,
			@ApiParam(name = "accountNo", value = "Account number", required = true) @RequestParam(name = "accountNo", required = true) @Positive Integer accountNo) {

		return balanceService.getDiscountVoucherDetails(vendorCode, voucherNo, accountNo);

	}

	/**
	 * This method will get digigold balance details.
	 * 
	 * @param mobileNumber
	 * @param transactionId
	 * @return DigiGoldBalanceResponseDto
	 */

	@ApiOperation(value = "digiGold API for getting the gold balance", notes = "This API will call the digi Gold system to get the gold balance based on the mobile number of the customer")
	@GetMapping("digi-gold")
	public DigiGoldBalanceResponseDto getDigiGoldBalance(
			@ApiParam(name = "mobileNo", value = "registered mobile number of the customer", required = true) @RequestParam(name = "mobileNo", required = true) String mobileNo,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {
		return balanceService.getDigiGoldBalance(mobileNo, transactionId);

	}

	/**
	 * This method will get digigold selling price details
	 * 
	 * @param mobileNumber
	 * @param transactionId
	 * @return DigiGoldSellingPriceDto
	 */

	@ApiOperation(value = "digiGold API for getting the selling price from digi gold", notes = "This API will call the digi Gold system to get the selling price")
	@GetMapping("digi-gold/price")
	public DigiGoldSellingPriceDto sellingPrice(
			@ApiParam(name = "mobileNo", value = "registered mobile number of the customer", required = true) @RequestParam(name = "mobileNo", required = true) String mobileNo,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId) {
		return balanceService.sellingPrice(mobileNo, transactionId);

	}

	/**
	 * This method will generate OTP for the digiGold redemption
	 * 
	 * @param mobileNo
	 * @param tanishqGoldGrams
	 * @param nonTanishqGoldGrams
	 * @param transactionId
	 * @param referenceId
	 * @return BooleanResponse
	 */

	@ApiOperation(value = "digiGold API for OTP request", notes = "This API will call the digi Gold system to get an One Time Password from verfication")
	@GetMapping("digi-gold/otp")
	public BooleanResponse sendDigiGoldOtp(
			@ApiParam(name = "mobileNo", value = "registered mobile number of the customer", required = true) @RequestParam(name = "mobileNo", required = true) String mobileNo,
			@ApiParam(name = "tanishqGoldGrams", value = "gold grams to be redeemed from tanishq gold balance", required = false) @RequestParam(name = "tanishqGoldGrams", required = false) BigDecimal tanishqGoldGrams,
			@ApiParam(name = "nonTanishqGoldGrams", value = "gold grams to be redeemed from non tanishq gold balance", required = false) @RequestParam(name = "nonTanishqGoldGrams", required = false) BigDecimal nonTanishqGoldGrams,
			@ApiParam(name = "transactionId", value = "transaction id of the transaction", required = true) @RequestParam(name = "transactionId", required = true) String transactionId,
			@ApiParam(name = "referenceId", value = "reference id of the transaction", required = true) @RequestParam(name = "referenceId", required = true) String referenceId) {

		return balanceService.sendDigiGoldOtp(mobileNo, tanishqGoldGrams, nonTanishqGoldGrams, transactionId,
				referenceId);
	}

	/**
	 * This method will send rivaah card coupon to the customer
	 * 
	 * @param customerId
	 * @return BooleanResponse
	 */

	@ApiOperation(value = "rivaah card coupon", notes = "This API will send the rivaah card coupon to the customer in case it's lost")
	@GetMapping("rivaah/coupon")
	public CustomerCouponDto sendRivaahCardCoupon(
			@ApiParam(name = "customerId", value = "customerId of the customer", required = true) @RequestParam(name = "customerId", required = true) Integer customerId,
			@ApiParam(name = "sendCoupon", value = "coupon needs to be sent to the customer or not", required = true) @RequestParam(name = "sendCoupon", required = true) Boolean sendCoupon) {
		return balanceService.sendRivaahCardCoupon(customerId, sendCoupon);
	}

}
