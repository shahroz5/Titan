/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.dto.request;

import java.math.BigDecimal;

import javax.validation.constraints.Digits;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.payment.constants.GiftCardRedemptionTypeEnum;
import com.titan.poss.payment.constants.GiftCardTypeEnum;
import com.titan.poss.payment.constants.PaymentCategoryEnum;
import com.titan.poss.payment.constants.PaymentConstants;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Payment Category Update Dto")
@Data
public class PaymentCategoryUpdateDto {

	@ApiModelProperty(position = 1, value = "Name of the description", name = "description", required = true, example = "Retail Group")
	private String description;

	@Size(min = 1, max = 20, message = "paymentCode min length {min} and max length is {max}")
	@ApiModelProperty(position = 2, value = "Code of the payment mode", name = "paymentCode", required = true, example = "QCGC")
	@PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX)
	@ValueOfEnum(message = PaymentConstants.INVALID_PAYMENT_CODE, enumClass = PaymentCategoryEnum.class)
	private String paymentCode;

	@ApiModelProperty(position = 3, value = "Multiple Card series", name = "instrumentNumber", required = true)
	private JsonData instrumentNumberDetails;

	@ApiModelProperty(position = 4, value = "Redemption type", name = "redemptionType", required = true, allowableValues = "FULL, PARTIAL", example = "FULL")
	@ValueOfEnum(enumClass = GiftCardRedemptionTypeEnum.class)
	private String redemptionType;

	@ApiModelProperty(position = 5, value = "isActive", name = "isActive", required = true, example = "true")
	private Boolean isActive;

	@ApiModelProperty(position = 6, value = "Card type", name = "instrumentType", required = true, allowableValues = "PHYSICAL_CARD, EVOUCHER_CARD", example = "EVOUCHER_CARD")
	@ValueOfEnum(enumClass = GiftCardTypeEnum.class)
	private String instrumentType;

	@ApiModelProperty(position = 7, value = "Minimum Amount", name = "minimumAmount", required = false, example = "500.00")
	@Digits(integer = 10, fraction = 2, message = "Numeric with only 2 digits accepted after decimal")
	private BigDecimal minimumAmount;
}