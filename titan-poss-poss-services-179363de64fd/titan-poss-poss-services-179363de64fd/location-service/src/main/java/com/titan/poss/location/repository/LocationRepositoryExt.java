/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.LocationHeaderDto;
import com.titan.poss.core.dto.LocationMarketDto;
import com.titan.poss.location.dao.LocationDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface LocationRepositoryExt extends LocationRepository {

	/**
	 * This method will return the list of Location details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<Location>
	 */
	Page<LocationDao> findByIsActive(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the list of Location details.
	 * 
	 * @param pageable
	 * @return Page<Location>
	 */
	@Override
	Page<LocationDao> findAll(Pageable pageable);

	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return Location
	 */
	LocationDao findOneByLocationCodeAndIsActive(String locationCode, Boolean isActive);

	@Query("select new com.titan.poss.core.dto.LocationHeaderDto(lm.locationCode,lm.brand.brandCode,lm.town.townId,lm.town.description, "
			+ "lm.state.id,lm.state.description,lm.region.regionCode, lm.locationTypeCode, lm.locationFormat, lm.isActive, lm.description, lm.market.marketCode,  lm.country.countryCode,lm.ownerTypeCode,lm.factoryCode.locationCode,lm.cfaCode.locationCode,lm.subRegion.regionCode,lm.subBrand.brandCode,lm.remarks,lm.baseCurrency.currencyCode,lm.stockCurrency.currencyCode,lm.masterCurrency.currencyCode,lm.paymentCurrencies) from LocationDao lm "
			+ "where ((lm.brand.brandCode in(:brandCodes) OR nullif(CHOOSE(1,:brandCodes),'') IS NULL) "
			+ "and (lm.region.regionCode in(:regionCodes) OR nullif(CHOOSE(1,:regionCodes),'') IS NULL) "
			+ "and (lm.ownerTypeCode in(:ownerTypeCodes) OR nullif(CHOOSE(1,:ownerTypeCodes),'') IS NULL) "
			+ "and (lm.state.stateId in(:stateCodes) OR nullif(CHOOSE(1,:stateCodes),'') IS NULL) "
			+ "and (lm.town.townId in(:townId) OR nullif(CHOOSE(1,:townId),'') IS NULL) "
			+ "and (lm.country.countryCode in(:countryCodes) OR nullif(CHOOSE(1,:countryCodes),'') IS NULL) "
			+ "and (lm.locationTypeCode in(:locationTypes) OR nullif(CHOOSE(1,:locationTypes),'') IS NULL) "
			+ "and (lm.factoryCode.locationCode in(:factoryCodes) OR nullif(CHOOSE(1,:factoryCodes),'') IS NULL) "
			+ "and (lm.cfaCode.locationCode in(:cfaCodes) OR nullif(CHOOSE(1,:cfaCodes),'') IS NULL) "
			+ "and (lm.market.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) "
			+ "and (lm.locationFormat in(:locationFormats) OR nullif(CHOOSE(1,:locationFormats),'') IS NULL) "
			+ "and lm.isActive = :isActive)")
	Page<LocationHeaderDto> findAllByIsActiveWithFilters(@Param("brandCodes") List<String> brandCodes,
			@Param("regionCodes") List<String> regionCodes, @Param("ownerTypeCodes") List<String> ownerTypeCodes,
			@Param("stateCodes") List<String> stateCodes, @Param("townId") List<String> townIds,
			@Param("countryCodes") List<String> countryCodes, @Param("locationTypes") List<String> locationTypes,
			@Param("factoryCodes") List<String> factoryCodes, @Param("cfaCodes") List<String> cfaCodes,
			@Param("marketCodes") List<String> marketCodes, @Param("locationFormats") List<String> locationFormats,
			@Param("isActive") Boolean isActive, Pageable pageable);

	Page<LocationHeaderDto> findByIsActiveTrue(Pageable pageable);

	@Query("select new com.titan.poss.core.dto.LocationMarketDto(lm.locationCode, "
			+ "lm.description, lm.market.marketCode) from LocationDao lm "
			+ "where ((lm.market.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) "
			+ "and lm.isActive = :isActive ) order by lm.market.marketCode asc")
	List<LocationMarketDto> findLocationWithFilters(@Param("marketCodes") List<String> marketCodes,
			@Param("isActive") Boolean isActive);

	List<LocationDao> findAllByLocationCodeIn(List<String> locationCodeList);

	boolean existsByLocationCodeAndLocationTypeCodeAndIsActiveTrue(String locationCode, String locationTypeCode);

	@Query("select new com.titan.poss.core.dto.LocationHeaderDto(lm.locationCode,lm.brand.brandCode,lm.town.townId,lm.town.description, lm.state.id,lm.state.description,lm.region.regionCode, lm.locationTypeCode, lm.locationFormat, lm.isActive, lm.description, lm.market.marketCode,  lm.country.countryCode,lm.ownerTypeCode,lm.factoryCode.locationCode,lm.cfaCode.locationCode,lm.subRegion.regionCode,lm.subBrand.brandCode,lm.remarks,lm.baseCurrency.currencyCode,lm.stockCurrency.currencyCode,lm.masterCurrency.currencyCode,lm.paymentCurrencies) from LocationDao lm  where lm.isMigratedFromLegacy = :isMigartedFromLegacy AND lm.isActive = 1 AND lm.locationTypeCode = 'BTQ'")
	Page<LocationHeaderDto> findAllLocationsLegacy(@Param("isMigartedFromLegacy") Boolean isMigartedFromLegacy,
			Pageable pageable);

	@Query("select new com.titan.poss.core.dto.LocationHeaderDto(lm.locationCode,lm.brand.brandCode,lm.town.townId,lm.town.description, lm.state.id,lm.state.description,lm.region.regionCode, lm.locationTypeCode, lm.locationFormat, lm.isActive, lm.description, lm.market.marketCode,  lm.country.countryCode,lm.ownerTypeCode,lm.factoryCode.locationCode,lm.cfaCode.locationCode,lm.subRegion.regionCode,lm.subBrand.brandCode,lm.remarks,lm.baseCurrency.currencyCode,lm.stockCurrency.currencyCode,lm.masterCurrency.currencyCode,lm.paymentCurrencies) from LocationDao lm  where (lm.isMigratedFromLegacy = :isMigartedFromLegacy OR lm.isMigratedFromLegacy IS NULL) AND lm.isActive = 1 AND lm.locationTypeCode = 'BTQ'")
	Page<LocationHeaderDto> findAllLocationsNap(@Param("isMigartedFromLegacy") Boolean isMigartedFromLegacy, Pageable pageable);

	@Query("select new com.titan.poss.core.dto.LocationHeaderDto(lm.locationCode,lm.brand.brandCode,lm.town.townId,lm.town.description, lm.state.id,lm.state.description,lm.region.regionCode, lm.locationTypeCode, lm.locationFormat, lm.isActive, lm.description, lm.market.marketCode,  lm.country.countryCode,lm.ownerTypeCode,lm.factoryCode.locationCode,lm.cfaCode.locationCode,lm.subRegion.regionCode,lm.subBrand.brandCode,lm.remarks,lm.baseCurrency.currencyCode,lm.stockCurrency.currencyCode,lm.masterCurrency.currencyCode,lm.paymentCurrencies) from LocationDao lm  where (lm.locationCode = :locationCode OR lm.locationCode IS NULL) AND lm.isActive = 1")
	List<LocationHeaderDto> findOneListByLocationCode(@Param("locationCode") String locationCode);
	
}
