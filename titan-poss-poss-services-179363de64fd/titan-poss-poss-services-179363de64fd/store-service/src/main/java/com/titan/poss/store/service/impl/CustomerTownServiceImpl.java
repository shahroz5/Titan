/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.StoreOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.store.dao.CustomerTownDao;
import com.titan.poss.store.dao.CustomerTownId;
import com.titan.poss.store.dao.SyncStaging;
import com.titan.poss.store.dto.CustomerTownSyncDto;
import com.titan.poss.store.dto.request.CustomerTownAddDto;
import com.titan.poss.store.dto.request.CustomerTownUpdateDto;
import com.titan.poss.store.dto.response.CustomerTownDto;
import com.titan.poss.store.repository.CustomerTownRepositoryExt;
import com.titan.poss.store.repository.StoreSyncStagingRepository;
import com.titan.poss.store.service.CustomerTownService;
import com.titan.poss.store.service.EngineService;
import com.titan.poss.store.service.StoreSyncDataService;

/**
 * Service class for CustomerTown.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("storeCustomerTownService")
public class CustomerTownServiceImpl implements CustomerTownService {

	private static final String ERR_STORE_001 = "ERR-STORE-001";
	private static final String RECORD_NOT_FOUND = "Record not found.";

	private static final String ERR_STORE_002 = "ERR-STORE-002";
	private static final String RECORD_ALREADY_EXIST = "Record already exists.";

	@Autowired
	private CustomerTownRepositoryExt customerTownRepository;
	@Autowired
	private CustomerTownServiceImpl customerTwServiceImpl;
	@Autowired
	private StoreSyncDataService storeSyncDataService;
	@Autowired
	private StoreSyncStagingRepository storeSyncStagingRepository;
	@Autowired
	private EngineService engineService;

	@Value("${app.name}")
	private String appName;

	private CustomerTownDao checkIfCustomerTownExists(Integer customerTownCode) {
		CustomerTownDao customerTown = customerTownRepository
				.findOneByCustomerTownIdTownCodeAndCustomerTownIdLocationCode(customerTownCode,
						CommonUtil.getLocationCode());
		if (customerTown == null) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_STORE_001);
		}
		return customerTown;
	}

	/**
	 * This method will return the list of CustomerTown details for a store.
	 * 
	 * @param pageable
	 * @return PagedRestResponse<List<CustomerTownDto>>
	 */
	@Override
	public PagedRestResponse<List<CustomerTownDto>> listTown(String stateCode, String description, Boolean isActive,
			Pageable pageable) {

		CustomerTownDao customerTownCriteria = new CustomerTownDao();
		customerTownCriteria.setIsActive(isActive);
		customerTownCriteria.setStateCode(stateCode);
		customerTownCriteria.setDescription(description);

		CustomerTownId customerTownId = new CustomerTownId();
		customerTownId.setLocationCode(CommonUtil.getLocationCode());

		customerTownCriteria.setCustomerTownId(customerTownId);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<CustomerTownDao> criteria = Example.of(customerTownCriteria, matcher);

		Page<CustomerTownDao> customerTownList = customerTownRepository.findAll(criteria, pageable);

		Map<String, String> stateCodeWithDescription = engineService.getStateDetailsMap();
		List<CustomerTownDto> customerTownDtoList = new ArrayList<>();
		customerTownList.forEach(customerTown -> {
			CustomerTownDto customerTownDto = (CustomerTownDto) MapperUtil.getObjectMapping(customerTown,
					new CustomerTownDto());
			customerTownDto.setStateName(stateCodeWithDescription.get(customerTown.getStateCode()));
			customerTownDto.setTownCode(customerTown.getCustomerTownId().getTownCode());

			customerTownDtoList.add(customerTownDto);
		});

		return (new PagedRestResponse<>(customerTownDtoList, customerTownList));
	}

	/**
	 * This method will save the CustomerTown details.
	 * 
	 * @param customerTownAddDto
	 * @return void
	 */
	@Override
	public CustomerTownDto addTown(CustomerTownAddDto customerTownAddDto) {

		if (!customerTownRepository.findByDescriptionLocationCodeStateCode(customerTownAddDto.getDescription(),
				CommonUtil.getLocationCode(), customerTownAddDto.getStateCode()).isEmpty()) {
			throw new ServiceException(RECORD_ALREADY_EXIST, ERR_STORE_002);
		}

		CustomerTownId customerTownId = new CustomerTownId();
		customerTownId.setLocationCode(CommonUtil.getLocationCode());
		customerTownId.setTownCode(customerTownRepository.getNextTownId(CommonUtil.getLocationCode()));

		CustomerTownDao customerTown = (CustomerTownDao) MapperUtil.getObjectMapping(customerTownAddDto,
				new CustomerTownDao());

		customerTown.setCustomerTownId(customerTownId);
		customerTown.setSrcSyncId(0);
		customerTown.setDestSyncId(0);
		SyncStagingDto syncStagingDto = customerTwServiceImpl.addAndUpdateCustomerStaging(customerTown,
				StoreOperationCode.CUSTOMER_TOWN_ADD);

		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			storeSyncDataService.publishPaymentMessagesToQueue(syncStagingDto);

		CustomerTownDto customerDto = (CustomerTownDto) MapperUtil.getObjectMapping(customerTown,
				new CustomerTownDto());

		customerDto.setTownCode(customerTown.getCustomerTownId().getTownCode());

		return customerDto;
	}

	/**
	 * This method will return the CustomerTown details based on the
	 * customerTownCode.
	 * 
	 * @param customerTownCode
	 * @return CustomerTownDto
	 */
	@Override
	public CustomerTownDto getTown(Integer customerTownCode) {

		CustomerTownDao customerTown = checkIfCustomerTownExists(customerTownCode);

		CustomerTownDto customerTownDto = (CustomerTownDto) MapperUtil.getObjectMapping(customerTown,
				new CustomerTownDto());
		customerTownDto.setTownCode(customerTown.getCustomerTownId().getTownCode());

		Map<String, String> stateCodeWithDescription = engineService.getStateDetailsMap();
		customerTownDto.setStateName(stateCodeWithDescription.get(customerTown.getStateCode()));
		return customerTownDto;
	}

	/**
	 * This method will update the CustomerTown details.
	 * 
	 * @param customerTownCode
	 * @param customerTownUpdateDto
	 * @return void
	 */
	@Override
	public CustomerTownDto updateTown(Integer customerTownCode, CustomerTownUpdateDto customerTownUpdateDto) {

		// PENDING: check for description
		CustomerTownDao customerTown = checkIfCustomerTownExists(customerTownCode);

		customerTown = (CustomerTownDao) MapperUtil.getObjectMapping(customerTownUpdateDto, customerTown);
		customerTown.setSrcSyncId(customerTown.getSrcSyncId() + 1);
		SyncStagingDto syncStagingDto = customerTwServiceImpl.addAndUpdateCustomerStaging(customerTown,
				StoreOperationCode.CUSTOMER_TOWN_UPDATE);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			storeSyncDataService.publishPaymentMessagesToQueue(syncStagingDto);

		CustomerTownDto customerTownDto = (CustomerTownDto) MapperUtil.getObjectMapping(customerTown,
				new CustomerTownDto());
		Map<String, String> stateCodeWithDescription = engineService.getStateDetailsMap();
		customerTownDto.setStateName(stateCodeWithDescription.get(customerTown.getStateCode()));
		customerTownDto.setTownCode(customerTownCode);

		return customerTownDto;
	}

	@Transactional
	public SyncStagingDto addAndUpdateCustomerStaging(CustomerTownDao customerTown, String operation) {
		customerTown = customerTownRepository.save(customerTown);
		SyncStagingDto customerStagingDto = new SyncStagingDto();
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<SyncData> syncDataList = new ArrayList<>();
			CustomerTownSyncDto syncDto = new CustomerTownSyncDto(customerTown);
			syncDataList.add(DataSyncUtil.createSyncData(syncDto, 0));
			List<String> destinations = new ArrayList<>();
			destinations.add("EPOSS");
			MessageRequest customerMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
					MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
			customerStagingDto.setMessageRequest(customerMsgRequest);
			String customerMsg = MapperUtil.getJsonString(customerMsgRequest);
			// saving to staging table
			SyncStaging customerSyncStaging = new SyncStaging();
			customerSyncStaging.setMessage(customerMsg);
			customerSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			customerSyncStaging = storeSyncStagingRepository.save(customerSyncStaging);
			customerStagingDto.setId(customerSyncStaging.getId());
		}
		return customerStagingDto;
	}

}
