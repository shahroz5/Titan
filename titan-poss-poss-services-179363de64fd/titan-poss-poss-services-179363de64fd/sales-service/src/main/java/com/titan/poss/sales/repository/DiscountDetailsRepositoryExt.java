/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

/**
 * Repository Class for Discount details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesDiscountDetailsRepositoryExt")
public interface DiscountDetailsRepositoryExt extends JpaRepository<DiscountDetailsDaoExt, String> {

	/**
	 * @param transactionId
	 * @param name
	 * @return
	 */
	List<DiscountDetailsDaoExt> findAllBySalesTxnIdAndApplicableLevel(String transactionId, String name);

	/**
	 * @param discountId
	 * @param transactionId
	 * @return
	 */
	Optional<DiscountDetailsDaoExt> findByIdAndSalesTxnId(String discountId, String transactionId);

	/**
	 * @param id
	 * @param name
	 * @param name2
	 * @return
	 */
	List<DiscountDetailsDaoExt> findAllBySalesTxnIdAndApplicableLevelAndDiscountType(String salesTxnId,
			String applicableLevel, String discountType);

	/**
	 * 
	 * @param salesTxnId
	 * @param discountType
	 * @param discountSubType
	 * @return
	 */
	Long countBySalesTxnIdAndDiscountType(String salesTxnId, String discountType);

	/**
	 * 
	 * @param salesTxnId
	 * @param discountTypeList
	 * @return
	 */
	List<DiscountDetailsDaoExt> findAllBySalesTxnIdAndDiscountTypeIn(String salesTxnId, Set<String> discountTypeList);

	/**
	 * @param id
	 * @param of
	 * @return
	 */
	Long countBySalesTxnIdAndDiscountTypeIn(String id, Set<String> of);

	/**
	 * @param discountType
	 * @param id
	 * @return List<DiscountDetailsDaoExt>
	 */
	List<DiscountDetailsDaoExt> findAllByDiscountTypeAndSalesTxnId(String discountType, String id);

	// @formatter:off
	@Query("SELECT discount FROM com.titan.poss.sales.dao.DiscountDetailsDaoExt discount WHERE discount.salesTxn.id = :transactionId "
			+ " AND (:applicableLevel IS NULL or discount.applicableLevel = :applicableLevel) "
			+ " AND (:discountType IS NULL or discount.discountType = :discountType) "
			+ " AND (:status IS NULL or discount.status = :status) ")
	// @formatter:on
	List<DiscountDetailsDaoExt> findAllSalesTransactionDiscounts(@Param("transactionId") String transactionId,
			@Param("applicableLevel") String applicableLevel, @Param("discountType") String discountType,
			@Param("status") String status);

	/**
	 * @param discountType
	 * @param txnId
	 * @param id           - optional
	 * @return List<DiscountDetailsDaoExt>
	 */
	// @formatter:off
	@Query("SELECT discount \r\n" + " FROM com.titan.poss.sales.dao.DiscountDetailsDaoExt discount \r\n"
			+ " WHERE discount.salesTxn.id = :transactionId \r\n" + " AND discount.discountType = :discountType \r\n"
			+ " AND (:id IS NULL OR discount.id = :id) ")
	// @formatter:on
	List<DiscountDetailsDaoExt> findAllByDiscountTypeAndSalesTxnId(@Param("discountType") String discountType,
			@Param("transactionId") String transactionId, @Param("id") String id);

	/**
	 * Query method to get Empowerment discount given per Quarter by a location
	 * 
	 * @param quarterStartDate
	 * @param quarterEndDate
	 * @param discountType
	 * @param txnType
	 * @param statusList
	 * @return
	 */
	// @formatter:off
	@Query(value = "SELECT COALESCE(sum(dd.discount_value) ,0) from sales.dbo.sales_transaction st "
			+ "inner join sales.dbo.discount_details_sales dd on st.id = dd.sales_txn_id WHERE st.location_code = :locationCode "
			+ "AND st.txn_type = :txnType and st.status IN (:statusList) and st.doc_date BETWEEN :quarterStartDate and :quarterEndDate "
			+ "and dd.discount_type = :discountType", nativeQuery = true)
	// @formatter:on
	BigDecimal getMaxDiscountForCurrentQuarter(@Param("quarterStartDate") Date quarterStartDate,
			@Param("quarterEndDate") Date quarterEndDate, @Param("discountType") String discountType,
			@Param("txnType") String txnType, @Param("statusList") List<String> statusList,
			@Param("locationCode") String locationCode);

	/**
	 * Method to list discounts by discount id
	 * 
	 * @param transactionId
	 * @param discountId
	 * @return
	 */
	List<DiscountDetailsDaoExt> findAllBySalesTxnIdAndDiscountId(String transactionId, String discountId);

	// @formatter:off
	@Query("SELECT discount \r\n" + " FROM com.titan.poss.sales.dao.DiscountDetailsDaoExt discount \r\n"
			+ " WHERE discount.salesTxn.id = :transactionId \r\n" + " AND discount.refPayment.id = :refPaymentId")
	// @formatter:on
	List<DiscountDetailsDaoExt> findAllBySalesTxnIdAndRefPaymentId(@Param("transactionId") String transactionId,
			@Param("refPaymentId") String refPaymentId);

	List<DiscountDetailsDaoExt> findAllByRivaahCardDiscountIdIn(List<String> rivaahCardDiscountIds);

	Integer countByRefPaymentId(String refPaymentId);

	List<DiscountDetailsDaoExt> findAllBySalesTxnId(String id);

	/**
	 * @param salesTxnDaoExt
	 * @return
	 */
	DiscountDetailsDaoExt findOneBySalesTxn(SalesTxnDaoExt salesTxnDaoExt);

	@Query(nativeQuery = true, value = "SELECT dd.ref_payment_id FROM discount_details_sales dd WHERE dd.sales_txn_id = :transactionId AND dd.ref_payment_id IS NOT NULL")
	Set<String> findPaymentIdInDiscountByTxnId(@Param("transactionId") String transactionId);
}
