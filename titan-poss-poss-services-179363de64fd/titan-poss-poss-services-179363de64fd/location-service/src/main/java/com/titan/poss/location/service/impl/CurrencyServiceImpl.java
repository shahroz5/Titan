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

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.location.dao.CurrencyDao;
import com.titan.poss.location.dao.SyncStaging;
import com.titan.poss.location.dto.CurrencyDto;
import com.titan.poss.location.dto.CurrencySyncDto;
import com.titan.poss.location.dto.constants.LocationConstants;
import com.titan.poss.location.dto.request.CurrencyCreateDto;
import com.titan.poss.location.dto.request.CurrencyUpdateDto;
import com.titan.poss.location.dto.response.CurrencyLiteDto;
import com.titan.poss.location.repository.CurrencyRepositoryExt;
import com.titan.poss.location.repository.LocationSyncStagingRepository;
import com.titan.poss.location.service.CurrencyService;
import com.titan.poss.location.service.LocationSyncDataService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("currencyService")
public class CurrencyServiceImpl implements CurrencyService {

	private static final String ERR_LOC_012 = "ERR-LOC-012";

	private static final String DETAILS_ALREADY_EXISTS_FOR_THE_REQUESTED_ID = "Details already exists for the requested Item";

	@Autowired
	private CurrencyRepositoryExt currencyRepository;

	@Autowired
	private LocationSyncDataService syncDataService;

	@Autowired
	private LocationSyncStagingRepository locationSyncStagingRepository;

	@Autowired
	private CurrencyServiceImpl currencyService;

	/**
	 * This method will return the list of Currency details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CurrencyDto>>
	 */
	@Override
	public PagedRestResponse<List<CurrencyDto>> listCurrency(Boolean isActive, Pageable pageable) {
		CurrencyDao currencyCriteria = new CurrencyDao();
		currencyCriteria.setIsActive(isActive);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CurrencyDao> criteria = Example.of(currencyCriteria, matcher);
		Page<CurrencyDao> currencyList = currencyRepository.findAll(criteria, pageable);

		List<CurrencyDto> currencyDtoList = new ArrayList<>();

		currencyList.forEach(
				currency -> currencyDtoList.add((CurrencyDto) MapperUtil.getDtoMapping(currency, CurrencyDto.class)));
		return (new PagedRestResponse<>(currencyDtoList, currencyList));
	}

	/**
	 * This method will return the Currency details based on the currencyCode.
	 * 
	 * @param currencyCode
	 * @return CurrencyDto
	 */
	@Override
	public CurrencyDto getCurrency(String currencyCode) {
		CurrencyDao currency = currencyRepository.findOneByCurrencyCode(currencyCode);
		if (currency == null) {
			throw new ServiceException(LocationConstants.NO_CURRENCY_DETAILS_FOUND_FOR_THE_REQUESTED_CURRENCYCODE,
					LocationConstants.ERR_LOC_046);
		}
		return (CurrencyDto) MapperUtil.getDtoMapping(currency, CurrencyDto.class);
	}

	/**
	 * This method will save the Currency details.
	 * 
	 * @param currencyDto
	 * @return CurrencyDto
	 */
	@Override
	public CurrencyDto addCurrency(CurrencyCreateDto currencyDto) {
		CurrencyDao currency = currencyRepository.findOneByDescription(currencyDto.getDescription());
		if (currency != null) {
			throw new ServiceException(DETAILS_ALREADY_EXISTS_FOR_THE_REQUESTED_ID, ERR_LOC_012);
		}

		currency = (CurrencyDao) MapperUtil.getDtoMapping(currencyDto, CurrencyDao.class);

		currency.setSrcSyncId(0);
		currency.setDestSyncId(0);
		currency.setUnicode(StringUtil.convertToUTF(currencyDto.getCurrencySymbol()));
		SyncStagingDto data = currencyService.saveCurrencyToDB(currency, LocationOperationCodes.CURRENCY_ADD);

		// Publishing to data sync queue
		syncDataService.publishLocationMessagesToQueue(data);
		return (CurrencyDto) MapperUtil.getObjectMapping(currency, new CurrencyDto());
	}

	/**
	 * @param currencySymbol
	 * @return String
	 */

	/**
	 * @param currency
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveCurrencyToDB(CurrencyDao currency, String operation) {

		// saving currency
		currency = currencyRepository.save(currency);
		// converting to required json string
		List<SyncData> syncDataList = new ArrayList<>();
		CurrencySyncDto currencySyncDto = new CurrencySyncDto(currency);
		syncDataList.add(DataSyncUtil.createSyncData(currencySyncDto, 0));
		List<String> destinations = new ArrayList<>();
		SyncStagingDto currencySyncStagingDto = new SyncStagingDto();
		MessageRequest currencyMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		currencySyncStagingDto.setMessageRequest(currencyMsgRequest);
		String currencyRequestBody = MapperUtil.getJsonString(currencyMsgRequest);
		// saving to staging table
		SyncStaging currencySyncStaging = new SyncStaging();
		currencySyncStaging.setMessage(currencyRequestBody);
		currencySyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		currencySyncStaging = locationSyncStagingRepository.save(currencySyncStaging);
		currencySyncStagingDto.setId(currencySyncStaging.getId());
		return currencySyncStagingDto;
	}

	/**
	 * This method will update the Currency details.
	 * 
	 * @param currencyDto
	 * @return CurrencyUpdateDto
	 */
	@Override
	public CurrencyDto updateCurrency(String currencyCode, CurrencyUpdateDto currencyUpdateDto) {
		CurrencyDao currency = currencyRepository.findOneByCurrencyCode(currencyCode);
		if (currency == null) {
			throw new ServiceException(LocationConstants.NO_CURRENCY_DETAILS_FOUND_FOR_THE_REQUESTED_CURRENCYCODE,
					LocationConstants.ERR_LOC_046);
		}
		currency = (CurrencyDao) MapperUtil.getObjectMapping(currencyUpdateDto, currency);

		String symbolUpdate = currencyUpdateDto.getCurrencySymbol();
		if (symbolUpdate != null)
			currency.setUnicode(StringUtil.convertToUTF(symbolUpdate));

		// incrementing the Source Data Sync ID
		currency.setSrcSyncId(currency.getSrcSyncId() + 1);

		SyncStagingDto data = currencyService.saveCurrencyToDB(currency, LocationOperationCodes.CURRENCY_UPDATE);

		// Publishing to Data Sync Queue
		syncDataService.publishLocationMessagesToQueue(data);
		return (CurrencyDto) MapperUtil.getObjectMapping(currency, new CurrencyDto());
	}

	@Override
	public CurrencyDao getCurrencyDao(String currencyCode) {

		return currencyRepository.findOneByCurrencyCode(currencyCode);
	}

	@Override
	public PagedRestResponse<List<CurrencyLiteDto>> getCurrencyLite(Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		CurrencyDao currencyDao = new CurrencyDao();
		currencyDao.setIsActive(true);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CurrencyDao> criteria = Example.of(currencyDao, matcher);

		Page<CurrencyDao> currencyDaoList = currencyRepository.findAll(criteria, pageable);

		List<CurrencyLiteDto> currencies = new ArrayList<>();

		currencyDaoList.forEach(currency -> currencies
				.add((CurrencyLiteDto) MapperUtil.getObjectMapping(currency, new CurrencyLiteDto())));

		return (new PagedRestResponse<>(currencies, currencyDaoList));
	}

}
