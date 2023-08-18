/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.datasync.dao.LocationQueueDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface LocationQueueRepository extends JpaRepository<LocationQueueDao, String> {

	public List<LocationQueueDao> findByIsActiveTrue();

	@Query("SELECT  l FROM LocationQueueDao l where l.locationCode = :locationCode")
	public Optional<LocationQueueDao> findByLocationCode(@Param("locationCode") String locationCode);

	@Query("SELECT lq.locationCode FROM  LocationQueueDao lq WHERE lq.isActive = 1")
	List<String> getLocationCodes();
}
