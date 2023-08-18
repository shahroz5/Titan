/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.location.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.CfaDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.LocationHeaderDto;
import com.titan.poss.engine.dto.TaxCodeDto;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.repository.LocationRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineLocationRepository")
public interface LocationRepositoryExt extends LocationRepository {

	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return Location
	 */
	LocationDao findOneByLocationCodeAndIsActive(String locationCode, Boolean isActive);

	// @formatter:off
	@Query("SELECT new com.titan.poss.core.dto.LocationHeaderDto(lm.locationCode,lm.brand.brandCode,lm.town.townId,lm.town.description, "
			+ "lm.state.id,lm.state.description,lm.region.regionCode, lm.locationTypeCode, lm.locationFormat, lm.isActive, lm.description, lm.market.marketCode,lm.country.countryCode,lm.ownerTypeCode,lm.factoryCode.locationCode,lm.cfaCode.locationCode,lm.subRegion.regionCode,lm.subBrand.brandCode,lm.remarks,lm.baseCurrency.currencyCode,lm.stockCurrency.currencyCode,lm.masterCurrency.currencyCode,lm.paymentCurrencies) "
			+ "FROM LocationDao lm " + "WHERE lm.locationCode = :locationCode and isActive=:isActive")
	// @formatter:on
	LocationHeaderDto findByLocationCodeAndIsActive(@Param("locationCode") String locationCode,
			@Param("isActive") Boolean isActive);

	/**
	 * @param locationCode
	 * @param status
	 * @return TaxCodeDto
	 */
	@Query("SELECT new com.titan.poss.engine.dto.TaxCodeDto(l.ownerTypeCode,s.stateTaxCode,s.taxComponent, l.locationTypeCode) "
			+ "FROM LocationDao l INNER JOIN StateTaxMappingDao s ON s.state.stateId = l.state.stateId "
			+ "WHERE l.locationCode = :locationCode AND l.isActive = :status AND s.isActive = :status")
	TaxCodeDto getOwnerTypeAndStateTaxCodeByLocationCode(@Param("locationCode") String locationCode,
			@Param("status") Boolean status);

	LocationDao findOneByLocationCodeAndLocationTypeCodeAndIsActiveTrue(String locationCode, String locationTypeCode);

	@Query("select l.locationCode from LocationDao l where l.isOffline = 0 AND l.isActive = 1 AND l.locationTypeCode = 'BTQ'")
	List<String> getEpossLocations();

	@Query("select l.locationCode from LocationDao l where l.isActive = 1 AND l.locationTypeCode = 'BTQ'")
	List<String> getPossLocations();

	Page<LocationHeaderDto> findByIsActiveTrue(Pageable pageable);

	@Query("select new com.titan.poss.core.dto.LocationHeaderDto(lm.locationCode,lm.brand.brandCode,lm.town.townId,lm.town.description, "
			//+ "lm.state.id,lm.state.description,lm.region.regionCode, lm.locationTypeCode, lm.locationFormat, lm.isActive, lm.description, lm.market.marketCode,  lm.country.countryCode,lm.ownerTypeCode,lm.factoryCode.locationCode,lm.cfaCode.locationCode,lm.subRegion.regionCode,lm.subBrand.brandCode,lm.remarks,lm.baseCurrency.currencyCode,lm.stockCurrency.currencyCode,lm.masterCurrency.currencyCode,lm.paymentCurrencies, lm.storeDetails) from LocationDao lm "
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

	@Query("select new com.titan.poss.core.dto.LocationHeaderDto(lm.locationCode,lm.brand.brandCode,lm.town.townId,lm.town.description, "
          //  + "lm.state.id,lm.state.description,lm.region.regionCode, lm.locationTypeCode, lm.locationFormat, lm.isActive, lm.description, lm.market.marketCode,  lm.country.countryCode,lm.ownerTypeCode,lm.factoryCode.locationCode,lm.cfaCode.locationCode,lm.subRegion.regionCode,lm.subBrand.brandCode,lm.remarks,lm.baseCurrency.currencyCode,lm.stockCurrency.currencyCode,lm.masterCurrency.currencyCode,lm.paymentCurrencies, lm.storeDetails) from LocationDao lm "
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
			+ "and (lm.locationFormat in(:locationFormats) OR nullif(CHOOSE(1,:locationFormats),'') IS NULL) )")
	Page<LocationHeaderDto> findAllByIsActiveWithFiltersTep(@Param("brandCodes") List<String> brandCodes,
			@Param("regionCodes") List<String> regionCodes, @Param("ownerTypeCodes") List<String> ownerTypeCodes,
			@Param("stateCodes") List<String> stateCodes, @Param("townId") List<String> townIds,
			@Param("countryCodes") List<String> countryCodes, @Param("locationTypes") List<String> locationTypes,
			@Param("factoryCodes") List<String> factoryCodes, @Param("cfaCodes") List<String> cfaCodes,
			@Param("marketCodes") List<String> marketCodes, @Param("locationFormats") List<String> locationFormats,
			Pageable pageable);

			@Query("SELECT new com.titan.poss.core.dto.CfaDto(lm.locationCode,lm.description,lm.locationTypeCode) "
    // @Query("SELECT new com.titan.poss.core.dto.CfaDto(lm.locationCode,lm.description,lm.locationTypeCode, lm.storeDetails) "
			+ "FROM LocationDao lm WHERE lm.locationTypeCode = :locationTypeCode and isActive=:isActive")
	// @formatter:on
	List<CfaDto> findAllByLocationTypeCodeAndIsActive(@Param("locationTypeCode") String locationTypeCode,
			@Param("isActive") Boolean isActive);

	Page<LocationHeaderDto> findByIsActiveFalse(Pageable pageable);
	
	 
    @Query(nativeQuery = true ,value = "SELECT lm.location_code,lm.description as locationDescription, lm.location_type, lm.market_code,mm.description, lm.country_code,cm.description as countryDescription,  lm.region_code,  \r\n"
    		+ "lm.sub_region_code, lm.town_id, tm.description as townDescription, lm.state_id,sm.description as stateDescription, sm.state_code, sm.config_details, lm.owner_type,  \r\n"
    		+ "lm.factory_code, lm.cfa_code, lm.brand_code, lm.sub_brand_code, lm.is_active, lm.created_by, lm.created_date, lm.last_modified_by,  \r\n"
    		+ "lm.last_modified_date, lm.tax_details, lm.banking_details, lm.store_details \r\n"
    		+ "from location_master lm LEFT JOIN country_master cm on lm.country_code=cm.country_code  \r\n"
    		+ "LEFT join town_master tm on lm.town_id=tm.town_id  \r\n"
    		+ "LEFT join state_master sm on lm.state_id=sm.state_id  \r\n"
    		+ "LEFT join market_master mm on lm.market_code=mm.market_code  \r\n"
    		+ "where location_code=:locationCode ")
     List<Object[]> getLocationLists(@Param("locationCode") String locationCode); 
     
     
     @Query(nativeQuery = true ,value = "select location_code from location_master "
     		+ "where last_modified_date IS NULL OR (last_modified_date >= :#{#edcBankRequestDto.fromDocDate} AND last_modified_date <= :#{#edcBankRequestDto.toDocDate})")
      List<String> getLocationcodeList(@Param("edcBankRequestDto")EdcBankRequestDto edcBankRequestDto); 
      

}
