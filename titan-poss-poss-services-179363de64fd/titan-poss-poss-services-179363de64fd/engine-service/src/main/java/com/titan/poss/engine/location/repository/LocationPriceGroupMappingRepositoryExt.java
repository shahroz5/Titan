/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.location.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.LocationPriceGroupMappingDao;
import com.titan.poss.location.repository.LocationPriceGroupMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineLocationPriceGroupMappingRepositoryExt")
public interface LocationPriceGroupMappingRepositoryExt extends LocationPriceGroupMappingRepository {

	@Query("select l from LocationPriceGroupMappingDao l where (l.location.locationCode=:locationCode and l.pricingGroupType=:pricingGroupType)")
	List<LocationPriceGroupMappingDao> findByLocationCodeAndPricingGroupType(@Param("locationCode") String locationCode,
			@Param("pricingGroupType") String pricingGroupType);

}
