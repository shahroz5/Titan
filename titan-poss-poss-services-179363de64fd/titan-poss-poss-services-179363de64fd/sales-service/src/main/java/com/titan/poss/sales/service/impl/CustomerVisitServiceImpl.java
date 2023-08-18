/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.BusinessDayDaoExt;
import com.titan.poss.sales.dao.CustomerVisitDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CustomerVisitSyncDtoExt;
import com.titan.poss.sales.dto.request.CustomerVisitDto;
import com.titan.poss.sales.dto.response.CustomerVisitCountDto;
import com.titan.poss.sales.dto.response.CustomerVisitResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.repository.CustomerVisitRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CustomerVisitService;
import com.titan.poss.sales.service.SalesSyncDataService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("customerVisitServiceImpl")
public class CustomerVisitServiceImpl implements CustomerVisitService {

	@Autowired
	private CustomerVisitRepositoryExt customerVisitRepository;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Autowired
	private BusinessDayServiceImpl businessDayServiceImpl;

	@Autowired
	private CustomerVisitServiceImpl customerVisitImpl;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	EngineServiceImpl engineService;

	private static final String ERR_SALE_275 = "ERR-SALE-275";
	private static final String WALKIN_NOT_ENABLED_FOR_THE_LOCATION = "Walk-ins is not enabled for the location";

	@Value("${app.name}")
	private String appName;

	/**
	 * This method will save the count of customer visited in BTQ
	 * 
	 * @param customerVisit
	 * @param storeDetails
	 * @return CustomerVisitDto
	 */
	@Transactional
	public PublishResponse saveCustomerVisitDetailsTransactional(CustomerVisitDto customerVisit,
			StoreDetails storeDetails) {

		String locationCode = CommonUtil.getLocationCode();
		BusinessDayDaoExt businessDay = businessDayServiceImpl.getBusinessDayInProgress(locationCode);
		Date currentBusinessDate = businessDay.getBusinessDate();

		if (CalendarUtils.getDayDiff(currentBusinessDate, customerVisit.getBusinessDate()) >= storeDetails
				.getNumberOfDaysToDisplay())
			throw new ServiceException("Walk-in is not allowed for selected date", "ERR-SALE-274");

		CustomerVisitDaoExt customerVisitCheck = customerVisitRepository.findByLocationCodeAndBusinessDate(locationCode,
				customerVisit.getBusinessDate());

		if (customerVisitCheck != null) {
			throw new ServiceException("Walk-ins details already done for the date", "ERR-SALE-168");
		}

		CustomerVisitDaoExt customerVisitDao = (CustomerVisitDaoExt) MapperUtil.getObjectMapping(customerVisit,
				new CustomerVisitDaoExt());
		customerVisitDao.setLocationCode(locationCode);
		if (customerVisit.getPurchaserCount() != null)
			customerVisitDao.setPurchaserCount(customerVisit.getPurchaserCount());
		else
			customerVisitDao.setPurchaserCount(0);
		if (customerVisit.getNonPurchaserCount() != null)
			customerVisitDao.setNonPurchaserCount(customerVisit.getNonPurchaserCount());
		else
			customerVisitDao.setNonPurchaserCount(0);
		SyncStagingDto syncStagingDto = customerVisitStaging(customerVisitDao, SalesOperationCode.CUSTOMER_VISIT);
		PublishResponse response = new PublishResponse();
		response.setSyncStagingDto(syncStagingDto);
		response.setApiResponse(customerVisit);
		return response;
	}

	/**
	 * @param customerVisitDao
	 * @param customerVisit
	 * @return
	 */
	public SyncStagingDto customerVisitStaging(CustomerVisitDaoExt customerVisitDao, String operation) {
		customerVisitDao = customerVisitRepository.save(customerVisitDao);
		SyncStagingDto customerVisitStagingDto = null;
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<SyncData> syncDataList = new ArrayList<>();
			List<String> destinations = new ArrayList<>();
			destinations.add(AppTypeEnum.EPOSS.name());
			syncDataList.add(DataSyncUtil.createSyncData(new CustomerVisitSyncDtoExt(customerVisitDao), 0));
			MessageRequest customerVisitMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation,
					destinations, MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
			customerVisitStagingDto = new SyncStagingDto();
			customerVisitStagingDto.setMessageRequest(customerVisitMsgRequest);
			String customerVisitMsgRqst = MapperUtil.getJsonString(customerVisitMsgRequest);
			SyncStaging customerVisitSyncStaging = new SyncStaging();
			customerVisitSyncStaging.setMessage(customerVisitMsgRqst);
			customerVisitSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			customerVisitSyncStaging = saleSyncStagingRepository.save(customerVisitSyncStaging);
			customerVisitStagingDto.setId(customerVisitSyncStaging.getId());
		}
		return customerVisitStagingDto;
	}

	/**
	 * This method will get the count of conversion
	 * 
	 * @param businessDateDto
	 * @return ConversionCountDto
	 */
	@Override
	public CustomerVisitCountDto getCustomerVisitCount(BusinessDateDto businessDateDto) {

		StoreDetails storeDetails = businessDayServiceImpl.getStoreDetails();
		if (!Boolean.TRUE.equals(storeDetails.getIsWalkInsDetailsMandatory())) {
			throw new ServiceException(WALKIN_NOT_ENABLED_FOR_THE_LOCATION, ERR_SALE_275);
		}
		CustomerVisitCountDto visitCountDto = new CustomerVisitCountDto();
		visitCountDto.setPurchasers(salesTxnRepository.getPurchasersCount(TransactionStatusEnum.CONFIRMED.name(),
				CommonUtil.getLocationCode(), businessDateDto.getBusinessDate()));
		visitCountDto.setInvoices(salesTxnRepository.getInvoiceCount(TransactionStatusEnum.CONFIRMED.name(),
				CommonUtil.getLocationCode(), businessDateDto.getBusinessDate()));
		visitCountDto.setDate(businessDateDto.getBusinessDate());
		return visitCountDto;
	}

	private CustomerVisitDto getCustomerVisitDetails(BusinessDateDto businessDateDto, StoreDetails storeDetails) {

		if (!Boolean.TRUE.equals(storeDetails.getIsWalkInsDetailsMandatory())) {
			throw new ServiceException(WALKIN_NOT_ENABLED_FOR_THE_LOCATION, ERR_SALE_275);
		}
		if (storeDetails.getNoOfDays() == 0) {
			CustomerVisitDaoExt customerVisit = customerVisitRepository
					.findByLocationCodeAndBusinessDate(CommonUtil.getLocationCode(), businessDateDto.getBusinessDate());
			if (customerVisit == null) {
				throw new ServiceException("walk-ins details are not done for the configured days", "ERR-SALE-136");
			}
			return (CustomerVisitDto) MapperUtil.getObjectMapping(customerVisit, new CustomerVisitDto());
		} else {
			int i = -storeDetails.getNoOfDays();
			while (i < 0) {
				CustomerVisitDaoExt customerVisitCheck = customerVisitRepository.findByLocationCodeAndBusinessDate(
						CommonUtil.getLocationCode(), CalendarUtils.addDate(businessDateDto.getBusinessDate(), i));
				if (customerVisitCheck == null) {
					throw new ServiceException("walk-ins details are not done for the configured days", "ERR-SALE-136");
				}
				i++;
			}
		}
		CustomerVisitDaoExt customerVisit = customerVisitRepository.findByLocationCodeAndBusinessDate(
				CommonUtil.getLocationCode(),
				CalendarUtils.addDate(businessDateDto.getBusinessDate(), -storeDetails.getNoOfDays()));
		return (CustomerVisitDto) MapperUtil.getObjectMapping(customerVisit, new CustomerVisitDto());
	}

	@Override
	public CustomerVisitResponseDto saveCustomerVisitDetails(CustomerVisitDto customerVisit) {

		StoreDetails storeDetails = businessDayServiceImpl.getStoreDetails();

		if (!Boolean.TRUE.equals(storeDetails.getIsWalkInsDetailsMandatory())) {
			throw new ServiceException(WALKIN_NOT_ENABLED_FOR_THE_LOCATION, ERR_SALE_275);
		}
		PublishResponse customerVisitResponse = customerVisitImpl.saveCustomerVisitDetailsTransactional(customerVisit,
				storeDetails);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			salesSyncDataService.publishSalesMessagesToQueue(customerVisitResponse.getSyncStagingDto());
		}
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(customerVisitResponse.getApiResponse(),
				new TypeReference<CustomerVisitResponseDto>() {
				});
	}

	@Override
	public ListResponse<CustomerVisitResponseDto> getCustomerVisits() {
		StoreDetails storeDetails = businessDayServiceImpl.getStoreDetails();

		List<CustomerVisitResponseDto> customerVisitDtoList = new ArrayList<>();
		if (!Boolean.TRUE.equals(storeDetails.getIsWalkInsDetailsMandatory())) {
			throw new ServiceException(WALKIN_NOT_ENABLED_FOR_THE_LOCATION, ERR_SALE_275);
		}
		BusinessDayDaoExt businessDay = businessDayServiceImpl.getBusinessDayInProgress(CommonUtil.getLocationCode());
		Date endDate = businessDay.getBusinessDate();
		Date startDate = CalendarUtils.addDate(endDate, -storeDetails.getNumberOfDaysToDisplay());

		List<CustomerVisitDaoExt> customerVisitDaoList = customerVisitRepository
				.findByLocationCodeAndBusinessDateRange(CommonUtil.getLocationCode(), startDate, endDate);

		customerVisitDaoList.forEach(customerVisitDao -> customerVisitDtoList.add(
				(CustomerVisitResponseDto) MapperUtil.getDtoMapping(customerVisitDao, CustomerVisitResponseDto.class)));
		Collections.sort(customerVisitDtoList);
		Collections.reverse(customerVisitDtoList);
		return new ListResponse<>(customerVisitDtoList);
	}

	@Override
	public CustomerVisitDto getCustomerVisitDetails(BusinessDateDto businessDateDto) {
		StoreDetails storeDetails = businessDayServiceImpl.getStoreDetails();
		return getCustomerVisitDetails(businessDateDto, storeDetails);
	}

	@Override
	public CustomerVisitResponseDto getCustomerVisitDetails() {

		StoreDetails storeDetails = businessDayServiceImpl.getStoreDetails();
		BusinessDayDaoExt businessDay = businessDayServiceImpl.getBusinessDayInProgress(CommonUtil.getLocationCode());

		return (CustomerVisitResponseDto) MapperUtil.getDtoMapping(
				getCustomerVisitDetails(new BusinessDateDto(businessDay.getBusinessDate()), storeDetails),
				CustomerVisitResponseDto.class);
	}

}
