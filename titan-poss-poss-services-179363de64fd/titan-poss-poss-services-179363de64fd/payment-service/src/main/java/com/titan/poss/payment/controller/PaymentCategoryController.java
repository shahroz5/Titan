/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CATEGORY_CONTROLLER;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.dto.PaymentCategoryDto;
import com.titan.poss.payment.dto.request.PaymentCategoryUpdateDto;
import com.titan.poss.payment.dto.request.PaymentProductMappingDto;
import com.titan.poss.payment.dto.response.PaymentProductDto;
import com.titan.poss.payment.service.PaymentCategoryService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(PAYMENT_CATEGORY_CONTROLLER)
@RequestMapping("payment/v2/payment-categories")
public class PaymentCategoryController {

	private static final String PAYMENT_CATEGORY_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.PAYMENT_CATEGORY_VIEW + PreAuthorizeDetails.END + PreAuthorizeDetails.OR + PreAuthorizeDetails.START
			+ ConfigAccessControls.CLUBBING_OF_DISCOUNT_VIEW + PreAuthorizeDetails.END;

	private static final String PAYMENT_CATEGORY_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.PAYMENT_CATEGORY_ADD_EDIT + PreAuthorizeDetails.END + PreAuthorizeDetails.OR + PreAuthorizeDetails.START
			+ ConfigAccessControls.CLUBBING_OF_DISCOUNT_ADD_EDIT + PreAuthorizeDetails.END;

	@Autowired
	private PaymentCategoryService paymentCategoryService;

	/**
	 * Gets the all gift cards.
	 *
	 * @param isActive the is active
	 * @param pageable the pageable
	 * @return the all gift cards
	 */
	@ApiOperation(value = "View the list of Gift cards", notes = "This API will return the list of gift cards")
	@GetMapping(value = "")
	@ApiPageable
	@PreAuthorize(PAYMENT_CATEGORY_VIEW_PERMISSION)
	public PagedRestResponse<List<PaymentCategoryDto>> getAllPaymentCategory(
			@ApiParam(name = "isActive", value = "Gift card is active or not", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive,
			@RequestParam(name = "paymentCategoryName", required = false) String paymentCategoryName,
			@ApiIgnore Pageable pageable) {

		return paymentCategoryService.getAllPaymentCategory(paymentCategoryName, isActive, pageable);
	}

	/**
	 * Gets the specific gift card.
	 *
	 * @param paymentCategoryName the gift card name
	 * @return the gift card
	 */
	@ApiOperation(value = "View the specific gift card", notes = "This API will return the specific gift card. As This is a Generic API Pass Gift card Name in Place of Payment Category Name.")
	@GetMapping(value = "/{paymentCategoryName}")
	@PreAuthorize(PAYMENT_CATEGORY_VIEW_PERMISSION)
	public PaymentCategoryDto getPaymentCategory(@PathVariable("paymentCategoryName") String paymentCategoryName,
			@ApiParam(name = "isActive", value = "Gift card is active or not", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return paymentCategoryService.getPaymentCategory(paymentCategoryName, isActive, pageable);
	}

	/**
	 * Creates the gift card.
	 *
	 * @param paymentCategoryDto
	 * @return PaymentCategoryDto
	 */
	@ApiOperation(value = "Create Gift Card", notes = "This API will create a Gift Card.")
	@PostMapping(value = "")
	@PreAuthorize(PAYMENT_CATEGORY_ADD_EDIT_PERMISSION)
	public PaymentCategoryDto createPaymentCategory(
			@ApiParam(name = "paymentCategory", value = "Payment Category object that needs to be created", required = true) @RequestBody @Valid PaymentCategoryDto paymentCategoryDto) {

		return paymentCategoryService.createPaymentCategory(paymentCategoryDto);
	}

	/**
	 * Updates the gift card.
	 *
	 * @param paymentCategoryName
	 * @param paymentCategoryUpdateDto
	 * @return PaymentCategoryDto
	 */
	@ApiOperation(value = "Update Gift Card", notes = "This API will update a Gift Card. As This is a Generic API Pass Gift card Name in Place of Payment Category Name.")
	@PatchMapping(value = "/{paymentCategoryName}")
	@PreAuthorize(PAYMENT_CATEGORY_ADD_EDIT_PERMISSION)
	public PaymentCategoryDto updatePaymentCategory(
			@PathVariable("paymentCategoryName") @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String paymentCategoryName,
			@ApiParam(name = "paymentCategory", value = "Payment category object that needs to be updated", required = true) @RequestBody @Valid PaymentCategoryUpdateDto paymentCategoryUpdateDto) {

		return paymentCategoryService.updatePaymentCategory(paymentCategoryName, paymentCategoryUpdateDto);
	}

	/**
	 * Gets the payment category mapping.
	 *
	 * @param paymentCategoryName
	 * @return List<PaymentProductDto>
	 */
	@ApiOperation(value = "View the specific payment product group mapping", notes = "This API will return the mappings of the payment product group mapping. This API is Generic for encircle, employee loan, and payment advance, product group mapping.")
	@GetMapping(value = "/{paymentCategoryName}/product-groups")
	@PreAuthorize(PAYMENT_CATEGORY_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<PaymentProductDto>> getPaymentCategoryMapping(
			@PathVariable("paymentCategoryName") String paymentCategoryName, @ApiIgnore Pageable pageable,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroup,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable) {

		return paymentCategoryService.getPaymentCategoryMapping(paymentCategoryName, pageable, productGroup,
				isPageable);
	}

	/**
	 * Add/Update/Remove payment category mapping.
	 *
	 * @param paymentCategoryName
	 * @param paymentProductMappingDto
	 * @return List<PaymentProductDto>
	 */
	@ApiOperation(value = "Add/Update/Remove a payment product mapping", notes = "This API will add/update/remove a payment product product mapping. This API is Generic for encircle, employee loan, and payment advance, product group mapping.")
	@PatchMapping(value = "/{paymentCategoryName}/product-groups")
	@PreAuthorize(PAYMENT_CATEGORY_ADD_EDIT_PERMISSION)
	public List<PaymentProductDto> updatePaymentCategoryMapping(
			@PathVariable("paymentCategoryName") @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String paymentCategoryName,
			@ApiParam(name = "paymentCategoryProductMapping", value = "Payment Product group Mapping object that needs to be added/updated/removed", required = true) @RequestBody @Valid PaymentProductMappingDto paymentProductMappingDto) {

		return paymentCategoryService.updatePaymentCategoryMapping(paymentCategoryName, paymentProductMappingDto);
	}
	
	@ApiOperation(value = "Update Gift Card", notes = "This API will update a Gift Card. As This is a Generic API Pass Gift card Name in Place of Payment Category Name.")
	@PatchMapping(value = "temp/{paymentCategoryName}")
	@PreAuthorize(PAYMENT_CATEGORY_ADD_EDIT_PERMISSION)
	public PaymentCategoryDto tempUpdatePaymentCategory(
			@PathVariable("paymentCategoryName") @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String paymentCategoryName ) {

		return paymentCategoryService.tempUpdate(paymentCategoryName);
	}
	
}
