/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.titan.poss.datasync.dao.LocationQueueMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface LocationQueueMappingRepository extends JpaRepository<LocationQueueMappingDao, Integer> {


}
