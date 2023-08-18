/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.BoutiqueMetalRateRequestDto;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.CfaDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCoordinateDto;
import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.LocationServicesDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.dto.MetalApplicableDto;
import com.titan.poss.core.dto.MetalGoldPriceDto;
import com.titan.poss.core.dto.MetalRateResponseDto;
import com.titan.poss.core.dto.StateLiteDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.dto.TownLiteDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.engine.dto.CountryLiteDto;
import com.titan.poss.engine.dto.PincodeDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface LocationService {

	/**
	 * This method will return the list of Country details based on the isPageable.
	 * 
	 * @param isPageable
	 * @param description
	 * @param pageable
	 * @return PagedRestResponse<List<CountryLiteDto>>
	 */
	PagedRestResponse<List<CountryLiteDto>> listCountryLite(Boolean isPageable, String description, Pageable pageable);

	/**
	 * This method will return the list of State details based on the countryCode
	 * and isPageable.
	 * 
	 * @param countryCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<StateLiteDto>>
	 */
	PagedRestResponse<List<StateLiteDto>> listStateLite(String countryCode, Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the list of pincode details based on countryCode and
	 * isPageable.
	 * 
	 * @param countryCode
	 * @param pincode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<PincodeLiteDto>>
	 */
	PagedRestResponse<List<PincodeDto>> listPincodeLite(String countryCode, String pincode, Boolean isPageable,
			Pageable pageable);

	/**
	 * This method will return the list of Locations for specific store.
	 * 
	 * @param isActive
	 * @param locationCode
	 * @return LocationResponseDto
	 */
	LocationResponseDto listLocationByLocationCode(String locationCode);

	/**
	 * @param locationCode
	 * @return StoreLocationDto
	 */
	LocationCacheDto getStoreLocation(String locationCode);

	/**
	 * 
	 * @param boutiqueMetalRateRequestDto
	 * @return MetalRateResponseDto
	 */
	MetalRateResponseDto saveMetalRates(BoutiqueMetalRateRequestDto boutiqueMetalRateRequestDto);

	/**
	 * This method will return the Country details.
	 */
	CountryDetailsDto getCountryDetails(String locationCode);

	MarketDto getMarketDetails(String marketCode);
	
	List<MetalGoldPriceDto> getMarketMetalDetails(String locationCode,MetalApplicableDto applicableDate);

	/**
	 * This method will get Brand details for the provided brandCode. 1. For a store
	 * user, brandCode is picked from taken 2. A commercial user needs to give
	 * brandCode as input
	 * 
	 * @param brandCode
	 * @return BrandDto
	 */
	BrandDto getBrandDetails(String brandCode);

	List<String> getAppBasedLocations();
	
	List<CfaDto> getlistOfCfa();

	LovDto getLocationLov(String lovType);

	StorePrintDetailsDto getStorePrintInformation(String locationCode);

	PagedRestResponse<List<LocationDropDownDto>> listLocationsDropDown(LocationFilterDto locationFilter,
			Pageable pageable);

	CountryDto getCountry(String countryCode);

	TownLiteDto getStateAndTownDetails(String stateId,String townId);
	
	List<LocationCoordinateDto> getAllByLocationIfIsActive();
	
	List<LocationServicesDto>  getLocationDetails(String locationCode);
	
	List<String> getLocationCodes(EdcBankRequestDto edcBankRequestDto);


}
