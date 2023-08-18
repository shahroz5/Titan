/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.CurrencyDao;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dto.CountrySyncDto;
import com.titan.poss.location.dto.request.CountryCreateDto;
import com.titan.poss.location.dto.request.CountryUpdateDto;
import com.titan.poss.location.dto.response.CountryLiteDto;
import com.titan.poss.location.repository.CountryRepositoryExt;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.service.CountryService;
import com.titan.poss.location.service.LocationSyncDataService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("countryService")
public class CountryServiceImpl implements CountryService {

	private static final String ERR_LOC_002 = "ERR-LOC-002";

	private static final String NO_COUNTRY_DETAILS_FOUND_FOR_THE_REQUESTED_COUNTRYCODE = "No Country details found for the requested countryCode";

	private static final String ERR_LOC_009 = "ERR-LOC-009";

	private static final String COUNTRY_CODE_IS_ALREADY_AVAILABLE = "CountryCode is already available";

	@Autowired
	private CountryRepositoryExt countryRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private CountryServiceImpl countryService;

	/**
	 * This method will return the list of Country details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CountryDto>>
	 */
	@Override
	public PagedRestResponse<List<CountryDto>> listCountry(Boolean isActive, String description, Pageable pageable) {
		CountryDao countryCriteria = new CountryDao();
		countryCriteria.setIsActive(isActive);
		countryCriteria.setDescription(description);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CountryDao> criteria = Example.of(countryCriteria, matcher);
		Page<CountryDao> countryList = countryRepository.findAll(criteria, pageable);
		List<CountryDto> countryDtoList = new ArrayList<>();
		countryList.forEach(country -> {
			CountryDto countryDto = (CountryDto) MapperUtil.getObjectMapping(country, new CountryDto());
			countryDtoList.add(getCountryDepends(country, countryDto));
		});
		return (new PagedRestResponse<>(countryDtoList, countryList));
	}

	/**
	 * This method will add the Country depends to the CountryDto from the Country
	 * and returns CountryDto.
	 * 
	 * @param country
	 * @param countryDto
	 * @return CountryDto
	 */
	private CountryDto getCountryDepends(CountryDao country, CountryDto countryDto) {
		countryDto.setCurrencyCode(country.getCurrency().getCurrencyCode());
		return countryDto;
	}

	/**
	 * This method will return the Country details based on the countryCode.
	 * 
	 * @param countryCode
	 * @return CountryDto
	 */
	@Override
	public CountryDto getCountry(String countryCode) {
		CountryDao country = countryRepository.findOneByCountryCode(countryCode);
		if (country == null) {
			throw new ServiceException(NO_COUNTRY_DETAILS_FOUND_FOR_THE_REQUESTED_COUNTRYCODE, ERR_LOC_002);
		}
		CountryDto countryDto = (CountryDto) MapperUtil.getObjectMapping(country, new CountryDto());
		return getCountryDepends(country, countryDto);
	}

	/**
	 * This method will save the Country details.
	 * 
	 * @param countryDto
	 * @return CountryDto
	 */
	@Override
	public CountryDto addCountry(CountryCreateDto countryCreateDto) {
		CountryDao country = countryRepository.findOneByDescription(countryCreateDto.getDescription());
		if (country != null) {
			throw new ServiceException(COUNTRY_CODE_IS_ALREADY_AVAILABLE, ERR_LOC_009);
		}
		country = (CountryDao) MapperUtil.getDtoMapping(countryCreateDto, CountryDao.class);
		country.setSrcSyncId(0);
		country.setDestSyncId(0);
		String currencyCode = countryCreateDto.getCurrencyCode();
		if (currencyCode != null && currencyCode.length() > 0) {
			CurrencyDao currency = new CurrencyDao();
			currency.setCurrencyCode(currencyCode);
			country.setCurrency(currency);
		}
		SyncStagingDto data = countryService.saveCountryToDB(country, LocationOperationCodes.COUNTRY_ADD);
		// Publishing to data sync queue
		syncDataService.publishLocationMessagesToQueue(data);
		CountryDto countryDto = (CountryDto) MapperUtil.getObjectMapping(country, new CountryDto());
		countryDto.setCurrencyCode(country.getCurrency().getCurrencyCode());
		return countryDto;
	}

	/**
	 * @param countryDto
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveCountryToDB(CountryDao country, String operation) {
		// saving country
		CountryDao savedCountry = countryRepository.save(country);
		// converting to required json string
		List<SyncData> countrySyncDataList = new ArrayList<>();
		CountrySyncDto countrySyncDto = new CountrySyncDto(savedCountry);
		countrySyncDataList.add(DataSyncUtil.createSyncData(countrySyncDto, 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto countrySyncStagingDto = new SyncStagingDto();
		MessageRequest countryMessageRequest = DataSyncUtil.createMessageRequest(countrySyncDataList, operation,
				destinations, MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		countrySyncStagingDto.setMessageRequest(countryMessageRequest);
		String requestBody = MapperUtil.getJsonString(countryMessageRequest);
		// saving to staging table
		SyncStaging countryStagingMessage = new SyncStaging();
		countryStagingMessage.setMessage(requestBody);
		countryStagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		countryStagingMessage = locationSyncStagingRepository.save(countryStagingMessage);
		countrySyncStagingDto.setId(countryStagingMessage.getId());
		return countrySyncStagingDto;
	}

	/**
	 * This method will update the Country details.
	 * 
	 * @param countryDto
	 * @return CountryUpdateDto
	 */
	@Override
	public CountryDto updateCountry(String countryCode, CountryUpdateDto countryUpdateDto) {
		CountryDao country = countryRepository.findOneByCountryCode(countryCode);
		if (country == null) {
			throw new ServiceException(NO_COUNTRY_DETAILS_FOUND_FOR_THE_REQUESTED_COUNTRYCODE, ERR_LOC_002);
		}
		country = (CountryDao) MapperUtil.getObjectMapping(countryUpdateDto, country);
		country.setSrcSyncId(country.getSrcSyncId() + 1);
		String currencyCode = countryUpdateDto.getCurrencyCode();
		if (currencyCode != null && currencyCode.length() > 0) {
			CurrencyDao currency = new CurrencyDao();
			currency.setCurrencyCode(currencyCode);
			country.setCurrency(currency);
		}
		SyncStagingDto data = countryService.saveCountryToDB(country, LocationOperationCodes.COUNTRY_UPDATE);
		syncDataService.publishLocationMessagesToQueue(data);
		CountryDto countryDto = (CountryDto) MapperUtil.getObjectMapping(country, new CountryDto());
		countryDto.setCurrencyCode(country.getCurrency().getCurrencyCode());
		return countryDto;
	}

	@Override
	public PagedRestResponse<List<CountryLiteDto>> getCountryLite(Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		CountryDao countryDao = new CountryDao();
		countryDao.setIsActive(true);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CountryDao> criteria = Example.of(countryDao, matcher);

		Page<CountryDao> countryDaoList = countryRepository.findAll(criteria, pageable);

		List<CountryLiteDto> countries = new ArrayList<>();

		countryDaoList.forEach(
				country -> countries.add((CountryLiteDto) MapperUtil.getObjectMapping(country, new CountryLiteDto())));

		return (new PagedRestResponse<>(countries, countryDaoList));
	}

}
