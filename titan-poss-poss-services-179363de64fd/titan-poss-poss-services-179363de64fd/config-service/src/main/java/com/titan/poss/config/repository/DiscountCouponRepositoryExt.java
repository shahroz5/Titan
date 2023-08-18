/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountCouponDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface DiscountCouponRepositoryExt extends JpaRepository<DiscountCouponDaoExt, String> {

	/**
	 * @param couponCode
	 * @param discountId
	 * @return DiscountCouponDaoExt
	 */
	@Query("SELECT dcm from DiscountCouponDaoExt dcm, DiscountDaoExt dm, DiscountLocationMappingDaoExt dlm where dm.id = dlm.discount.id and "
			+ "dm.id = dcm.discount.id and dlm.locationCode = :locationCode and :businessDate between dlm.offerStartDate and dlm.offerEndDate "
			+ "and dcm.couponCode = :couponCode and dm.id =:discountId and dcm.status ='OPEN'")
	DiscountCouponDaoExt getValidCouponToRedeem(@Param("couponCode") String couponCode,
			@Param("discountId") String discountId, @Param("locationCode") String locationCode,
			@Param("businessDate") Date businessDate);

	/**
	 * @param couponCodes
	 * @return
	 */
	List<DiscountCouponDaoExt> findAllByCouponCodeIn(Set<String> couponCodes);

	/**
	 * @param discountId
	 * @return
	 */
	List<DiscountCouponDaoExt> findAllByDiscountId(String discountId);

	/**
	 * @param couponCodes
	 * @param businessDate
	 * @param locationCode
	 * @return
	 */
	@Query("select dcm from DiscountCouponDaoExt dcm , DiscountDaoExt dm, DiscountLocationMappingDaoExt dlm "
			+ "where dm.id = dlm.discount.id AND dm.id = dcm.discount.id AND dlm.locationCode = :locationCode AND :businessDate between dlm.offerStartDate and dlm.offerEndDate "
			+ "AND dm.isActive = true AND dlm.isActive = true AND dcm.couponCode IN (:couponCodes) AND dcm.status ='OPEN'")
	List<DiscountCouponDaoExt> getCouponsList(@Param("couponCodes") List<String> couponCodes,
			@Param("businessDate") Date businessDate, @Param("locationCode") String locationCode);

	/**
	 * @param couponCode
	 * @param discountId
	 * @return DiscountCouponDaoExt
	 */
	@Query("SELECT dcm from DiscountCouponDaoExt dcm where  dcm.couponCode = :couponCode and dcm.discount.id =:discountId")
	DiscountCouponDaoExt getCouponToCancelRedeemption(@Param("couponCode") String couponCode,
			@Param("discountId") String discountId);

}
