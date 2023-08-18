/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.LocationPriceGroupMappingDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface LocationPriceGroupMappingRepositoryExt extends JpaRepository<LocationPriceGroupMappingDaoExt, String> {

	@Query("SELECT l FROM LocationPriceGroupMappingDaoExt l WHERE l.location.locationCode =:locationCode AND l.priceGroup IN (:priceGroupList)")
	List<LocationPriceGroupMappingDaoExt> getLocationPriceGroupMapping(@Param("locationCode") String locationCode,
			@Param("priceGroupList") List<String> priceGroupList);

	@Query("SELECT l FROM LocationPriceGroupMappingDaoExt l WHERE l.location.locationCode =:locationCode AND l.priceGroup IN (:priceGroupList) AND l.pricingGroupType IN (:priceGroupTypeList)")
	List<LocationPriceGroupMappingDaoExt> getLocationPriceGroup(@Param("locationCode") String locationCode,
			@Param("priceGroupList") List<String> priceGroupList,
			@Param("priceGroupTypeList") List<String> priceGroupTypeList);
}
