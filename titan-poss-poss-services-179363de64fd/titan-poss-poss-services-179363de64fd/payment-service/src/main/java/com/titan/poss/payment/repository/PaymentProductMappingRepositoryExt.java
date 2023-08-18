/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PaymentProductDaoExt;
import com.titan.poss.payment.dto.ProductMasterDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PaymentProductMappingRepositoryExt extends JpaRepository<PaymentProductDaoExt, String> {

	/*
	 * This method will return the payment product mapping based on ids.
	 *
	 * @param ids
	 *
	 * @return List<PaymentProductDao>
	 */
	List<PaymentProductDaoExt> findByIdIn(List<String> ids);

	/*
	 * This method will return the payment product mapping based on
	 * productCategoryName and product group list.
	 *
	 * @param ids
	 *
	 * @return List<PaymentProductDao>
	 */
	List<PaymentProductDaoExt> findByPaymentCategoryDaoPaymentCategoryNameAndProductGroupCodeIn(
			String productCategoryName,
			List<String> productGroupCodeList);

	/*
	 * This method will return the payment product mapping based on
	 * productCategoryName.
	 *
	 * @param giftCardName
	 *
	 * @param isActive
	 *
	 * @return List<PaymentProductDao>
	 */
	List<PaymentProductDaoExt> findByPaymentCategoryDaoPaymentCategoryName(String productCategoryName);

	/*
	 * This method will return the payment product mapping based on paymentCode and
	 * cardNumber.
	 * 
	 * @param paymentCode
	 * 
	 * @param cardNumber
	 * 
	 * @return List<PaymentProductDao>
	 */
	@Query("SELECT new com.titan.poss.payment.dto.ProductMasterDto(pc.paymentCategoryName, pc.redemptionType) FROM PaymentCategoryDao pc WHERE pc.payment.paymentCode =:paymentCode AND pc.instrumentNumber LIKE %:cardNumber%")
	ProductMasterDto getCategoryName(@Param("paymentCode") String paymentCode, @Param("cardNumber") String cardNumber);

	/*
	 * This method will return the payment product mapping based on paymentCode
	 * 
	 * @param paymentCode
	 * 
	 * @return List<PaymentProductDao>
	 */
	@Query("SELECT new com.titan.poss.payment.dto.ProductMasterDto(pc.paymentCategoryName, pc.redemptionType) FROM PaymentCategoryDao pc WHERE pc.payment.paymentCode =:paymentCode")
	ProductMasterDto getCategoryName(@Param("paymentCode") String paymentCode);

	/**
	 * @param paymentCategoryName
	 * @return List<String>
	 */
	@Query("SELECT ppm.productGroupCode FROM PaymentProductDaoExt ppm WHERE ppm.paymentCategoryDao.paymentCategoryName =:paymentCategoryName")
	List<String> getMappedProductGroup(@Param("paymentCategoryName") String paymentCategoryName);

	@Query("SELECT pp FROM PaymentProductDaoExt pp WHERE (:productGroupCode IS NULL OR pp.productGroupCode LIKE %:productGroupCode%)")
	Page<PaymentProductDaoExt> findByProductGroupCode(@Param("productGroupCode")String productGroup, Pageable pageable);

}
