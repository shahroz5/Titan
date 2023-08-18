/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.CourierLocationMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface CourierLocationMappingRepository extends JpaRepository<CourierLocationMappingDao, String> {
	@Transactional
	@Modifying
	@Query("delete from CourierLocationMappingDao s where s.courier.courierName = :courierName")
	void deleteAllCourierMapping(@Param("courierName") String courierName);

	@Transactional
	@Modifying
	@Query("delete from CourierLocationMappingDao clm where clm.courier.courierName=:courierName and clm.locationCode in(:locationCodes)")
	void deleteByCourierNameAndLocationCodeIn(@Param("courierName") String courierName,
			@Param("locationCodes") List<String> locationCodes);

	@Query("select clm.locationCode from CourierLocationMappingDao clm inner join CourierDao c on c.courierName = clm.courier.courierName and c.isActive in(:isActiveList) where clm.courier.courierName =:courierName")
	List<String> getLocationCodesByCourierNameAndIsActive(@Param("courierName") String courierName,
			@Param("isActiveList") List<Boolean> isActiveList);
}
