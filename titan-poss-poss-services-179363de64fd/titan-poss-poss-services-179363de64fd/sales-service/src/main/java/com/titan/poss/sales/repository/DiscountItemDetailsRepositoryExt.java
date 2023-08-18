/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

/**
 * Repository class for DiscountItemDetailsDaoExt
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("SalesDiscountItemDetailsRepositoryExt")
public interface DiscountItemDetailsRepositoryExt extends JpaRepository<DiscountItemDetailsDaoExt, String> {

	/**
	 * @param itemId
	 * @param transactionId
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByItemIdAndDiscountDetailSalesTxnId(String itemId, String transactionId);

	/**
	 * @param discountTxnId
	 * @param itemId
	 * @return
	 */
	Optional<DiscountItemDetailsDaoExt> findByDiscountDetailIdAndItemId(String discountTxnId, String itemId);

	/**
	 * @param discountTxnId
	 */
	@Modifying
	void deleteByDiscountDetailId(String discountTxnId);

	/**
	 * @param salesTxn
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(
			SalesTxnDaoExt salesTxn, String applicableLevel, List<String> eligibleItemIds);

	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnAndItemIdIn(SalesTxnDaoExt salesTxn,
			List<String> eligibleItemIds);

	/**
	 * @param discountDetails
	 * @param preApportionedNonEligibleItemIdList
	 */
	@Modifying
	void deleteAllByDiscountDetailAndItemIdIn(DiscountDetailsDaoExt discountDetails,
			Set<String> preApportionedNonEligibleItemIdList);

	/**
	 * @param id
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailId(String discountDetailId);

	/**
	 * @param discountTxnId
	 * @param itemId
	 * @param id
	 * @return
	 */
	Optional<DiscountItemDetailsDaoExt> findByIdAndItemIdAndDiscountDetailSalesTxnId(String discountTxnId,
			String itemId, String id);

	/**
	 * 
	 * @param salesTxn
	 * @param applicableLevel
	 * @param itemId
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemId(
			SalesTxnDaoExt salesTxn, String applicableLevel, String itemId);

	/**
	 * Method to list Discount type specific applied discounts at item level
	 * 
	 * @param salesTxn
	 * @param discountType
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(
			SalesTxnDaoExt salesTxn, String discountType);

	/**
	 * @param transactionId
	 * @param discountId
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnIdAndDiscountDetailDiscountId(String transactionId,
			String discountId);

	/**
	 * @param transactionId
	 * @param discountId
	 * @param itemCodes
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnIdAndDiscountDetailDiscountIdAndItemCodeIn(
			String transactionId, String discountId, List<String> itemCodes);

	/**
	 * Method to list the Clubbed discount for a item by clubbedDiscountId within a
	 * transaction
	 * 
	 * @param salesTxn
	 * @param clubbedDiscountId
	 * @param itemId
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnAndDiscountDetailClubbedDiscountIdAndItemIdIn(
			SalesTxnDaoExt salesTxn, String clubbedDiscountId, String itemId);

	/**
	 * Method to list the Cumulative discount by cumulative Discount Id within a
	 * transaction
	 * 
	 * @param salesTxn
	 * @param cumulativeDiscountIds
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnAndDiscountDetailCumulativeDiscountIdIn(
			SalesTxnDaoExt salesTxn, List<String> cumulativeDiscountIds);

	/**
	 * Query to fetch applied order discounts
	 * 
	 * @param salesTxn
	 * @param applicableLevel
	 * @param itemId
	 * @return
	 */
	// @formatter:off
	@Query("SELECT discItem FROM com.titan.poss.sales.dao.DiscountItemDetailsDaoExt discItem "
			+ "WHERE discItem.discountDetail.salesTxn = :salesTxn "
			+ "AND discItem.discountDetail.applicableLevel = :applicableLevel "
			+ "AND (:itemId IS NULL OR discItem.itemId = :itemId) "
			+ "AND (:discountTxnId IS NULL OR discItem.id = :discountTxnId) "
			+ "AND (:clubbedDiscountId IS NULL OR discItem.discountDetail.clubbedDiscountId = :clubbedDiscountId) ")
	// @formatter:on
	List<DiscountItemDetailsDaoExt> findAllOrderDiscounts(@Param("salesTxn") SalesTxnDaoExt salesTxn,
			@Param("applicableLevel") String applicableLevel, @Param("itemId") String itemId,
			@Param("discountTxnId") String discountTxnId, @Param("clubbedDiscountId") String clubbedDiscountId);

	/**
	 * @param transactionId
	 * @param discountTxnId
	 * @return
	 */
	Optional<DiscountItemDetailsDaoExt> findByIdAndDiscountDetailSalesTxnId(String discountTxnId, String transactionId);

	@Modifying
	void deleteAllByDiscountDetailIdIn(List<String> discountDetailsIds);

	/**
	 * @param itemId
	 * @param id
	 * @param discountType
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByItemIdAndDiscountDetailSalesTxnIdAndDiscountDetailDiscountType(
			String itemId, String id, String discountType);

	/**
	 * @param salesTxn
	 * @param clubbedDiscountIdList
	 * @param itemIdList
	 * @return List<DiscountItemDetailsDaoExt>
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnAndDiscountDetailClubbedDiscountIdInAndItemIdIn(
			SalesTxnDaoExt salesTxn, Set<String> clubbedDiscountIdList, Set<String> itemIdList);

	/**
	 * @param id
	 * @param itemCode
	 * @return
	 */
	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailIdAndItemCode(String id, String itemCode);

	// @formatter:off
	@Query("SELECT discItem FROM com.titan.poss.sales.dao.DiscountItemDetailsDaoExt discItem "
			+ "WHERE discItem.discountDetail.salesTxn = :salesTxn "
			+ "AND discItem.discountDetail.applicableLevel = :applicableLevel "
			+ "AND (:itemId IS NULL OR discItem.itemId = :itemId) "
			+ "AND ((:referenceId IS NULL AND discItem.discountDetail.referenceId IS NOT NULL)  OR (:referenceId IS NOT NULL AND discItem.discountDetail.referenceId = :referenceId)) ")
	// @formatter:on
	List<DiscountItemDetailsDaoExt> findAllLinkedDiscountByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdAndReferenceId(
			@Param("salesTxn") SalesTxnDaoExt salesTxn, @Param("applicableLevel") String applicableLevel,
			@Param("itemId") String itemId, @Param("referenceId") String referenceId);

	/**
	 * This method will get all item discounts.
	 * 
	 * @param transactionId
	 * @return List<DiscountItemDetailsDaoExt>
	 */
	List<DiscountItemDetailsDaoExt> findByDiscountDetailSalesTxnId(String transactionId);

	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailIdIn(List<String> discountDetailsIds);

	List<DiscountItemDetailsDaoExt> findAllByDiscountDetailSalesTxnIdAndDiscountDetailDiscountIdIn(String transactionId,
			List<String> discountIds);

	List<DiscountItemDetailsDaoExt> findByDiscountDetailSalesTxnIdAndItemIdInAndDiscountDetailCumulativeDiscountIdNotNull(
			String transactionId, Set<String> itemIdList);

}
