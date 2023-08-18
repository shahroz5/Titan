/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerCouponDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerCouponRepositoryExt")
public interface CustomerCouponRepositoryExt extends JpaRepository<CustomerCouponDaoExt, String> {

	List<CustomerCouponDaoExt> findAllByCouponTypeAndCustomerIdAndIsActive(String couponType, String customerId,
			Boolean isActive);

	List<CustomerCouponDaoExt> findAllByCouponTypeAndCouponCodeAndIsActive(String couponType, String couponCode,
			Boolean isActive);

	List<CustomerCouponDaoExt> findAllByCouponTypeAndCouponCodeAndCustomerIdAndStatusIn(String couponType,
			String couponCode, String customerId, List<String> statusList);

	List<CustomerCouponDaoExt> findAllByCouponTypeAndCouponCodeAndStatus(String couponType, String couponCode,
			String status);

	List<CustomerCouponDaoExt> findAllByRefId(String refId);

}
