/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.LocationCoordinateDto;
import com.titan.poss.location.dao.LocationDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface LocationRepository extends JpaRepository<LocationDao, String> {
	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return Location
	 */
	public LocationDao findOneByLocationCode(String locationCode);
	
	public List<LocationDao> findByLocationCodeInAndIsActive(List<String> locationCodes, Boolean isActive);
	
	/**
	 * This method will return location Code, latitude and longitude based on isActive
	 * @return LocationCoordinateDto
	 */
//	@Query("select new com.titan.poss.core.dto.LocationHeaderDto(lm.locationCode,lm.brand.brandCode,"
//			+ "lm.town.townId,lm.town.description, lm.state.id,lm.state.description,lm.region.regionCode, "
//			+ "lm.locationTypeCode, lm.locationFormat, lm.isActive, lm.description, lm.market.marketCode,  "
//			+ "lm.country.countryCode,lm.ownerTypeCode,lm.factoryCode.locationCode,lm.cfaCode.locationCode,"
//			+ "lm.subRegion.regionCode,lm.subBrand.brandCode,lm.remarks,lm.baseCurrency.currencyCode,"
//			+ "lm.stockCurrency.currencyCode,lm.masterCurrency.currencyCode,lm.paymentCurrencies) "
//			+ "from LocationDao lm  where (lm.locationCode = :locationCode OR lm.locationCode IS NULL) AND lm.isActive = 1")
	
	@Query("select new com.titan.poss.core.dto.LocationCoordinateDto(i.locationCode,i.latitude,i.longitude, i.storeDetails,"
			+ "i.description,i.town.description,i.state.description)"
			+ " from  LocationDao i WHERE i.isActive = 1")
	public List<LocationCoordinateDto> getAllByLocationIfIsActive();
	
	

}
