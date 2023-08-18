/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CATEGORY_PRODUCT_REPOSITORY;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PaymentCategoryDao;
import com.titan.poss.payment.dao.PaymentProductDao;
import com.titan.poss.payment.dto.ProductMasterDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(PAYMENT_CATEGORY_PRODUCT_REPOSITORY)
public interface PaymentProductMappingRepository extends JpaRepository<PaymentProductDao, String> {

	/*
	 * This method will return the payment product mapping based on ids.
	 *
	 * @param ids
	 *
	 * @return List<PaymentProductDao>
	 */
	List<PaymentProductDao> findByIdIn(List<String> ids);

	/*
	 * This method will return the payment product mapping based on
	 * productCategoryName and product group list.
	 *
	 * @param ids
	 *
	 * @return List<PaymentProductDao>
	 */
	List<PaymentProductDao> findByPaymentCategoryDaoPaymentCategoryNameAndProductGroupCodeIn(String productCategoryName,
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
	List<PaymentProductDao> findByPaymentCategoryDaoPaymentCategoryName(String productCategoryName);

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
	@Query("SELECT pc FROM PaymentCategoryDao pc WHERE pc.payment.paymentCode =:paymentCode AND pc.isActive =:status AND pc.instrumentNumber LIKE %:cardNumber%")
	PaymentCategoryDao getCategoryName(@Param("paymentCode") String paymentCode, @Param("cardNumber") String cardNumber,@Param("status") Boolean status);
	
//	@Query("SELECT pc FROM PaymentCategoryDao pc WHERE pc.payment.paymentCode =:paymentCode AND pc.isActive =:status")
//	List<PaymentCategoryDao> getCategoryNames(@Param("paymentCode") String paymentCode ,@Param("status") Boolean status);
	
	@Query("SELECT pc FROM PaymentCategoryDao pc WHERE pc.payment.paymentCode =:paymentCode AND pc.isActive =:status")
	List<PaymentCategoryDao> findAllCategoryDaos(@Param("paymentCode") String paymentCode ,@Param("status") Boolean status);
	/*
	 * This method will return the payment product mapping based on paymentCode
	 * 
	 * @param paymentCode
	 * 
	 * @return List<PaymentProductDao>
	 */
	@Query("SELECT pc FROM PaymentCategoryDao pc WHERE pc.payment.paymentCode =:paymentCode AND pc.isActive =:status")
	PaymentCategoryDao getCategoryName(@Param("paymentCode") String paymentCode, @Param("status") Boolean status);

	/**
	 * @param paymentCategoryName
	 * @return List<String>
	 */
	@Query("SELECT ppm.productGroupCode FROM PaymentProductDao ppm WHERE ppm.paymentCategoryDao.paymentCategoryName =:paymentCategoryName")
	List<String> getMappedProductGroup(@Param("paymentCategoryName") String paymentCategoryName);

	/**
	 * @param paymentCategoryName
	 * @param productGroupCode
	 * @return PaymentProductDao
	 */
	PaymentProductDao findByPaymentCategoryDaoPaymentCategoryNameAndProductGroupCode(String paymentCategoryName,
			String productGroupCode);
	
	@Query("SELECT pcm FROM PaymentCategoryDao pcm WHERE pcm.paymentCategoryName=:paymentCategoryName")
	PaymentCategoryDao getIsGhsVoucherEnabled(@Param("paymentCategoryName") String paymentCategoryName);
	
}
