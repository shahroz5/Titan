/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GRFManualBillServiceDaoExt;

/**
 * Handles repository operations for <b>grf_memo</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesGRFManualBillRepositoryExt")

public interface GRFManualBillRepositoryExt extends JpaRepository<GRFManualBillServiceDaoExt, String> {

}
