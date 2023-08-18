/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.CustomLotDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("CustomLotRepository")
public interface CustomLotRepository extends JpaRepository<CustomLotDao, Integer> {

	@Query("SELECT MAX(c.sequenceNo) FROM CustomLotDao c where c.locationCode=:locationCode and c.txnCode=:txnCode")
	Integer getMaxLotId(@Param("locationCode") String locationCode, @Param("txnCode") String txnCode);

}
