/*Copyright 2019. Titan Company Limited*All rights reserved.*/
package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MetalPriceLocationHistoryDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("metalPriceLocationHistoryRepository")
public interface MetalPriceLocationHistoryRepository extends JpaRepository<MetalPriceLocationHistoryDao, String> {

	@Query("select m from MetalPriceLocationHistoryDao m where (" + "(m.metalPriceConfig.id=:id ) "
			+ "AND (m.metalPriceConfig.metalTypeCode=:metalTypeCode ) "
			+ "AND (m.market.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) AND "
			+ "(m.location.locationCode in(:locationCodes) OR nullif(CHOOSE(1,:locationCodes),'') IS NULL))")
	Page<MetalPriceLocationHistoryDao> findByMetalConfig(@Param("id") String id,
			@Param("metalTypeCode") String metalTypeCode, @Param("marketCodes") List<String> marketCodes,
			@Param("locationCodes") List<String> locationCodes, Pageable pageable);

}
