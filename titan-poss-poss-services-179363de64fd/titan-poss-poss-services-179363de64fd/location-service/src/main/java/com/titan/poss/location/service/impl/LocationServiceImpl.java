/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.dto.BankingDetails;
import com.titan.poss.core.dto.CustomerDetails;
import com.titan.poss.core.dto.CustomerOrderDetails;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.DigigoldDetails;
import com.titan.poss.core.dto.EmployeeLocationDto;
import com.titan.poss.core.dto.GepDetails;
import com.titan.poss.core.dto.GhsDetails;
import com.titan.poss.core.dto.GiftCardDetails;
import com.titan.poss.core.dto.GrfDetails;
import com.titan.poss.core.dto.GrnDetails;
import com.titan.poss.core.dto.InventoryDetails;
import com.titan.poss.core.dto.LocationAdvanceBookingDetailsDto;
import com.titan.poss.core.dto.LocationCashMemoDetailsDto;
import com.titan.poss.core.dto.LocationCreditNoteDetails;
import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.LocationHeaderDto;
import com.titan.poss.core.dto.LocationOtpDetails;
import com.titan.poss.core.dto.LocationPaymentDetails;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.OfferDetails;
import com.titan.poss.core.dto.PrintDetails;
import com.titan.poss.core.dto.ServiceDetails;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxDetails;
import com.titan.poss.core.dto.TcsDetails;
import com.titan.poss.core.dto.TepDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.UserServiceClient;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.BrandDao;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.CurrencyDao;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.LocationPriceGroupMappingDaoExt;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.RegionDao;
import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dao.TownDao;
import com.titan.poss.location.dto.LocationDto;
import com.titan.poss.location.dto.LocationPriceGroupMappingSyncDtoExt;
import com.titan.poss.location.dto.LocationSyncDto;
import com.titan.poss.location.dto.PriceGroupMapDto;
import com.titan.poss.location.dto.constants.LocationConstants;
import com.titan.poss.location.dto.constants.LocationTypeEnum;
import com.titan.poss.location.dto.request.LocationPriceGroupDto;
import com.titan.poss.location.dto.request.LocationUpdateDto;
import com.titan.poss.location.dto.request.PriceGroupMapCreateDto;
import com.titan.poss.location.repository.BrandRepository;
import com.titan.poss.location.repository.CountryRepository;
import com.titan.poss.location.repository.CurrencyRepository;
import com.titan.poss.location.repository.LocationPriceGroupMappingRepositoryExt;
import com.titan.poss.location.repository.LocationRepositoryExt;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.repository.MarketRepository;
import com.titan.poss.location.repository.RegionRepository;
import com.titan.poss.location.repository.StateRepository;
import com.titan.poss.location.repository.TownRepository;
import com.titan.poss.location.service.LocationService;
import com.titan.poss.location.service.LocationSyncDataService;
import com.titan.poss.location.service.UserService;


import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("locationService")
public class LocationServiceImpl implements LocationService {

	@Autowired
	private LocationRepositoryExt locationRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private LocationPriceGroupMappingRepositoryExt locationPriceGroupMappingRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private BrandRepository brandRepository;

	@Autowired
	private LocationServiceImpl locationService;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private TownRepository townRepository;

	@Autowired
	private StateRepository stateRepository;

	@Autowired
	private RegionRepository regionRepository;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private MarketRepository marketRepository;

	@Autowired
	private CurrencyRepository currencyRepository;
	
	@Autowired
	private UserServiceClient userServiceClient;
	
	
//	@Autowired
//	EmployeeRepositoryExt employeeRepository;
//
//	@Autowired
//	EmployeeLocationMappingRepository employeeLocationMappingRepository;
//
//	@Autowired
//	RoleRepositoryExt roleRepository;


	@Value("${locationCache}")
	private String locationCache;

	/**
	 * @param locationFilter
	 * @return LocationFilterDto
	 */
	private LocationFilterDto validateLocationFilter(LocationFilterDto locationFilter) {
		if (locationFilter == null)
			return locationFilter;
		if (CollectionUtils.isEmpty(locationFilter.getBrandCodes())) {
			locationFilter.setBrandCodes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getCfaCodes())) {
			locationFilter.setCfaCodes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getCountryCodes())) {
			locationFilter.setCountryCodes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getFactoryCodes())) {
			locationFilter.setFactoryCodes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getLocationFormats())) {
			locationFilter.setLocationFormats(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getLocationTypes())) {
			locationFilter.setLocationTypes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getMarketCodes())) {
			locationFilter.setMarketCodes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getOwnerTypeCodes())) {
			locationFilter.setOwnerTypeCodes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getStateCodes())) {
			locationFilter.setStateCodes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getTownCodes())) {
			locationFilter.setTownCodes(null);
		}
		if (CollectionUtils.isEmpty(locationFilter.getRegionCodes())) {
			locationFilter.setRegionCodes(null);
		}
		if (locationFilter.getIsMigartedFromLegacy() == null)
			locationFilter.setIsMigartedFromLegacy(null);

		return locationFilter;

	}

	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return LocationDto
	 */
	@Override
	public LocationDto getLocation(String locationCode) {
		LocationDao location = locationRepository.findOneByLocationCode(locationCode);
		if (location == null) {
			throw new ServiceException(LocationConstants.NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE,
					LocationConstants.ERR_LOC_001);
		}
		return getMappingOfLocationDto(location);
	}

	/**
	 * This method will save the Location details.
	 * 
	 * @param locationDto
	 * @return LocationDto
	 */
	@Override
	public LocationDto addLocation(LocationDto locationDto) {

		validateRequest(locationDto, locationDto.getLocationTypeCode());
		validateRequestJson(locationDto, locationDto.getLocationTypeCode());

		LocationDao locationDetails = locationRepository.findOneByLocationCode(locationDto.getLocationCode());
		if (locationDetails != null) {
			throw new ServiceException(LocationConstants.LOCATION_DETAILS_ALREADY_EXISTS_FOR_THE_REQUESTED_LOCATIONCODE,
					LocationConstants.ERR_LOC_011);
		}

		LocationDao location = (LocationDao) MapperUtil.getObjectMapping(locationDto, new LocationDao());
		validateJsonFieldsFromRequest(locationDto, locationDto.getLocationTypeCode());
		setLocationAttributes(location, locationDto);

		location.setSrcSyncId(0);
		location.setDestSyncId(0);

		Map<String, SyncStagingDto> data = locationService.saveLocationToDB(location,
				LocationOperationCodes.LOCATION_ADD, true);

		if (locationDto.getIsOffline().booleanValue())
			syncDataService.createQueue(location.getLocationCode());

		syncDataService.publishLocationMessages(data);

		// Call inter service at the end as no dependency
		// User need to use the activate location API to make the location active.
		if (locationDto.getLocationTypeCode().equalsIgnoreCase("BTQ")) {
			// assign roles if BTQ
			userService.assignRolesToBoutique(locationDto.getLocationCode(), locationDto.getLocationFormat(),
					locationDto.getOwnerTypeCode());
		}
		
		if(locationDto.getIsAutostn()== null)
			locationDto.setIsAutostn(false);
		
     return getMappingOfLocationDto(location);
	}

	private void validateRequest(LocationDto locationDto, String locationType) {

		if (locationType.equalsIgnoreCase(LocationTypeEnum.BTQ.toString())) {

			String regEx = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255;

			if (locationDto.getDescription() != null && (!locationDto.getDescription().matches(regEx))) {
				throw new ServiceException(LocationConstants.INVALID_DESCRIPTION, LocationConstants.ERR_LOC_082,
						locationDto.getDescription());
			}

			if (locationDto.getOwnerTypeCode() == null) {
				throw new ServiceException(LocationConstants.OWNER_TYPE_CODE_MANDATORY, LocationConstants.ERR_LOC_075,
						locationDto.getOwnerTypeCode());
			}

			// factory code is mandatory for L1 and L2
			if (locationDto.getOwnerTypeCode() != null
					&& (locationDto.getOwnerTypeCode().equalsIgnoreCase("L1")
							|| locationDto.getOwnerTypeCode().equalsIgnoreCase("L2"))
					&& StringUtils.isEmpty(locationDto.getFactoryCodeValue())) {
				throw new ServiceException("FatoryCode Cannot be null if ownerType is L1 or L2",
						LocationConstants.ERR_LOC_078, locationDto.getFactoryCodeValue());
			}

			if (locationDto.getOwnerTypeCode() != null && locationDto.getOwnerTypeCode().equalsIgnoreCase("L3")
					&& StringUtils.isEmpty(locationDto.getCfaCodeValue())) {
				throw new ServiceException("CFACodeValue Cannot be null if ownerType is L3",
						LocationConstants.ERR_LOC_074, locationDto.getCfaCodeValue());
			}

			validateRequestRemainingForBoutique(locationDto);

		}

	}

	private void validateRequestRemainingForBoutique(LocationDto locationDto) {
		if (locationDto.getLocationFormat() == null) {
			throw new ServiceException(LocationConstants.LOCATION_FORMAT_MANDATORY, LocationConstants.ERR_LOC_077);
		}

		if (locationDto.getMarketCode() == null) {
			throw new ServiceException(LocationConstants.MARKET_CODE_MANDATORY, LocationConstants.ERR_LOC_076);
		}
		if (locationDto.getRegionCode() == null) {
			throw new ServiceException(LocationConstants.REGION_MANDATORY, LocationConstants.ERR_LOC_079);
		}
		if (locationDto.getSubRegionCode() == null) {
			throw new ServiceException(LocationConstants.SUB_REGION_MANDATORY, LocationConstants.ERR_LOC_080);
		}

	}

	/**
	 * @param location
	 * @param locationTypeCode
	 */
	private void validateJsonFieldsFromRequest(LocationDto location, String locationTypeCode) {
		if (Boolean.TRUE.equals(location.getIsActive())
				&& locationTypeCode.equalsIgnoreCase(LocationTypeEnum.BTQ.toString())) {
			if (location.getAbDetails() == null) {
				throw new ServiceException(LocationConstants.CONFIGURATIONS_FOR_AB_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_047);
			}

			if (location.getBankingDetails() == null) {
				throw new ServiceException(
						LocationConstants.CONFIGURATIONS_FOR_BANKING_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_048);
			}
			if (location.getCmDetails() == null) {
				throw new ServiceException(
						LocationConstants.CONFIGURATIONS_FOR_CM_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_049);
			}
			if (location.getCnDetails() == null) {
				throw new ServiceException(
						LocationConstants.CONFIGURATIONS_FOR_CN_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_050);
			}
			if (location.getCoDetails() == null) {
				throw new ServiceException(
						LocationConstants.CONFIGURATIONS_FOR_CO_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_051);
			}

			validationRemainingFieldsFromRequest(location);
		}

	}

	/**
	 * @param location
	 */
	private void validationRemainingFieldsFromRequest(LocationDto location) {
		if (location.getStoreDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_STORE_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_052);
		}
		if (location.getCustomerDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_CUSTOMER_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_053);
		}
		if (location.getGcDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GC_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_054);
		}
		if (location.getGepDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GEP_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_055);
		}

		if (location.getGhsDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GHS_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_056);
		}
		if (location.getGrfDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GRF_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_057);
		}
		if (location.getGrnDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GRN_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_058);
		}
		if (location.getInventoryDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_INVENTORY_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_059);
		}
		if (location.getOfferDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_OFFER_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_060);
		}
		if (location.getOtpDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_OTP_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_061);
		}
		if (location.getPaymentDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_PAYMENT_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_062);
		}
		if (location.getPrintDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_PRINT_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_063);
		}
		if (location.getTaxDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_TAX_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_064);
		}
		if (location.getServiceDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_SERVICE_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_089);
		}
	}

	/**
	 * @param locationDto
	 * @param string
	 */
	private void validateRequestJson(LocationDto locationDto, String locationTypeCode) {

		if (locationTypeCode.equalsIgnoreCase(LocationTypeEnum.BTQ.toString())) {

			if (locationDto.getAbDetails() != null) {
				new LocationAdvanceBookingDetailsDto().validate(locationDto.getAbDetails().getData());
			}
			if (locationDto.getBankingDetails() != null) {
				new BankingDetails().validate(locationDto.getBankingDetails().getData());
			}
			if (locationDto.getCmDetails() != null) {
				new LocationCashMemoDetailsDto().validate(locationDto.getCmDetails().getData());
			}

			validateRemainingFields(locationDto);
		}
	}

	/**
	 * @param locationDto
	 */
	private void validateRemainingFields(LocationDto locationDto) {
		if (locationDto.getCnDetails() != null) {
			new LocationCreditNoteDetails().validate(locationDto.getCnDetails().getData());

		}
		if (locationDto.getCoDetails() != null) {
			new CustomerOrderDetails().validate(locationDto.getCoDetails().getData());
		}
		if (locationDto.getStoreDetails() != null) {
			new StoreDetails().validate(locationDto.getStoreDetails().getData());
		}
		if (locationDto.getCustomerDetails() != null) {
			new CustomerDetails().validate(locationDto.getCustomerDetails().getData());
		}
		if (locationDto.getGcDetails() != null) {
			new GiftCardDetails().validate(locationDto.getGcDetails().getData());
		}
		if (locationDto.getGepDetails() != null) {
			new GepDetails().validate(locationDto.getGepDetails().getData());
		}
		if (locationDto.getGhsDetails() != null) {
			new GhsDetails().validate(locationDto.getGhsDetails().getData());
		}
		if (locationDto.getGrfDetails() != null) {
			new GrfDetails().validate(locationDto.getGrfDetails().getData());
		}
		if (locationDto.getGrnDetails() != null) {
			new GrnDetails().validate(locationDto.getGrnDetails().getData());
		}
		if (locationDto.getInventoryDetails() != null) {
			new InventoryDetails().validate(locationDto.getInventoryDetails().getData());
		}
		if (locationDto.getOfferDetails() != null) {
			new OfferDetails().validate(locationDto.getOfferDetails().getData());
		}
		if (locationDto.getOtpDetails() != null) {
			new LocationOtpDetails().validate(locationDto.getOtpDetails().getData());
		}
		if (locationDto.getPaymentDetails() != null) {
			new LocationPaymentDetails().validate(locationDto.getPaymentDetails().getData());
		}
		if (locationDto.getPrintDetails() != null) {
			new PrintDetails().validate(locationDto.getPrintDetails().getData());
		}
		if (locationDto.getTaxDetails() != null) {
			new TaxDetails().validate(locationDto.getTaxDetails().getData());
		}
		if (locationDto.getTepDetails() != null) {
			new TepDetailsDto().validate(locationDto.getTepDetails().getData());
		}
		if (locationDto.getDigigoldDetails() != null) {
			new DigigoldDetails().validate(locationDto.getDigigoldDetails().getData());
		}
		if (locationDto.getTcsDetails() != null) {
			new TcsDetails().validate(locationDto.getTcsDetails().getData());
		}
		if (locationDto.getServiceDetails() != null) {
			new ServiceDetails().validate(locationDto.getServiceDetails().getData());
		}
	}

	/**
	 * @param location
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveLocationToDB(LocationDao location, String operation,
			boolean isPublishToEGHS) {
		// clearing the cache in engine service
		engineServiceClient.clearCache(locationCache, location.getLocationCode());

		LocationDao savedLocation = locationRepository.saveAndFlush(location);

		List<SyncData> syncDataList = new ArrayList<>();
		LocationSyncDto locationSyncDto = new LocationSyncDto(savedLocation);

		syncDataList.add(DataSyncUtil.createSyncData(locationSyncDto, 0));
		List<String> destinations = new ArrayList<>();

		return syncDataService.getLocationSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the Location details.
	 * 
	 * @param locationCode
	 * @param locationUpdateDto
	 * @return LocationDto
	 */
	@Override
	public LocationDto updateLocation(String locationCode, LocationUpdateDto locationUpdateDto) {

		LocationDto locationDto = (LocationDto) MapperUtil.getObjectMapping(locationUpdateDto, new LocationDto());

		locationDto.setDescription(locationUpdateDto.getDescription());
		LocationDao location = locationRepository.findOneByLocationCode(locationCode);
		if (location == null) {
			throw new ServiceException(LocationConstants.NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE,
					LocationConstants.ERR_LOC_001);
		}

		if (!location.getLocationTypeCode().equalsIgnoreCase(LocationTypeEnum.BTQ.toString())
				&& (locationDto.getDescription() != null && StringUtils.isEmpty(locationDto.getDescription()))) {
			location.setDescription(null);
		}
		if (locationUpdateDto.getIsOffline() != null) {
			if (!location.getIsOffline().booleanValue() && locationUpdateDto.getIsOffline().booleanValue()) {
				syncDataService.createQueue(location.getLocationCode());
			}
		}

		validateRequestJson(locationDto, location.getLocationTypeCode());

		location = (LocationDao) MapperUtil.getObjectMapping(locationDto, location);
		location.setLocationCode(locationCode);

		validateJsonFieldsFromRequestPatch(location, location.getLocationTypeCode());
		setLocationAttributes(location, locationDto);

		location.setSrcSyncId(location.getSrcSyncId() + 1);

		Map<String, SyncStagingDto> data = locationService.saveLocationToDB(location,
				LocationOperationCodes.LOCATION_UPDATE, true);

		syncDataService.publishLocationMessages(data);
		return getMappingOfLocationDto(location);
	}

	private void validateJsonFieldsFromRequestPatch(LocationDao location, String locationTypeCode) {
		if (Boolean.TRUE.equals(location.getIsActive())
				&& locationTypeCode.equalsIgnoreCase(LocationTypeEnum.BTQ.toString())) {
			if (location.getAbDetails() == null) {
				throw new ServiceException(LocationConstants.CONFIGURATIONS_FOR_AB_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_047);
			}

			if (location.getBankingDetails() == null) {
				throw new ServiceException(
						LocationConstants.CONFIGURATIONS_FOR_BANKING_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_048);
			}
			if (location.getCmDetails() == null) {
				throw new ServiceException(
						LocationConstants.CONFIGURATIONS_FOR_CM_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_049);
			}
			if (location.getCnDetails() == null) {
				throw new ServiceException(
						LocationConstants.CONFIGURATIONS_FOR_CN_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_050);
			}
			if (location.getCoDetails() == null) {
				throw new ServiceException(
						LocationConstants.CONFIGURATIONS_FOR_CO_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
						LocationConstants.ERR_LOC_051);
			}

			validationRemainingFieldsFromPatchRequest(location);
		}

	}

	private void validationRemainingFieldsFromPatchRequest(LocationDao location) {

		if (location.getStoreDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_STORE_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_052);
		}
		if (location.getCustomerDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_CUSTOMER_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_053);
		}
		if (location.getGcDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GC_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_054);
		}
		if (location.getGepDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GEP_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_055);
		}

		if (location.getGhsDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GHS_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_056);
		}
		if (location.getGrfDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GRF_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_057);
		}
		if (location.getGrnDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_GRN_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_058);
		}
		if (location.getInventoryDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_INVENTORY_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_059);
		}
		if (location.getOfferDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_OFFER_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_060);
		}
		if (location.getOtpDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_OTP_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_061);
		}
		if (location.getPaymentDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_PAYMENT_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_062);
		}
		if (location.getPrintDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_PRINT_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_063);
		}
		if (location.getTaxDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_TAX_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_064);
		}
		if (location.getDigigoldDetails() == null) {
			throw new ServiceException(LocationConstants.CONFIGURATIONS_FOR_DIGIGOLD_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_085);
		}
		if (location.getTcsDetails() == null) {
			throw new ServiceException(
					LocationConstants.CONFIGURATIONS_FOR_TCS_DETAILS_CANNOT_BE_NULL_FOR_ACTIVE_LOCATION,
					LocationConstants.ERR_LOC_065);
		}
	}

	/**
	 * This method will copy the Location details from source location to the
	 * destination location.
	 * 
	 * @param srcLocationCode
	 * @param dstLocationCode
	 * @return LocationDto
	 */
	@Override
	@Transactional
	public LocationDto copyLocation(String srcLocationCode, String dstLocationCode) {
		LocationDao locationDetails = locationRepository.findOneByLocationCode(dstLocationCode);
		if (locationDetails != null) {
			throw new ServiceException(LocationConstants.LOCATION_DETAILS_ALREADY_EXISTS_FOR_THE_REQUESTED_LOCATIONCODE,
					LocationConstants.ERR_LOC_011);
		}
		LocationDto locationDto = this.getLocation(srcLocationCode);
		locationDto.setLocationCode(dstLocationCode);
		LocationDao location = (LocationDao) MapperUtil.getObjectMapping(locationDto, new LocationDao());
		setLocationAttributes(location, locationDto);
		location.setSrcSyncId(0);
		location.setDestSyncId(0);
		Map<String, SyncStagingDto> data = locationService.saveLocationToDB(location,
				LocationOperationCodes.LOCATION_COPY, true);
		if (locationDto.getIsOffline().booleanValue())
			syncDataService.createQueue(location.getLocationCode());
		// Publishing to data sync queue
		syncDataService.publishLocationMessages(data);
		// Call inter service at the end as no dependency
		// User need to use the activate location API to make the location active.
		if (locationDto.getLocationTypeCode().equalsIgnoreCase("BTQ")) {
			// assign roles if BTQ
			log.info("Calling User-service : Assign");
			userService.assignRolesToBoutique(locationDto.getLocationCode(), locationDto.getLocationFormat(),
					locationDto.getOwnerTypeCode());
		}

		return getMappingOfLocationDto(location);
	}

	private LocationDto getMappingOfLocationDto(LocationDao location) {
		LocationDto locationDto = new LocationDto();

		locationDto = (LocationDto) MapperUtil.getObjectMapping(location, locationDto);

		return addDtoDepends(location, locationDto);
	}

	/**
	 * @param location
	 * @param locationDto
	 * @return
	 */
	private LocationDto addDtoDepends(LocationDao locationDao, LocationDto locationDto) {
		if ((locationDao.getFactoryCode()) != null
				&& (!StringUtils.isEmpty(locationDao.getFactoryCode().getLocationCode()))) {
			locationDto.setFactoryCodeValue(locationDao.getFactoryCode().getLocationCode());
		}

		if ((locationDao.getCfaCode()) != null && (!StringUtils.isEmpty(locationDao.getCfaCode().getLocationCode()))) {
			locationDto.setCfaCodeValue(locationDao.getCfaCode().getLocationCode());
		}
		if (locationDao.getRegion() != null)
			locationDto.setRegionCode(locationDao.getRegion().getRegionCode());

		if (locationDao.getTown() != null) {
			locationDto.setTownId(locationDao.getTown().getTownId());
			locationDto.setTownName(locationDao.getTown().getDescription());
		}

		if (locationDao.getMarket() != null)
			locationDto.setMarketCode(locationDao.getMarket().getMarketCode());

		if (locationDao.getSubRegion() != null)
			locationDto.setSubRegionCode(locationDao.getSubRegion().getRegionCode());

		if (locationDao.getState() != null) {
			locationDto.setStateId(locationDao.getState().getStateId());
			locationDto.setStateName(locationDao.getState().getDescription());
		}

		if (locationDao.getCountry() != null)
			locationDto.setCountryCode(locationDao.getCountry().getCountryCode());

		if (locationDao.getBrand() != null)
			locationDto.setBrandCode(locationDao.getBrand().getBrandCode());

		if (locationDao.getSubBrand() != null)
			locationDto.setSubBrandCode(locationDao.getSubBrand().getBrandCode());

		if (locationDao.getBaseCurrency() != null)
			locationDto.setBaseCurrency(locationDao.getBaseCurrency().getCurrencyCode());

		if (locationDao.getMasterCurrency() != null)
			locationDto.setMasterCurrency(locationDao.getMasterCurrency().getCurrencyCode());

		if (locationDao.getStockCurrency() != null)
			locationDto.setStockCurrency(locationDao.getStockCurrency().getCurrencyCode());

		setJsonResponse(locationDao, locationDto);
		return locationDto;
	}

	/**
	 * @param locationDao
	 * @param locationDto
	 */
	private void setJsonResponse(LocationDao locationDao, LocationDto locationDto) {

		if (locationDao.getAbDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getAbDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setAbDetails(jsonData);
		}

		if (locationDao.getBankingDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getBankingDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setBankingDetails(jsonData);
		}

		if (locationDao.getCmDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getCmDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setCmDetails(jsonData);
		}

		if (locationDao.getCnDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getCnDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setCnDetails(jsonData);
		}

		if (locationDao.getCoDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getCoDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setCoDetails(jsonData);
		}

		if (locationDao.getCustomerDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getCustomerDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setCustomerDetails(jsonData);
		}

		if (locationDao.getGcDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getGcDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setGcDetails(jsonData);
		}

		if (locationDao.getGepDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getGepDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setGepDetails(jsonData);
		}

		if (locationDao.getGhsDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getGhsDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setGhsDetails(jsonData);
		}
		
		if (locationDao.getServiceDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getServiceDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setServiceDetails(jsonData);
		}

		if (locationDao.getGrfDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getGrfDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setGrfDetails(jsonData);
		}

		if (locationDao.getGrnDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getGrnDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setGrnDetails(jsonData);
		}

		if (locationDao.getTepDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getTepDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setTepDetails(jsonData);
		}

		setResponseOfRemainingJsonFields(locationDao, locationDto);
	}

	/**
	 * @param locationDao
	 * @param locationDto
	 */
	private void setResponseOfRemainingJsonFields(LocationDao locationDao, LocationDto locationDto) {
		if (locationDao.getInventoryDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getInventoryDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setInventoryDetails(jsonData);
		}
		if (locationDao.getOfferDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getOfferDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setOfferDetails(jsonData);
		}

		if (locationDao.getOtpDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getOtpDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setOtpDetails(jsonData);
		}

		if (locationDao.getPaymentDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getPaymentDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setPaymentDetails(jsonData);
		}

		if (locationDao.getPrintDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getPrintDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setPrintDetails(jsonData);
		}

		if (locationDao.getStoreDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getStoreDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setStoreDetails(jsonData);
		}

		if (locationDao.getTaxDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getTaxDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setTaxDetails(jsonData);
		}

		if (locationDao.getDigigoldDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getDigigoldDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setDigigoldDetails(jsonData);
		}

		if (locationDao.getTcsDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getTcsDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setTcsDetails(jsonData);
		}

	}

	private LocationDao setLocationAttributes(LocationDao location, LocationDto locationDto) {

		location.setIsHome(false);

		location.setIsAutostn(false);
		
		// factory code is mandatory for L1 and L2
		if (locationDto.getFactoryCodeValue() != null) {
			LocationDao factoryLocation = locationRepository.findById(locationDto.getFactoryCodeValue())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_LOCATION_EXISTS_FOR_THE_ENTERED_FACTORY_CODE,
							LocationConstants.ERR_LOC_014));
			location.setFactoryCode(factoryLocation);
		}

		// for L3,cfaCode is mandatory.CfaCode is an agency here
		if (locationDto.getCfaCodeValue() != null) {

			LocationDao cfaLocation = locationRepository.findById(locationDto.getCfaCodeValue()).orElseThrow(
					() -> new ServiceException(LocationConstants.NO_LOCATION_EXISTS_FOR_THE_ENTERED_CFA_CODE,
							LocationConstants.ERR_LOC_015));
			location.setCfaCode(cfaLocation);
		}

		if (locationDto.getBrandCode() != null) {
			BrandDao brandDao = brandRepository.findById(locationDto.getBrandCode()).orElseThrow(
					() -> new ServiceException(LocationConstants.NO_BRAND_DETAILS_FOUND_FOR_REQUESTED_BRANDCODE,
							LocationConstants.ERR_LOC_036));
			location.setBrand(brandDao);
		}

		if (locationDto.getSubBrandCode() != null) {
			BrandDao subBrandDao = brandRepository.findById(locationDto.getSubBrandCode())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_BRAND_DETAILS_FOUND_FOR_REQUESTED_SUB_BRANDCODE,
							LocationConstants.ERR_LOC_037));
			location.setSubBrand(subBrandDao);
		}

		if (locationDto.getRegionCode() != null) {
			RegionDao region = regionRepository.findById(locationDto.getRegionCode())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_REGION_DETAILS_FOUND_FOR_THE_REQUESTED_REGIONCODE,
							LocationConstants.ERR_LOC_003));
			location.setRegion(region);
		}

		if (locationDto.getTownId() != null) {
			TownDao townDao = townRepository.findById(locationDto.getTownId())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_TOWN_DETAILS_FOUND_FOR_THE_REQUESTED_TOWNCODE,
							LocationConstants.ERR_LOC_008));
			location.setTown(townDao);
		}

		setRemainingLocationAttributes(location, locationDto);

		return location;
	}

	/**
	 * @param location
	 * @param locationDto
	 */
	private void setRemainingLocationAttributes(LocationDao location, LocationDto locationDto) {
		if (locationDto.getMarketCode() != null) {
			MarketDao market = marketRepository.findById(locationDto.getMarketCode())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_MARKET_DETAILS_FOUND_FOR_REQUESTED_MARKET_CODE,
							LocationConstants.ERR_LOC_017));
			market.setMarketCode(locationDto.getMarketCode());
			location.setMarket(market);
		}

		if (locationDto.getSubRegionCode() != null) {
			RegionDao subRegion = regionRepository.findById(locationDto.getSubRegionCode())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_REGION_DETAILS_FOUND_FOR_THE_REQUESTED_REGIONCODE,
							LocationConstants.ERR_LOC_003));
			location.setSubRegion(subRegion);
		}

		if (locationDto.getStateId() != null) {
			StateDao state = stateRepository.findById(locationDto.getStateId())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_STATE_DETAILS_FOUND_FOR_THE_REQUESTED_STATECODE,
							LocationConstants.ERR_LOC_004));
			location.setState(state);
		}

		if (locationDto.getCountryCode() != null) {
			CountryDao country = countryRepository.findById(locationDto.getCountryCode())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_COUNTRY_DETAILS_FOUND_FOR_THE_REQUESTED_COUNTRYCODE,
							LocationConstants.ERR_LOC_002));
			location.setCountry(country);
		}

		if (locationDto.getBaseCurrency() != null) {
			CurrencyDao baseCurrency = currencyRepository.findById(locationDto.getBaseCurrency())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_CURRENCY_DETAILS_FOUND_FOR_THE_REQUESTED_CURRENCYCODE,
							LocationConstants.ERR_LOC_046));
			location.setBaseCurrency(baseCurrency);
		}

		if (locationDto.getStockCurrency() != null) {
			CurrencyDao stockCurrency = currencyRepository.findById(locationDto.getStockCurrency())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_CURRENCY_DETAILS_FOUND_FOR_THE_REQUESTED_CURRENCYCODE,
							LocationConstants.ERR_LOC_046));
			location.setStockCurrency(stockCurrency);
		}

		if (locationDto.getMasterCurrency() != null) {
			CurrencyDao masterCurrency = currencyRepository.findById(locationDto.getMasterCurrency())
					.orElseThrow(() -> new ServiceException(
							LocationConstants.NO_CURRENCY_DETAILS_FOUND_FOR_THE_REQUESTED_CURRENCYCODE,
							LocationConstants.ERR_LOC_046));
			location.setMasterCurrency(masterCurrency);
		}

		setConfigDetails(location, locationDto);

	}

	/**
	 * @param location
	 * @param locationDto
	 */
	private void setConfigDetails(LocationDao location, LocationDto locationDto) {

		if (locationDto.getAbDetails() != null) {
			location.setAbDetails(MapperUtil.getStringFromJson(locationDto.getAbDetails()));
		}

		if (locationDto.getBankingDetails() != null) {
			location.setBankingDetails(MapperUtil.getStringFromJson(locationDto.getBankingDetails()));
		}
		if (locationDto.getCmDetails() != null) {
			location.setCmDetails(MapperUtil.getStringFromJson(locationDto.getCmDetails()));
		}
		if (locationDto.getCnDetails() != null) {
			location.setCnDetails(MapperUtil.getStringFromJson(locationDto.getCnDetails()));
		}
		if (locationDto.getCoDetails() != null) {
			location.setCoDetails(MapperUtil.getStringFromJson(locationDto.getCoDetails()));
		}
		if (locationDto.getStoreDetails() != null) {
			location.setStoreDetails(MapperUtil.getStringFromJson(locationDto.getStoreDetails()));
		}
		if (locationDto.getCustomerDetails() != null) {
			location.setCustomerDetails(MapperUtil.getStringFromJson(locationDto.getCustomerDetails()));
		}
		if (locationDto.getGcDetails() != null) {
			location.setGcDetails(MapperUtil.getStringFromJson(locationDto.getGcDetails()));
		}
		if (locationDto.getGepDetails() != null) {
			location.setGepDetails(MapperUtil.getStringFromJson(locationDto.getGepDetails()));
		}
		setRemainingJsonFields(location, locationDto);

	}

	/**
	 * @param location
	 * @param locationDto
	 */
	private void setRemainingJsonFields(LocationDao location, LocationDto locationDto) {
		if (locationDto.getGhsDetails() != null) {
			location.setGhsDetails(MapperUtil.getStringFromJson(locationDto.getGhsDetails()));
		}
		if (locationDto.getGrfDetails() != null) {
			location.setGrfDetails(MapperUtil.getStringFromJson(locationDto.getGrfDetails()));
		}
		if (locationDto.getGrnDetails() != null) {
			location.setGrnDetails(MapperUtil.getStringFromJson(locationDto.getGrnDetails()));
		}
		if (locationDto.getInventoryDetails() != null) {
			location.setInventoryDetails(MapperUtil.getStringFromJson(locationDto.getInventoryDetails()));
		}
		if (locationDto.getOfferDetails() != null) {
			location.setOfferDetails(MapperUtil.getStringFromJson(locationDto.getOfferDetails()));
		}
		if (locationDto.getOtpDetails() != null) {
			location.setOtpDetails(MapperUtil.getStringFromJson(locationDto.getOtpDetails()));
		}
		if (locationDto.getPaymentDetails() != null) {
			location.setPaymentDetails(MapperUtil.getStringFromJson(locationDto.getPaymentDetails()));
		}
		if (locationDto.getPrintDetails() != null) {
			location.setPrintDetails(MapperUtil.getStringFromJson(locationDto.getPrintDetails()));
		}
		if (locationDto.getTaxDetails() != null) {
			location.setTaxDetails(MapperUtil.getStringFromJson(locationDto.getTaxDetails()));
		}
		if (locationDto.getTepDetails() != null) {
			location.setTepDetails(MapperUtil.getStringFromJson(locationDto.getTepDetails()));
		}
		if (locationDto.getDigigoldDetails() != null) {
			location.setDigigoldDetails(MapperUtil.getStringFromJson(locationDto.getDigigoldDetails()));
		}
		if (locationDto.getTcsDetails() != null) {
			location.setTcsDetails(MapperUtil.getStringFromJson(locationDto.getTcsDetails()));
		}
		if (locationDto.getServiceDetails() != null) {
			location.setServiceDetails(MapperUtil.getStringFromJson(locationDto.getServiceDetails()));
		}
	}

	@Override
	public PagedRestResponse<List<LocationHeaderDto>> listIBTLocations(String regionType, List<String> ownerTypeCodes,
			List<String> locationTypes, Pageable pageable) {
		AuthUser authuser = CustomSecurityPrincipal.getSecurityPrincipal();
		LocationFilterDto locationFilter = new LocationFilterDto();
		Page<LocationHeaderDto> locationList = null;
		boolean isActive = true;
		LocationDao location = locationRepository.findOneByLocationCodeAndIsActive(authuser.getLocationCode(),
				isActive);
		if (location == null) {
			throw new ServiceException(LocationConstants.NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE,
					LocationConstants.ERR_LOC_001);
		}
		if (regionType != null && regionType.equalsIgnoreCase("TOWN")) {
			List<String> townCodes = new ArrayList<>(Arrays.asList(location.getTown().getTownId()));
			locationFilter.setTownCodes(townCodes);
		} else if (regionType != null && regionType.equalsIgnoreCase("STATE")) {
			List<String> stateCodes = new ArrayList<>(Arrays.asList(location.getState().getStateId()));
			locationFilter.setStateCodes(stateCodes);
		} else if (regionType != null && regionType.equalsIgnoreCase("REGION")) {
			List<String> regionCodes = new ArrayList<>(Arrays.asList(location.getRegion().getRegionCode()));
			locationFilter.setRegionCodes(regionCodes);
		} else if (regionType != null && regionType.equalsIgnoreCase("COUNTRY")) {
			List<String> countryCodes = new ArrayList<>(Arrays.asList(location.getCountry().getCountryCode()));
			locationFilter.setCountryCodes(countryCodes);
		}
		if (ownerTypeCodes != null && !ownerTypeCodes.isEmpty()) {
			locationFilter.setOwnerTypeCodes(ownerTypeCodes);
		} else {
			List<String> ownerTypeCodeList = new ArrayList<>(Arrays.asList("L1", "L2"));
			locationFilter.setOwnerTypeCodes(ownerTypeCodeList);
		}
		if (locationTypes != null && !locationTypes.isEmpty()) {
			locationFilter.setLocationTypes(locationTypes);
		} else {
			List<String> locationTypeList = new ArrayList<>(Arrays.asList("BTQ"));
			locationFilter.setLocationTypes(locationTypeList);

		}

		locationList = locationRepository.findAllByIsActiveWithFilters(locationFilter.getBrandCodes(),
				locationFilter.getRegionCodes(), locationFilter.getOwnerTypeCodes(), locationFilter.getStateCodes(),
				locationFilter.getTownCodes(), locationFilter.getCountryCodes(), locationFilter.getLocationTypes(),
				locationFilter.getFactoryCodes(), locationFilter.getCfaCodes(), locationFilter.getMarketCodes(),
				locationFilter.getLocationFormats(), isActive, pageable);

		return new PagedRestResponse<>(locationList.getContent(), locationList);
	}

	@Override
	@Transactional
	public LocationDto activateLocation(String locationCode) {
		LocationDto locationDto = this.getLocation(locationCode);
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		List<String> str = new ArrayList<>();
		Set<ConstraintViolation<LocationDto>> violationsCourier = validator.validate(locationDto);
		violationsCourier.forEach(violation -> str.add(violation.getMessage()));
		if (!violationsCourier.isEmpty()) {
			throw new ServiceException("JSON data format error", "ERR-CORE-013", str);
		} else {
			LocationUpdateDto locationUpdateDto = new LocationUpdateDto();
			locationUpdateDto.setIsActive(true);
			locationDto = this.updateLocation(locationDto.getLocationCode(), locationUpdateDto);
		}
		return locationDto;
	}

	@Override
	public PagedRestResponse<List<LocationDropDownDto>> listLocationsDropDown(LocationFilterDto locationFilter,
			Pageable pageable) {
		validateLocationFilter(locationFilter);
		List<LocationDropDownDto> locationDropDownDto = new ArrayList<>();
		Page<LocationHeaderDto> locationList = null;
		List<EmployeeLocationDto> employeeLocation = userServiceClient.listLocationMapping();
		Page<EmployeeLocationDto> pagedData = new PageImpl<>(employeeLocation,
				PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()),employeeLocation.size());
		if(pagedData!=null && !CollectionUtil.isEmpty(pagedData.getContent())) {
			for(EmployeeLocationDto locations : pagedData) {
				List<LocationHeaderDto> location= locationRepository.findOneListByLocationCode(locations.getLocationCode());
				
					LocationDropDownDto locationDropDown = (LocationDropDownDto) MapperUtil.getDtoMapping(location.get(0),
							LocationDropDownDto.class);
					locationDropDownDto.add(locationDropDown);
				
			}
			return new PagedRestResponse<>(locationDropDownDto, pagedData);
		}
		if (locationFilter == null) {
			locationList = locationRepository.findByIsActiveTrue(pageable);
		} else if (locationFilter.getIsMigartedFromLegacy() != null) {
			if (BooleanUtils.isFalse(locationFilter.getIsMigartedFromLegacy()))
				locationList = locationRepository.findAllLocationsLegacy(locationFilter.getIsMigartedFromLegacy(),
						pageable);
			else
				locationList = locationRepository.findAllLocationsNap(locationFilter.getIsMigartedFromLegacy(),
						pageable);
		} 		
		else {
			locationList = locationRepository.findAllByIsActiveWithFilters(locationFilter.getBrandCodes(),
					locationFilter.getRegionCodes(), locationFilter.getOwnerTypeCodes(), locationFilter.getStateCodes(),
					locationFilter.getTownCodes(), locationFilter.getCountryCodes(), locationFilter.getLocationTypes(),
					locationFilter.getFactoryCodes(), locationFilter.getCfaCodes(), locationFilter.getMarketCodes(),
					locationFilter.getLocationFormats(), true, pageable);
		}
		for (LocationHeaderDto locationHeaderDto : locationList) {
			LocationDropDownDto locationDropDown = (LocationDropDownDto) MapperUtil.getDtoMapping(locationHeaderDto,
					LocationDropDownDto.class);
			locationDropDownDto.add(locationDropDown);
		}
		return new PagedRestResponse<>(locationDropDownDto, locationList);
	}

	@Override
	public ListResponse<PriceGroupMapDto> listLocationPriceGroupMapping(String locationCode) {

		LocationDao location = new LocationDao();
		location.setLocationCode(locationCode);
		LocationPriceGroupMappingDaoExt locationPriceGroupMapping = new LocationPriceGroupMappingDaoExt();
		locationPriceGroupMapping.setLocation(location);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<LocationPriceGroupMappingDaoExt> criteria = Example.of(locationPriceGroupMapping, matcher);

		List<LocationPriceGroupMappingDaoExt> priceGroupList = locationPriceGroupMappingRepository.findAll(criteria);

		if (CollectionUtils.isEmpty(priceGroupList))
			throw new ServiceException("No price group mapping found for requested locationCode", "ERR-LOC-031");

		List<PriceGroupMapDto> locationPriceGroupMappingDtoList = new ArrayList<>();

		priceGroupList.forEach(priceGroupData -> {
			PriceGroupMapDto priceGroup = (PriceGroupMapDto) MapperUtil.getObjectMapping(priceGroupData,
					new PriceGroupMapDto());
			locationPriceGroupMappingDtoList.add(priceGroup);
		});

		return new ListResponse<>(locationPriceGroupMappingDtoList);
	}

	@Override
	public LocationPriceGroupDto locationPriceGroupMapping(String locationCode,
			@Valid LocationPriceGroupDto locationPriceGroupDto) {
		if (!locationRepository.findById(locationCode).isPresent())
			throw new ServiceException(LocationConstants.NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE,
					LocationConstants.ERR_LOC_032);

		LocationDao location = new LocationDao();
		location.setLocationCode(locationCode);
		List<LocationPriceGroupMappingDaoExt> locationPriceGroupMapping = new ArrayList<>();

		List<LocationPriceGroupMappingDaoExt> delLocation = new ArrayList<>();
		if (!CollectionUtils.isEmpty(locationPriceGroupDto.getRemovePriceGroup())) {
			delLocation = removelocationPriceGrpMapping(
					locationPriceGroupDto.getRemovePriceGroup());

		}

		if (!CollectionUtils.isEmpty(locationPriceGroupDto.getAddPriceGroup())) {
			addLocationPriceGrpMapping(locationPriceGroupDto.getAddPriceGroup(), locationPriceGroupMapping,
					locationCode);

		}
			SyncStagingDto data = locationService.savelocationPriceGroupMapping(locationPriceGroupMapping,
					LocationOperationCodes.LOCATION_PRICE_GROUP_MAPPING_UPDATE, locationCode, delLocation);
			syncDataService.publishLocationMessagesToQueue(data);
		return locationPriceGroupDto;
	}

	/**
	 * @param addPriceGroup
	 * @param locationPriceGroupMapping
	 * @param locationCode
	 */
	private void addLocationPriceGrpMapping(Set<PriceGroupMapCreateDto> addPriceGroupMapping,
			List<LocationPriceGroupMappingDaoExt> locationPriceGroupMapping, String locationCode) {
		List<String> priceGroupList = new ArrayList<>();
		List<String> priceGroupTypeList = new ArrayList<>();
		addPriceGroupMapping.forEach(addPriceGroup -> {
			priceGroupList.add(addPriceGroup.getPriceGroup());
			priceGroupTypeList.add(addPriceGroup.getPricingGroupType());
		});
		List<LocationPriceGroupMappingDaoExt> getMapping = locationPriceGroupMappingRepository
				.getLocationPriceGroup(locationCode, priceGroupList, priceGroupTypeList);
		Map<String, LocationPriceGroupMappingDaoExt> locationPriceGroupMappingMap = new HashMap<>();
		for (LocationPriceGroupMappingDaoExt locationPriceGroupMappingDao : getMapping)
			locationPriceGroupMappingMap.put(locationPriceGroupMappingDao.getPriceGroup(),
					locationPriceGroupMappingDao);
		addPriceGroupMapping.forEach(addPriceGroup -> {
			LocationPriceGroupMappingDaoExt locationPriceGroupMappingDao;
			if (!locationPriceGroupMappingMap.isEmpty()
					&& locationPriceGroupMappingMap.containsKey(addPriceGroup.getPriceGroup())
					&& locationPriceGroupMappingMap.get(addPriceGroup.getPriceGroup()).getPricingGroupType()
							.equalsIgnoreCase(addPriceGroup.getPricingGroupType())) {
				locationPriceGroupMappingDao = (LocationPriceGroupMappingDaoExt) MapperUtil.getObjectMapping(
						addPriceGroup, locationPriceGroupMappingMap.get(addPriceGroup.getPriceGroup()));
				locationPriceGroupMappingDao.setSrcSyncId(locationPriceGroupMappingDao.getSrcSyncId() + 1);
			} else {
				locationPriceGroupMappingDao = (LocationPriceGroupMappingDaoExt) MapperUtil
						.getObjectMapping(addPriceGroup, new LocationPriceGroupMappingDaoExt());
				locationPriceGroupMappingDao.setSrcSyncId(0);
				locationPriceGroupMappingDao.setDestSyncId(0);
			}
			LocationDao location = new LocationDao();
			location.setLocationCode(locationCode);
			locationPriceGroupMappingDao.setLocation(location);
			locationPriceGroupMapping.add(locationPriceGroupMappingDao);
		});

	}

	/**
	 * this method is to remove the mapping (making isActive as false)
	 * 
	 * @param removePriceGroup
	 */
	private List<LocationPriceGroupMappingDaoExt> removelocationPriceGrpMapping(Set<String> removePriceGroup) {
		List<String> idsList = new ArrayList<>();
		removePriceGroup.forEach(idsList::add);
		List<LocationPriceGroupMappingDaoExt> delPriceGrpLocDaoList = new ArrayList<>();
		List<LocationPriceGroupMappingDaoExt> priceGrpLocDaoList = locationPriceGroupMappingRepository
				.findAllById(idsList);
		priceGrpLocDaoList.forEach(price -> {
			price.setSrcSyncId(price.getSrcSyncId() + 1);
			delPriceGrpLocDaoList.add(price);
		});
		locationPriceGroupMappingRepository.deleteAll(priceGrpLocDaoList);
		locationPriceGroupMappingRepository.flush();

		return delPriceGrpLocDaoList;
	}

	/**
	 * @param savedLocationPriceGroupMapping
	 * @param operation
	 * @param delLocation
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto savelocationPriceGroupMapping(List<LocationPriceGroupMappingDaoExt> priceGroupMapping,
			String operation, String locationCode, List<LocationPriceGroupMappingDaoExt> delLocation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<LocationPriceGroupMappingDaoExt> savedLocationPriceGroupMapping = new ArrayList<>();
		if (!priceGroupMapping.isEmpty()) {
			savedLocationPriceGroupMapping = locationPriceGroupMappingRepository.saveAll(priceGroupMapping);
		// converting to required json string
		LocationPriceGroupMappingSyncDtoExt syncDtoExt = new LocationPriceGroupMappingSyncDtoExt();
		syncDataList.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(savedLocationPriceGroupMapping), 1));
		}
		if (!delLocation.isEmpty()) {
			LocationPriceGroupMappingSyncDtoExt syncDtoExt = new LocationPriceGroupMappingSyncDtoExt();
			syncDataList.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExtList(delLocation), 0));
		}

		List<String> destinations = new ArrayList<>();
		destinations.add(locationCode);
		MessageRequest locPrcGrpMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
		String locPrcGrpRequestBody = MapperUtil.getJsonString(locPrcGrpMsgRequest);
		SyncStagingDto locPrcGrpSyncStagingDto = new SyncStagingDto();
		locPrcGrpSyncStagingDto.setMessageRequest(locPrcGrpMsgRequest);
		// saving to staging table
		SyncStaging locPrcGrpStagingMsg = new SyncStaging();
		locPrcGrpStagingMsg.setMessage(locPrcGrpRequestBody);
		locPrcGrpStagingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		locPrcGrpStagingMsg = locationSyncStagingRepository.save(locPrcGrpStagingMsg);
		locPrcGrpSyncStagingDto.setId(locPrcGrpStagingMsg.getId());
		return locPrcGrpSyncStagingDto;
	}

	@Override
	public PagedRestResponse<List<LocationHeaderDto>> listLocations(Boolean isActive, String locationType,
			Pageable pageable) {
		LocationDao locationCriteria = new LocationDao();
		locationCriteria.setIsActive(isActive);
		if (!(locationType==null)){
			locationCriteria.setLocationTypeCode(locationType);
		}
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<LocationDao> criteria = Example.of(locationCriteria, matcher);

		Page<LocationDao> locationDaoList = locationRepository.findAll(criteria, pageable);

		List<LocationHeaderDto> locationHeaderDtoList = new ArrayList<>();

		locationDaoList.forEach(location -> {

			LocationHeaderDto locationHeaderDto = (LocationHeaderDto) MapperUtil.getObjectMapping(location,
					new LocationHeaderDto());

			locationHeaderDtoList.add(getLocationDepends(location, locationHeaderDto));
		});
		return (new PagedRestResponse<>(locationHeaderDtoList, locationDaoList));
	}

	/**
	 * This method will add the Location depends to the locationHeaderDto from the
	 * Location and returns locationHeaderDto.
	 * 
	 * @param LocationDao
	 * @param LocationHeaderDto
	 * @return LocationHeaderDto
	 */
	private LocationHeaderDto getLocationDepends(LocationDao locationDao, LocationHeaderDto locationHeaderDto) {

		locationHeaderDto.setStateId(locationDao.getState().getStateId());
		locationHeaderDto.setStateName(locationDao.getState().getDescription());
		locationHeaderDto.setTownId(locationDao.getTown().getTownId());
		locationHeaderDto.setTownName(locationDao.getTown().getDescription());
		if (locationDao.getRegion() != null) {
			locationHeaderDto.setRegionCode(locationDao.getRegion().getRegionCode());
		}
		if (locationDao.getMarket() != null) {
			locationHeaderDto.setMarketCode(locationDao.getMarket().getMarketCode());
		}
		locationHeaderDto.setBrandCode(locationDao.getBrand().getBrandCode());
		return locationHeaderDto;

	}

}
