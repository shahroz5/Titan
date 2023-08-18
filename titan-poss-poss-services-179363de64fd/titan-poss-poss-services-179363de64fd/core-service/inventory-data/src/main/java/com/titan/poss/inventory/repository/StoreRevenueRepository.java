/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.StoreRevenueDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface StoreRevenueRepository extends JpaRepository<StoreRevenueDao, Integer> {

	Optional<StoreRevenueDao> findByFiscalYearAndLocationCode(Short fiscalYear, String locCode);

}
