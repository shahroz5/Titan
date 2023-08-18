/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.CourierDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface CourierRepository extends JpaRepository<CourierDao, Integer> {

	Page<CourierDao> findByIsActive(Boolean isActive, Pageable pageable);

	@Override
	Page<CourierDao> findAll(Pageable pageable);

	@Query("select cm FROM CourierDao cm INNER JOIN CourierLocationMappingDao clm on clm.courier.courierName = cm.courierName and clm.locationCode =:locationCode WHERE cm.isActive=:isActive")
	List<CourierDao> findAllByLocationCodeAndIsActive(@Param("locationCode") String locationCode,
			@Param("isActive") Boolean isActive);

	@Query("select cm FROM CourierDao cm INNER JOIN CourierLocationMappingDao clm on clm.courier.courierName = cm.courierName and clm.locationCode =:locationCode")
	List<CourierDao> findAllByLocationCode(@Param("locationCode") String locationCode);

	@Query("select cm FROM CourierDao cm INNER JOIN CourierLocationMappingDao clm on clm.courier.courierName = cm.courierName and clm.locationCode =:locationCode WHERE cm.isActive=:isActive")
	Page<CourierDao> findAllByLocationCodeAndIsActive(@Param("locationCode") String locationCode,
			@Param("isActive") Boolean isActive, Pageable pageable);

	@Query("select cm FROM CourierDao cm INNER JOIN CourierLocationMappingDao clm on clm.courier.courierName = cm.courierName and clm.locationCode =:locationCode")
	Page<CourierDao> findAllByLocationCode(@Param("locationCode") String locationCode, Pageable pageable);

	CourierDao findOneByCourierName(String courierName);
}
