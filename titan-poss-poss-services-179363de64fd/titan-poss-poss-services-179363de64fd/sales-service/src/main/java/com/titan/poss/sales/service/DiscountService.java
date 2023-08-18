/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;

/**
 * Service Interface for Discount
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface DiscountService {

	/**
	 * Method to validate discount type specific eligible Club offers
	 * 
	 * @param clubOfferConfigs
	 * @param discountCode
	 * @param salesTxn
	 */
	void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn);

	/**
	 * Method to add discount with the applicable validations applied
	 * 
	 * @param salesTxn
	 * @param discountDetail
	 * @return
	 */
	DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails);

	/**
	 * Method to delete applied discount with dependent updates
	 * 
	 * @param salesTxn
	 * @param discountDetailsDaoExt
	 */
	void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt);

	/**
	 * Method to validate Order configuration for the discount applied in AB
	 * transactions
	 * 
	 * @param salesTxn
	 * @param orderConfigDetails
	 * @param discountOtherDetailsDto
	 */
	void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode);

	/**
	 * Method to validate Discount eligibility
	 * 
	 * @param salesTxn
	 * @param discountDetail
	 */
	void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId);

	/**
	 * Method to apply transaction level discounts like bill level and checkboxed
	 * discounts
	 * 
	 * @param salesTxn
	 * @param discountDetail
	 */
	DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType);

	/**
	 * Method to confirm few transaction level discounts like bill level discounts
	 * and check boxed discounts like Employee Discount, TSSS discount, Encircle
	 * discounts, TATA employee discounts
	 *
	 * @param salesTxn
	 * @param discountType
	 * @param discountTxnId
	 */
	void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId);

	/**
	 * Method to delete discounts applied at transaction level like Employee,Bill
	 * level,TSSS,TATA employee.
	 * 
	 * @param salesTxn
	 * @param discountType
	 */
	void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType);

	/**
	 * Method to Update or Re Apportion bill level discounts applied
	 * 
	 * @param salesTxn
	 * @param discountDetailDao
	 */
	void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate);

	/**
	 * Method to apply transaction level discounts like bill level and checkboxed
	 * discounts from order to CM
	 * 
	 * @param salesTxn
	 * @param discountDetail
	 */
	void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType);

}
