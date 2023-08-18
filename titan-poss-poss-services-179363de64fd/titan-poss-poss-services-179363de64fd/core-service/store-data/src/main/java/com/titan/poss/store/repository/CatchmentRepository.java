/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.store.dao.CatchmentDao;
import com.titan.poss.store.dao.CatchmentId;

/**
 * Handles repository operations for <b>Catchment</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface CatchmentRepository extends JpaRepository<CatchmentDao, CatchmentId> {

	Optional<CatchmentDao> findByCatchmentIdCatchmentCodeAndCatchmentIdLocationCode(String catchmentCode,
			String locationCode);

}
