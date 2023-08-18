/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerCouponDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerCouponRepository")
public interface CustomerCouponRepository extends JpaRepository<CustomerCouponDao, String> {

}
