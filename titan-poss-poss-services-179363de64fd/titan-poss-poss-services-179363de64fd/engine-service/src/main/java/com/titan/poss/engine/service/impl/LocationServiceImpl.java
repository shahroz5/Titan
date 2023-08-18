/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.convert.JodaTimeConverters.DateTimeToDateConverter;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.dto.BankingDetails;
import com.titan.poss.core.dto.BoutiqueMetalRateDto;
import com.titan.poss.core.dto.BoutiqueMetalRateRequestDto;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.CfaDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.dto.CurrencyDto;
import com.titan.poss.core.dto.CustomerDetails;
import com.titan.poss.core.dto.CustomerOrderDetails;
import com.titan.poss.core.dto.DigigoldDetails;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.GepDetails;
import com.titan.poss.core.dto.GhsDetails;
import com.titan.poss.core.dto.GiftCardDetails;
import com.titan.poss.core.dto.GrfDetails;
import com.titan.poss.core.dto.GrnDetails;
import com.titan.poss.core.dto.InventoryDetails;
import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LocationAdvanceBookingDetailsDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCashMemoDetailsDto;
import com.titan.poss.core.dto.LocationCoordinateDto;
import com.titan.poss.core.dto.LocationCreditNoteDetails;
import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.LocationHeaderDto;
import com.titan.poss.core.dto.LocationOtpDetails;
import com.titan.poss.core.dto.LocationPaymentDetails;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.LocationServicesDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.dto.MetalApplicableDto;
import com.titan.poss.core.dto.MetalGoldPriceDto;
import com.titan.poss.core.dto.MetalRateResponseDto;
import com.titan.poss.core.dto.OfferDetails;
import com.titan.poss.core.dto.PayerBankDtoRes;
import com.titan.poss.core.dto.PrintDetails;
import com.titan.poss.core.dto.ServiceDetails;
import com.titan.poss.core.dto.StateLiteDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.dto.TaxDetails;
import com.titan.poss.core.dto.TcsDetails;
import com.titan.poss.core.dto.TepDetailsDto;
import com.titan.poss.core.dto.TownLiteDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.PasswordHashUtil;
import com.titan.poss.engine.dto.CountryLiteDto;
import com.titan.poss.engine.dto.PincodeDto;
import com.titan.poss.engine.location.repository.BrandRepositoryExt;
import com.titan.poss.engine.location.repository.CountryRepositoryExt;
import com.titan.poss.engine.location.repository.LocationRepositoryExt;
import com.titan.poss.engine.location.repository.LovRepositoryExt;
import com.titan.poss.engine.location.repository.MarketRepositoryExt;
import com.titan.poss.engine.location.repository.MetalPriceConfigRepositoryExt;
import com.titan.poss.engine.location.repository.MetalPriceLocationMappingRepositoryExt;
import com.titan.poss.engine.location.repository.PincodeRepositoryExt;
import com.titan.poss.engine.location.repository.StateRepositoryExt;
import com.titan.poss.engine.location.repository.StateTaxMappingRepositoryExt;
import com.titan.poss.engine.location.repository.TownRepositoryExt;
import com.titan.poss.engine.sales.repository.BusinessDayRepositoryExt;
import com.titan.poss.engine.service.LocationService;
import com.titan.poss.location.dao.BrandDao;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.LocationLovDao;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MetalPriceConfigDao;
import com.titan.poss.location.dao.MetalPriceLocationMappingDao;
import com.titan.poss.location.dao.PincodeDao;
import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dao.StateTaxMappingDao;
import com.titan.poss.location.dao.TownDao;
import com.titan.poss.location.dto.constants.LocationTypeEnum;
import com.titan.poss.sales.constants.DayActivityStatusEnum;
import com.titan.poss.sales.dao.BusinessDayDao;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("engineLocationService")
public class LocationServiceImpl implements LocationService {

	private static final String ERR_LOC_001 = "ERR-LOC-001";
	private static final String NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE = "No Location details found for the requested locationCode";

	private static final String ERR_PRO_001 = "ERR-PRO-001";
	private static final String NO_BRAND_DETAILS_FOUND_FOR_THE_REQUESTED_BRANDCODE = "No Brand details found for the requested brandCode";

	@Autowired
	private CountryRepositoryExt countryRepository;

	@Autowired
	private StateRepositoryExt stateRepository;

	@Autowired
	private TownRepositoryExt townRepository;

	@Autowired
	private PincodeRepositoryExt pincodeRepository;

	@Autowired
	private LocationRepositoryExt locationRepository;

	@Autowired
	private MetalPriceConfigRepositoryExt metalPriceConfigRepository;

	@Autowired
	private MarketRepositoryExt marketRepository;

	@Autowired
	private MetalPriceLocationMappingRepositoryExt metalPriceLocationMappingRepository;

	@Autowired
	private BrandRepositoryExt brandRepository;

	@Autowired
	private LovRepositoryExt lovRepo;

	@Autowired
	private StateTaxMappingRepositoryExt stateTaxRepo;

	@Value("${app.name}")
	private String appType;

	@Autowired
	private BusinessDayRepositoryExt businessDayRepository;

	@Override
	public PagedRestResponse<List<CountryLiteDto>> listCountryLite(Boolean isPageable, String description,
			Pageable pageable) {
		if (!isPageable) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		Page<CountryDao> countryList = getCountryData(pageable, description);
		return listCountryLiteData(countryList);
	}

	private PagedRestResponse<List<CountryLiteDto>> listCountryLiteData(Page<CountryDao> countryList) {
		List<CountryLiteDto> countries = new ArrayList<>();
		countryList.forEach(
				country -> countries.add((CountryLiteDto) MapperUtil.getObjectMapping(country, new CountryLiteDto())));
		return (new PagedRestResponse<>(countries, countryList));
	}

	private Page<CountryDao> getCountryData(Pageable pageable, String description) {
		CountryDao countryCriteria = new CountryDao();
		countryCriteria.setIsActive(true);
		countryCriteria.setDescription(description);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CountryDao> criteria = Example.of(countryCriteria, matcher);
		return countryRepository.findAll(criteria, pageable);
	}

	/**
	 * This method will return the list of State details based on the countryCode
	 * and isPageable.
	 * 
	 * @param countryCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<StateLiteDto>>
	 */
	@Override
	public PagedRestResponse<List<StateLiteDto>> listStateLite(String countryCode, Boolean isPageable,
			Pageable pageable) {
		if (!isPageable) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		return new PagedRestResponse<>(stateRepository.getStateDetails(countryCode, pageable));
	}

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
	@Override
	public PagedRestResponse<List<PincodeDto>> listPincodeLite(String countryCode, String pincode, Boolean isPageable,
			Pageable pageable) {
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		Page<PincodeDao> pincodeList = getPinCodeData(countryCode, pincode, true, pageable);
		return listPincodeLite(pincodeList);
	}

	private PagedRestResponse<List<PincodeDto>> listPincodeLite(Page<PincodeDao> pincodeList) {
		List<PincodeDto> pincodeDtoList = new ArrayList<>();
		for (PincodeDao pincodeDao : pincodeList) {
			PincodeDto pincodeDto = (PincodeDto) MapperUtil.getObjectMapping(pincodeDao, new PincodeDto());
			getPincodeDto(pincodeDao, pincodeDto);
			pincodeDtoList.add(pincodeDto);
		}
		return (new PagedRestResponse<>(pincodeDtoList, pincodeList));
	}

	private Page<PincodeDao> getPinCodeData(String countryCode, String pincode, Boolean isActive, Pageable pageable) {
		PincodeDao pincodeDao = new PincodeDao();
		CountryDao country = new CountryDao();
		country.setCountryCode(countryCode);
		pincodeDao.setCountry(country);
		pincodeDao.setPinCode(pincode);
		pincodeDao.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PincodeDao> criteria = Example.of(pincodeDao, matcher);
		return pincodeRepository.findAll(criteria, pageable);

	}

	private PincodeDto getPincodeDto(PincodeDao pincode1, PincodeDto pincodeDto) {
		if (pincode1.getCountry().getCountryCode() == null) {
			throw new ServiceException("Country code cannot be null", "ERR-LOC-023");
		}
		pincodeDto.setCountryCode(pincode1.getCountry().getCountryCode());
		return pincodeDto;
	}

	@Override
	@Transactional
	public LocationResponseDto listLocationByLocationCode(String locationCode) {
		Boolean isActive = Boolean.TRUE;
		LocationDao location = locationRepository.findOneByLocationCodeAndIsActive(locationCode, isActive);
		if (location == null) {
			throw new ServiceException(NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE, ERR_LOC_001);
		}
		LocationHeaderDto factoryDetails = new LocationHeaderDto();
		LocationHeaderDto cfaDetails = new LocationHeaderDto();
		
		if (location.getFactoryCode() != null) {
			factoryDetails = locationRepository
					.findByLocationCodeAndIsActive(location.getFactoryCode().getLocationCode(), isActive);
		}
		if (location.getCfaCode() != null) {
			cfaDetails = locationRepository.findByLocationCodeAndIsActive(location.getCfaCode().getLocationCode(),
					isActive);
			
		}

		return getLocationDtoMapping(location, factoryDetails, cfaDetails);
	}

	@Override
	public List<CfaDto> getlistOfCfa() {
		Boolean isActive = Boolean.TRUE;
		List<CfaDto> cfaDetails = locationRepository
				.findAllByLocationTypeCodeAndIsActive(LocationTypeEnum.CFA.toString(), isActive);

		/*
		 * return getCfaDtoMapping(cfaDetails); }
		 * 
		 * private List<CfaDto> getCfaDtoMapping(List<CfaDto> cfaDetails) { List<CfaDto>
		 * result = new ArrayList<>(); for (CfaDto dto : cfaDetails) { if
		 * (dto.getCfaAddress() != null) { Object obj =
		 * MapperUtil.getJsonFromString(dto.getCfaAddress().toString());
		 * dto.setCfaAddress(obj); } result.add(dto); } return result;
		 */

		return cfaDetails;
	}

	private LocationResponseDto getLocationDtoMapping(LocationDao location, LocationHeaderDto factoryDetails,
			LocationHeaderDto cfaDetails) {
		LocationResponseDto locationDto = new LocationResponseDto();
		locationDto = (LocationResponseDto) MapperUtil.getObjectMapping(location, locationDto);
		setLocationDto(location, locationDto);
		locationDto.setSubBrandCode(location.getSubBrand().getBrandCode());
		locationDto.setCfaDetails(cfaDetails);
		locationDto.setFactoryDetails(factoryDetails);
		return locationDto;
	}

	private void setLocationDto(LocationDao location, LocationResponseDto locationDto) {
		if ((location.getFactoryCode()) != null
				&& (!StringUtils.isEmpty(location.getFactoryCode().getLocationCode()))) {
			locationDto.setFactoryCodeValue(location.getLocationCode());
		}

		if ((location.getCfaCode()) != null && (!StringUtils.isEmpty(location.getCfaCode().getLocationCode()))) {
			locationDto.setCfaCodeValue(location.getLocationCode());
		}

		if (location.getRegion() != null)
			locationDto.setRegionCode(location.getRegion().getRegionCode());

		if (location.getTown() != null)
			locationDto.setTownId(location.getTown().getTownId());

		if (location.getMarket() != null)
			locationDto.setMarketCode(location.getMarket().getMarketCode());

		if (location.getSubRegion() != null)
			locationDto.setSubRegionCode(location.getSubRegion().getRegionCode());

		if (location.getState() != null)
			locationDto.setStateId(location.getState().getStateId());

		if (location.getCountry() != null) {
			CountryDto countryDto = (CountryDto) MapperUtil.getObjectMapping(location.getCountry(), new CountryDto());
			locationDto.setCountry(countryDto);

		}

		if (location.getBaseCurrency() != null) {
			CurrencyDto currencyDto = (CurrencyDto) MapperUtil.getObjectMapping(location.getBaseCurrency(),
					new CurrencyDto());
			locationDto.setBaseCurrency(currencyDto);

		}

		if (location.getMasterCurrency() != null)
			locationDto.setMasterCurrency(location.getMasterCurrency().getCurrencyCode());

		if (location.getStockCurrency() != null)
			locationDto.setStockCurrency(location.getStockCurrency().getCurrencyCode());

		setJsonResponse(location, locationDto);
	}

	private void setJsonResponse(LocationDao locationDao, LocationResponseDto locationDto) {

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
	private void setResponseOfRemainingJsonFields(LocationDao locationDao, LocationResponseDto locationDto) {
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
		if(locationDao.getCfaCode()!=null) {
			if(locationDao.getCfaCode().getStoreDetails()!=null) {
				Object obj = MapperUtil.getJsonFromString(locationDao.getCfaCode().getStoreDetails());
				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				locationDto.setCfaStoreDetails(jsonData);
			}
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
		if (locationDao.getServiceDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(locationDao.getServiceDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			locationDto.setServiceDetails(jsonData);
		}

	}

	@Override
	@Cacheable(key = "#locationCode", value = "locationPrintCache")
	@Transactional(readOnly = true)
	public StorePrintDetailsDto getStorePrintInformation(String locationCode) {

		LocationDao location = locationRepository.findOneByLocationCode(locationCode);

		if (location == null) {
			throw new ServiceException(NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE, ERR_LOC_001);
		}

		JsonData storeData = MapperUtil.mapObjToClass(location.getStoreDetails(), JsonData.class);
		StoreDetails storeDetails = (MapperUtil.mapObjToClass(storeData.getData(), StoreDetails.class));

		StorePrintDetailsDto storePrintInfo = (StorePrintDetailsDto) MapperUtil.getDtoMapping(storeDetails,
				StorePrintDetailsDto.class);

		StateDao state = location.getState();
		if (state != null) {
			StateTaxMappingDao stateTaxMap = stateTaxRepo.findByStateAndIsActiveTrue(state);
			if (stateTaxMap != null)
				storePrintInfo.setStateTaxCode(stateTaxMap.getStateTaxCode().toString());
		}

		JsonData taxData = MapperUtil.mapObjToClass(location.getTaxDetails(), JsonData.class);
		TaxDetails tax = MapperUtil.mapObjToClass(taxData.getData(), TaxDetails.class);

		storePrintInfo.setGstId(tax.getGstRegisterationNo());
		storePrintInfo.setBrandCode(location.getBrand().getBrandCode());
		storePrintInfo.setTownName(location.getTown().getDescription());
		storePrintInfo.setDescription(location.getDescription());
		storePrintInfo.setRegionCode(location.getRegion().getRegionCode());
		return storePrintInfo;
	}

	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return StoreLocationDto
	 */
	@Override
	@Cacheable(key = "#locationCode", value = "locationCache")
	@Transactional(readOnly = true)
	public LocationCacheDto getStoreLocation(String locationCode) {
		LocationDao location = locationRepository.findOneByLocationCode(locationCode);

		if (location == null) {
			throw new ServiceException(NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE, ERR_LOC_001);
		}

		String brandCode = location.getBrand().getBrandCode();

		LocationCacheDto locationCacheDto = (LocationCacheDto) MapperUtil.getObjectMapping(location,
				new LocationCacheDto());
		if (location.getBaseCurrency() != null)
			locationCacheDto.setBaseCurrency(location.getBaseCurrency().getCurrencyCode());
		if (location.getMasterCurrency() != null)
			locationCacheDto.setMasterCurrency(location.getMasterCurrency().getCurrencyCode());
		if (location.getStockCurrency() != null)
			locationCacheDto.setStockCurrency(location.getStockCurrency().getCurrencyCode());
		if (location.getSubBrand() != null)
			locationCacheDto.setSubBrandCode(location.getSubBrand().getBrandCode());

		if (location.getCountry() != null) {
			locationCacheDto.setCountryCode(location.getCountry().getCountryCode());
		}

		locationCacheDto.setBrandCode(brandCode);
		locationCacheDto.setTownName(location.getTown().getDescription());

		mapJsonDataToResponse(location, locationCacheDto);

		return getStoreLocationDepends(location, locationCacheDto);
	}

	private void mapJsonDataToResponse(LocationDao location, LocationCacheDto storeLocationDto) {

		JsonData storeData = MapperUtil.mapObjToClass(location.getStoreDetails(), JsonData.class);
		if (storeData != null)
			storeLocationDto.setStoreDetails(MapperUtil.mapObjToClass(storeData.getData(), StoreDetails.class));

		JsonData printData = MapperUtil.mapObjToClass(location.getPrintDetails(), JsonData.class);
		if (printData != null)
			storeLocationDto.setPrintDetails(MapperUtil.mapObjToClass(printData.getData(), PrintDetails.class));

		JsonData cnData = MapperUtil.mapObjToClass(location.getCnDetails(), JsonData.class);
		if (cnData != null)
			storeLocationDto.setCnDetails(MapperUtil.mapObjToClass(cnData.getData(), LocationCreditNoteDetails.class));

		JsonData taxData = MapperUtil.mapObjToClass(location.getTaxDetails(), JsonData.class);
		if (taxData != null)
			storeLocationDto.setTaxDetails(MapperUtil.mapObjToClass(taxData.getData(), TaxDetails.class));

		JsonData cmData = MapperUtil.mapObjToClass(location.getCmDetails(), JsonData.class);
		if (cmData != null)
			storeLocationDto.setCmDetails(MapperUtil.mapObjToClass(cmData.getData(), LocationCashMemoDetailsDto.class));

		JsonData abData = MapperUtil.mapObjToClass(location.getAbDetails(), JsonData.class);
		if (abData != null)
			storeLocationDto
					.setAbDetails(MapperUtil.mapObjToClass(abData.getData(), LocationAdvanceBookingDetailsDto.class));

		JsonData bankingData = MapperUtil.mapObjToClass(location.getBankingDetails(), JsonData.class);
		if (bankingData != null)
			storeLocationDto.setBankingDetails(MapperUtil.mapObjToClass(bankingData.getData(), BankingDetails.class));

		JsonData custOrderData = MapperUtil.mapObjToClass(location.getCoDetails(), JsonData.class);
		if (custOrderData != null)
			storeLocationDto
					.setOrderDetails(MapperUtil.mapObjToClass(custOrderData.getData(), CustomerOrderDetails.class));

		JsonData customerData = MapperUtil.mapObjToClass(location.getCustomerDetails(), JsonData.class);
		if (customerData != null)
			storeLocationDto
					.setCustomerDetails(MapperUtil.mapObjToClass(customerData.getData(), CustomerDetails.class));

		JsonData giftCardData = MapperUtil.mapObjToClass(location.getGcDetails(), JsonData.class);
		if (giftCardData != null)
			storeLocationDto
					.setGiftCardDetails(MapperUtil.mapObjToClass(giftCardData.getData(), GiftCardDetails.class));

		JsonData gepData = MapperUtil.mapObjToClass(location.getGepDetails(), JsonData.class);
		if (gepData != null)
			storeLocationDto.setGepDetails(MapperUtil.mapObjToClass(gepData.getData(), GepDetails.class));

		JsonData ghsData = MapperUtil.mapObjToClass(location.getGhsDetails(), JsonData.class);
		if (ghsData != null)
			storeLocationDto.setGhsDetails(MapperUtil.mapObjToClass(ghsData.getData(), GhsDetails.class));

		JsonData grfData = MapperUtil.mapObjToClass(location.getGrfDetails(), JsonData.class);
		if (grfData != null)
			storeLocationDto.setGrfDetails(MapperUtil.mapObjToClass(grfData.getData(), GrfDetails.class));

		JsonData grnData = MapperUtil.mapObjToClass(location.getGrnDetails(), JsonData.class);
		if (grnData != null)
			storeLocationDto.setGrnDetails(MapperUtil.mapObjToClass(grnData.getData(), GrnDetails.class));

		JsonData tepData = MapperUtil.mapObjToClass(location.getTepDetails(), JsonData.class);
		if (tepData != null)
			storeLocationDto.setTepDetails(MapperUtil.mapObjToClass(tepData.getData(), TepDetailsDto.class));

		JsonData inventoryData = MapperUtil.mapObjToClass(location.getInventoryDetails(), JsonData.class);
		if (inventoryData != null)
			storeLocationDto
					.setInventoryDetails(MapperUtil.mapObjToClass(inventoryData.getData(), InventoryDetails.class));

		JsonData offerData = MapperUtil.mapObjToClass(location.getOfferDetails(), JsonData.class);
		if (offerData != null)
			storeLocationDto.setOfferDetails(MapperUtil.mapObjToClass(offerData.getData(), OfferDetails.class));

		JsonData otpData = MapperUtil.mapObjToClass(location.getOtpDetails(), JsonData.class);
		if (otpData != null)
			storeLocationDto.setOtpDetails(MapperUtil.mapObjToClass(otpData.getData(), LocationOtpDetails.class));

		JsonData paymentData = MapperUtil.mapObjToClass(location.getPaymentDetails(), JsonData.class);
		if (paymentData != null)
			storeLocationDto
					.setPaymentDetails(MapperUtil.mapObjToClass(paymentData.getData(), LocationPaymentDetails.class));

		JsonData digigoldData = MapperUtil.mapObjToClass(location.getDigigoldDetails(), JsonData.class);
		if (digigoldData != null)
			storeLocationDto
					.setDigigoldDetails(MapperUtil.mapObjToClass(digigoldData.getData(), DigigoldDetails.class));
		
		JsonData serviceData = MapperUtil.mapObjToClass(location.getServiceDetails(), JsonData.class);
		if (serviceData != null)
			storeLocationDto.setServiceDetails(MapperUtil.mapObjToClass(serviceData.getData(), ServiceDetails.class));

		// JsonData tcsData = MapperUtil.mapObjToClass(location.getTcsDetails(),
		// JsonData.class);
		if (location.getTcsDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(location.getTcsDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			storeLocationDto.setTcsDetails(MapperUtil.mapObjToClass(jsonData.getData(), TcsDetails.class));
		}
		/*
		 * if (tcsData != null) storeLocationDto
		 * .setTcsDetails(MapperUtil.mapObjToClass(tcsData.getData(),
		 * TcsDetails.class));
		 */
	}

	/**
	 * This method will add the Location depends to the StoreLocationDto from the
	 * Location and returns StoreLocationDto.
	 * 
	 * @param location
	 * @param storeLocationDto
	 * @return StoreLocationDto
	 */
	private LocationCacheDto getStoreLocationDepends(LocationDao location, LocationCacheDto storeLocationDto) {

		try {
			storeLocationDto.setRegionCode(location.getRegion().getRegionCode());
		} catch (NullPointerException e) {
			storeLocationDto.setRegionCode("");
		}

		try {
			storeLocationDto.setStateCode(location.getState().getStateCode());
		} catch (NullPointerException e) {
			storeLocationDto.setStateCode(null);
		}

		return storeLocationDto;
	}

	@Override
	@Transactional
	public MetalRateResponseDto saveMetalRates(BoutiqueMetalRateRequestDto boutiqueMetalRateRequestDto) {
		// validate the password(UI) and generated password
		validatePassword(boutiqueMetalRateRequestDto);
		// location check: locationType must be 'BTQ'
		LocationDao locDao = getLocationDetails();
		String currencyCode = getCountryDetails(locDao.getLocationCode()).getCurrencyCode();
		String marketCode = locDao.getMarket().getMarketCode();
		MarketDao market = marketRepository.findByMarketCodeAndIsActive(marketCode, true);
		if (market == null) {
			throw new ServiceException("No Market details found for the requested marketCode : " + marketCode,
					"ERR-LOC-017");
		}
		boutiqueMetalRateRequestDto.getMetalRates().entrySet().stream().forEach(metalRates -> {
			MetalPriceConfigDao metalPriceConfigDao = saveMetalPriceConfig(boutiqueMetalRateRequestDto, metalRates,
					currencyCode);
			saveMetalPriceLocationMapping(boutiqueMetalRateRequestDto, market, metalRates, metalPriceConfigDao,
					currencyCode);
		});
		return (MetalRateResponseDto) MapperUtil.getDtoMapping(boutiqueMetalRateRequestDto, MetalRateResponseDto.class);
	}

	private void saveMetalPriceLocationMapping(BoutiqueMetalRateRequestDto boutiqueMetalRateRequestDto,
			MarketDao market, Map.Entry<String, BoutiqueMetalRateDto> metalRates,
			MetalPriceConfigDao metalPriceConfigDao, String currencyCode) {
		MetalPriceLocationMappingDao metalPriceLocationMappingDao = metalPriceLocationMappingRepository
				.findOneByLocationCodeAndMetalTypeCodeAndApplicableDate(CommonUtil.getLocationCode(),
						metalRates.getValue().getMetalTypeCode(), boutiqueMetalRateRequestDto.getApplicableDate());
		if (metalPriceLocationMappingDao == null) {
			metalPriceLocationMappingDao = new MetalPriceLocationMappingDao();
			metalPriceLocationMappingDao.setId(UUID.randomUUID().toString());
			metalPriceLocationMappingDao.setMarket(market);
			metalPriceLocationMappingDao.setLocation(getLocationDetails());
			metalPriceLocationMappingDao.setApplicableDate(boutiqueMetalRateRequestDto.getApplicableDate());
			metalPriceLocationMappingDao.setMetalTypeCode(metalRates.getKey());
			metalPriceLocationMappingDao.setCurrencyCode(currencyCode);
		}

		metalPriceLocationMappingDao.setMetalPriceConfig(metalPriceConfigDao);
		metalPriceLocationMappingDao.setMetalRate(metalRates.getValue().getRatePerUnit());
		metalPriceLocationMappingDao.setSyncTime(new Date().getTime());

		metalPriceLocationMappingRepository.save(metalPriceLocationMappingDao);
	}

	private MetalPriceConfigDao saveMetalPriceConfig(BoutiqueMetalRateRequestDto boutiqueMetalRateRequestDto,
			Map.Entry<String, BoutiqueMetalRateDto> metalRates, String currencyCode) {
		MetalPriceConfigDao metalPriceConfigDao = new MetalPriceConfigDao();
		List<MetalPriceConfigDao> metalPriceConfigDaoList = metalPriceConfigRepository
				.findByMetalTypeCodeAndApplicableDate(metalRates.getValue().getMetalTypeCode(),
						boutiqueMetalRateRequestDto.getApplicableDate());
		metalPriceConfigDao.setId(UUID.randomUUID().toString());
		if (CollectionUtils.isEmpty(metalPriceConfigDaoList)) {
			metalPriceConfigDao.setPriceType("D");
		} else {
			metalPriceConfigDao.setPriceType("F");
		}
		metalPriceConfigDao.setApplicableDate(boutiqueMetalRateRequestDto.getApplicableDate());
		metalPriceConfigDao.setRemarks("Metal rate updated via offline password process");
		metalPriceConfigDao.setBasePrice(metalRates.getValue().getRatePerUnit());
		metalPriceConfigDao.setCurrencyCode(currencyCode);
		metalPriceConfigDao.setMetalTypeCode(metalRates.getKey());
		metalPriceConfigRepository.save(metalPriceConfigDao);
		return metalPriceConfigDao;
	}

	private LocationDao getLocationDetails() {
		LocationDao locDao = locationRepository
				.findOneByLocationCodeAndLocationTypeCodeAndIsActiveTrue(CommonUtil.getLocationCode(), "BTQ");
		if (locDao == null) {
			throw new ServiceException(
					"No Location details found for the requested locationCode : " + CommonUtil.getLocationCode(),
					ERR_LOC_001);
		}
		return locDao;
	}

	private void validatePassword(BoutiqueMetalRateRequestDto boutiqueMetalRateRequestDto) {
		String password = PasswordHashUtil.getPasswordForMetalRate(boutiqueMetalRateRequestDto.getMetalRates(),
				CommonUtil.getLocationCode(), boutiqueMetalRateRequestDto.getApplicableDate());
		if (!password.equals(boutiqueMetalRateRequestDto.getPassword())) {
			throw new ServiceException("Invalid password or invalid data", "ERR-LOC-040");
		}
	}

	/**
	 * This method will return the Country details.
	 */
	@Override
	public CountryDetailsDto getCountryDetails(String locationCode) {

		CountryDetailsDto countryDetails = new CountryDetailsDto();

		if (CommonUtil.isAStoreUser() && locationCode == null) {
			locationCode = CommonUtil.getLocationCode();
		}

		CountryDao countryDao = countryRepository.getCountryDetails(locationCode);

		// if FiscalYearStart matches current system date month, then calculate
		// fiscalYear(pick year from system date)
		// compare existing fiscalYear and calculated fiscalYear, if different then
		// update DB.

		if (countryDao.getFiscalYearStart() != null
				&& countryDao.getFiscalYearStart().equalsIgnoreCase(CalendarUtils.getCurrentDayFiscalYearMonth())) {
			Integer currentFiscalYear = CalendarUtils.getCurrentYear();
			if (!currentFiscalYear.equals(countryDao.getFiscalYear())) {
				countryDao.setFiscalYear(currentFiscalYear);
				countryRepository.save(countryDao);
			}
		}
		// status open and closed and take year of business date.
		if (CommonUtil.isAStoreUser()) {
			BusinessDayDao businessDayDao = businessDayRepository.getFiscalYearForBusinessDay(locationCode,
					DayActivityStatusEnum.CLOSED.name());
			if (businessDayDao != null) {
				getFiscalYear(businessDayDao, countryDao, countryDetails);
			} else {
				countryDetails.setFiscalYear(countryDao.getFiscalYear());
			}
		} else {
			countryDetails.setFiscalYear(countryDao.getFiscalYear());
		}
		countryDetails.setCurrencyCode(countryDao.getCurrency().getCurrencyCode());
		countryDetails.setWeightUnit(countryDao.getWeightUnit());
		countryDetails.setStoneWeightUnit(countryDao.getStoneWeightUnit());
		countryDetails.setFiscalYearStart(countryDao.getFiscalYearStart());

		return countryDetails;
	}

	private void getFiscalYear(BusinessDayDao businessDayDao, CountryDao countryDao, CountryDetailsDto countryDetails) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(businessDayDao.getBusinessDate());
		Integer currentBusinessDay = cal.get(Calendar.DAY_OF_MONTH);
		LocalDate localDate = LocalDate.parse(businessDayDao.getBusinessDate().toString(),
				DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		cal.setTime(Date.from(localDate.withDayOfMonth(localDate.getMonth().length(localDate.isLeapYear()))
				.atStartOfDay(ZoneId.systemDefault()).toInstant()));
		Integer maximumDayOfMonth = cal.get(Calendar.DAY_OF_MONTH);
		cal.add(Calendar.MONTH, 1);
		String fiscalYearStartMonth = countryDao.getFiscalYearStart();
		String fiscalYearToCompareMonth = new SimpleDateFormat("MMM").format(cal.getTime()).toUpperCase();
		if (fiscalYearStartMonth.equalsIgnoreCase(fiscalYearToCompareMonth) && maximumDayOfMonth == currentBusinessDay)
			countryDetails.setFiscalYear(countryDao.getFiscalYear());
		else
			countryDetails.setFiscalYear(businessDayDao.getFiscalYear());
	}

	@Override
	@Cacheable(key = "#marketCode", value = "marketCache")
	public MarketDto getMarketDetails(String marketCode) {
		MarketDao market = marketRepository.findOneByMarketCode(marketCode);
		if (market == null) {
			throw new ServiceException("No Market details found for the requested marketCode : " + marketCode,
					"ERR-LOC-017");
		}
		return (MarketDto) MapperUtil.getObjectMapping(market, new MarketDto());
	}

	@Override
	public BrandDto getBrandDetails(String brandCode) {

		if (CommonUtil.isAStoreUser()) {
			brandCode = CommonUtil.getAuthUser().getBrandCode();
		} else if (org.springframework.util.StringUtils.isEmpty(brandCode)) {
			throw new ServiceException("Invalid request data", "ERR-CORE-034", "Please provide brand code.");
		}

		BrandDao brandCriteria = new BrandDao();
		brandCriteria.setBrandCode(brandCode);

		ExampleMatcher brandMatcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<BrandDao> brandExample = Example.of(brandCriteria, brandMatcher);

		Optional<BrandDao> brandOpt = brandRepository.findOne(brandExample);

		if (!brandOpt.isPresent()) {
			throw new ServiceException(NO_BRAND_DETAILS_FOUND_FOR_THE_REQUESTED_BRANDCODE, ERR_PRO_001);
		}

		BrandDto brandDto = (BrandDto) MapperUtil.getObjectMapping(brandOpt.get(), new BrandDto());
		return getBrandDependsAndJsons(brandOpt.get(), brandDto);

	}

	/**
	 * This method will add the Brand depends and jsons to the BrandDto from Brand
	 * DAO and returns BrandDto.
	 * 
	 * @param brand
	 * @param brandDto
	 * @return BrandDto
	 */
	private BrandDto getBrandDependsAndJsons(BrandDao brand, BrandDto brandDto) {

		if (brand.getParentBrand() != null) {
			brandDto.setParentBrandCode(brand.getParentBrand().getBrandCode());
		}

		if (brand.getOrganization() != null) {
			brandDto.setOrgCode(brand.getOrganization().getOrgCode());
		}

		// get CM details
		brandDto.setCmDetails(MapperUtil.mapObjToClass(brand.getCmDetails(), JsonData.class));

		// get config details
		brandDto.setConfigDetails(MapperUtil.mapObjToClass(brand.getConfigDetails(), JsonData.class));

		// get customer details
		brandDto.setCustomerDetails(MapperUtil.mapObjToClass(brand.getCustomerDetails(), JsonData.class));

		// get tax details
		brandDto.setTaxDetails(MapperUtil.mapObjToClass(brand.getTaxDetails(), JsonData.class));

		// get pancard details
		brandDto.setPanCardDetails(MapperUtil.mapObjToClass(brand.getPanCardDetails(), JsonData.class));

		// get tcs details
		brandDto.setBrandTcsDetails(MapperUtil.mapObjToClass(brand.getBrandTcsDetails(), JsonData.class));

		return brandDto;

	}

	@Override
	public List<String> getAppBasedLocations() {
		if (appType.equalsIgnoreCase("EPOSS")) {
			return locationRepository.getEpossLocations();
		} else {
			return locationRepository.getPossLocations();
		}
	}

	@Override
	public LovDto getLocationLov(String lovType) {
		List<LocationLovDao> locationLovList = lovRepo.findByLovType(lovType);

		LovDto lovDto = new LovDto();

		lovDto.setLovType(lovType);

		if (!locationLovList.isEmpty()) {

			List<KeyValueDto> keyValueDtoList = new ArrayList<>();

			locationLovList.forEach(locationLov -> keyValueDtoList
					.add((KeyValueDto) MapperUtil.getObjectMapping(locationLov, new KeyValueDto())));

			lovDto.setResults(keyValueDtoList);

		} else {

			lovDto.setResults(new ArrayList<KeyValueDto>());
		}
		return lovDto;
	}

	@Override
	public PagedRestResponse<List<LocationDropDownDto>> listLocationsDropDown(LocationFilterDto locationFilter,
			Pageable pageable) {
		validateLocationFilter(locationFilter);
		List<LocationDropDownDto> locationDropDownDto = new ArrayList<>();
		Page<LocationHeaderDto> locationList = null;
		if (locationFilter == null) {
			locationList = locationRepository.findByIsActiveTrue(pageable);

		} else {
			if (BooleanUtils.isTrue(locationFilter.getIsLocationFromTep())) {
				locationList = locationRepository.findAllByIsActiveWithFiltersTep(locationFilter.getBrandCodes(),
						locationFilter.getRegionCodes(), locationFilter.getOwnerTypeCodes(),
						locationFilter.getStateCodes(), locationFilter.getTownCodes(), locationFilter.getCountryCodes(),
						locationFilter.getLocationTypes(), locationFilter.getFactoryCodes(),
						locationFilter.getCfaCodes(), locationFilter.getMarketCodes(),
						locationFilter.getLocationFormats(), pageable);

			} else {
				locationList = locationRepository.findAllByIsActiveWithFilters(locationFilter.getBrandCodes(),
						locationFilter.getRegionCodes(), locationFilter.getOwnerTypeCodes(),
						locationFilter.getStateCodes(), locationFilter.getTownCodes(), locationFilter.getCountryCodes(),
						locationFilter.getLocationTypes(), locationFilter.getFactoryCodes(),
						locationFilter.getCfaCodes(), locationFilter.getMarketCodes(),
						locationFilter.getLocationFormats(), true, pageable);
			}

		}
		locationList.forEach(record -> locationDropDownDto
				.add((LocationDropDownDto) MapperUtil.getDtoMapping(record, LocationDropDownDto.class)));
		return new PagedRestResponse<>(locationDropDownDto, locationList);
	}

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
		return locationFilter;
	}

	@Override
	public CountryDto getCountry(String countryCode) {
		CountryDao country = countryRepository.findOneByCountryCode(countryCode);
		if (country == null) {
			throw new ServiceException("No Country details found for the requested countryCode", "ERR-LOC-002");
		}
		CountryDto countryDto = (CountryDto) MapperUtil.getObjectMapping(country, new CountryDto());
		return getCountryDepends(country, countryDto);
	}

	private CountryDto getCountryDepends(CountryDao country, CountryDto countryDto) {
		countryDto.setCurrencyCode(country.getCurrency().getCurrencyCode());
		return countryDto;
	}

	@Override
	public TownLiteDto getStateAndTownDetails(String stateId, String townId) {
		TownLiteDto townDto = new TownLiteDto();
		if (!StringUtils.isEmpty(stateId)) {
			Optional<StateDao> state = stateRepository.findById(stateId);
			state.ifPresent(st -> townDto.setStateName(st.getDescription()));
		}
		if (!StringUtils.isEmpty(townId)) {
			Optional<TownDao> town = townRepository.findById(townId);
			town.ifPresent(tn -> townDto.setTownName(tn.getDescription()));
		}
		return townDto;
	}

	public List<LocationCoordinateDto> getAllByLocationIfIsActive() {
		return locationRepository.getAllByLocationIfIsActive();

	}

	@Override
	public List<MetalGoldPriceDto> getMarketMetalDetails(String locationCode,MetalApplicableDto metalApplicableDto){
		String date = CalendarUtils.formatDateToSql(metalApplicableDto.getApplicableDate());
		
		Date date2 = CalendarUtils.formatDetfaultToDateStr(date);	
		List<Object[]> objectList = metalPriceLocationMappingRepository
				.getMetalRates(locationCode,date2);
		List<MetalGoldPriceDto> metalprice =  new ArrayList<MetalGoldPriceDto>();
		for (Object[] obj : objectList) { 
			MetalGoldPriceDto metal = new MetalGoldPriceDto();			
			metal.setLocationCode((String) obj[0]);
			metal.setMetalTypeCode((String) obj[1]);
			metal.setCorporatePrice((BigDecimal) obj[2]);
			metal.setApplicableDate(((Date) obj[3]).getTime());
			metal.setGoldPriceType((String) obj[4]);
			metal.setLoginId((String) obj[5]);
			metal.setCreatedDate(((Date) obj[6]).getTime());
			metal.setLastModifiedId((String) obj[7]);
			metal.setLastModifiedDate(((Date) obj[8]).getTime());
			metalprice.add(metal);
		}
		return metalprice;
	}

	@Override
	public List<LocationServicesDto> getLocationDetails(String locationCode) {
		List<Object[]> objectList = locationRepository.getLocationLists(locationCode);
		List<LocationServicesDto> locationdetailsList = new ArrayList<LocationServicesDto>();
		for (Object[] obj : objectList) { 
			LocationServicesDto location = new LocationServicesDto();
			location.setLocationCode((String) obj[0]);		
			location.setDescription((String) obj[1]);
			location.setLocationTypeCode((String) obj[2]);
			location.setMarketCode((String) obj[3]);		
			location.setMarketDescription((String) obj[4]);
			location.setCountryCode((String) obj[5]);		
			location.setCountryDescription((String) obj[6]);
			location.setRegionCode((String) obj[7]);	
			location.setSubRegionCode((String) obj[8]);
			location.setTownId((String) obj[9]);
			location.setTownDescription((String) obj[10]);
			location.setStateId((String) obj[11]);
			location.setStateDescription((String) obj[12]);
			location.setStateCode((String) obj[13]);
			location.setStateconfigDetails((String) obj[14]);
			location.setOwnerTypeCode((String) obj[15]);
			location.setFactoryCodeValue((String) obj[16]);
			location.setCfaCodeValue((String) obj[17]);
			location.setBrandCode((String) obj[18]);
			location.setSubBrandCode((String) obj[19]);
			location.setIsActive((Boolean) obj[20]);
			location.setCreatedBy((String) obj[21]);
			location.setCreatedDate(((Date) obj[22]).getTime());	
			location.setLastModifiedBy((String) obj[23]);
			location.setLastModifiedDate(((Date) obj[24]).getTime()); 
			location.setTaxDetails((String) obj[25]);
			location.setBankingDetails((String) obj[26]);
			location.setStoreDetails((String) obj[27]);
			locationdetailsList.add(location);
			}
		
		return locationdetailsList;
	}

	@Override
	public List<String> getLocationCodes(EdcBankRequestDto edcBankRequestDto) {
		List<String> objectList = locationRepository.getLocationcodeList(edcBankRequestDto);
		return objectList;
	}
}
