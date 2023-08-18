/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.PaymentCategoryDto;
import com.titan.poss.payment.dto.request.PaymentCategoryUpdateDto;
import com.titan.poss.payment.dto.request.PaymentProductMappingDto;
import com.titan.poss.payment.dto.response.PaymentProductDto;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface PaymentCategoryService {

	/**
	 * Gets the all gift cards.
	 * 
	 * @param configName
	 *
	 * @param isActive   the is active
	 * @param pageable   the pageable
	 * @return the all gift cards
	 */
	PagedRestResponse<List<PaymentCategoryDto>> getAllPaymentCategory(String paymentCategoryName, Boolean isActive,
			Pageable pageable);

	/**
	 * Gets the specific gift card.
	 *
	 * @param paymentCategoryName the gift card name
	 * @return the gift card
	 */
	PaymentCategoryDto getPaymentCategory(String paymentCategoryName, Boolean isActive, Pageable pageable);

	/**
	 * Creates the gift card.
	 *
	 * @param paymentCategoryDto
	 * @return PaymentCategoryDto
	 */
	PaymentCategoryDto createPaymentCategory(PaymentCategoryDto paymentCategoryDto);

	/**
	 * Updates the gift card.
	 *
	 * @param paymentCategoryName
	 * @param paymentCategoryUpdateDto
	 * @return PaymentCategoryDto
	 */
	PaymentCategoryDto updatePaymentCategory(String paymentCategoryName,
			PaymentCategoryUpdateDto paymentCategoryUpdateDto);

	/**
	 * Gets the payment category mapping.
	 *
	 * @param paymentCategoryName
	 * @param isPageable
	 * @return List<PaymentProductDto>
	 */
	PagedRestResponse<List<PaymentProductDto>> getPaymentCategoryMapping(String paymentCategoryName, Pageable pageable,
			String productGroup, Boolean isPageable);

	/**
	 * Add/Update/Remove payment category mapping.
	 *
	 * @param paymentCategoryName
	 * @param paymentCategoryProductMappingDto
	 * @return List<PaymentProductDto>
	 */
	List<PaymentProductDto> updatePaymentCategoryMapping(String paymentCategoryName,
			PaymentProductMappingDto paymentCategoryProductMappingDto);

	PaymentCategoryDto tempUpdate(String paymentCategoryName);
}
