/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.sales.dto.CustomerOrderComItemsDataDto;
import com.titan.poss.sales.dto.CustomerOrderComItemsDto;
import com.titan.poss.sales.dto.CustomerOrderDetailsDto;
import com.titan.poss.sales.dto.CustomerOrderDetailsTempDto;
import com.titan.poss.sales.dto.CustomerOrderItemsTempDto;
import com.titan.poss.sales.service.CustomerOrderService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class CustomerOrderServiceImpl implements CustomerOrderService {

	private static final String OPEN = "OPEN";
	private static final String CUSTOMER_ORDER_DATA_NOT_AVAILABLE = "Customer order EA data is not available";
	private static final String LOCATION_CODE_CAN_NOT_BE_NULL = "Location Code can not be null";
	private static final String CUSTOMER_ORDER_COM_DATA_NOT_AVAILABLE = "Customer Order COM data not available";
	private static final String WHILE_CALLING_CUSTOMER_ORDER_COM_API_GETTING_ERROR = "While calling customer order COM API getting error";
	private static final String WHILE_CALLING_CUSTOMER_ORDER_API_GETTING_ERROR = "While calling customer order api getting error";
	private static final String WHILE_CONVERTING_STRING_TO_DATE_FORMAT_GETTING_ERROR = "While converting string to date format getting error";
	private static final String ERR_LOC_088 = "ERR-LOC-088";
	private static final String ERR_COM_008 = "ERR-COM-008";
	private static final String ERR_COM_009 = "ERR-COM-009";
	private static final String ERR_COM_010 = "ERR-COM-010";
	private static final String ERR_COM_011 = "ERR-COM-011";
	private static final String ERR_COM_012 = "ERR-COM-012";
	private static final String YES="Y";
	
	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Override
	@Transactional
	public List<CustomerOrderDetailsDto> getCustomerOrders(String locationCode, String requestTypes) {

		if (locationCode == null || locationCode.isEmpty()) {
			throw new ServiceException(LOCATION_CODE_CAN_NOT_BE_NULL, ERR_LOC_088);
		}

		List<CustomerOrderDetailsDto> customerOrderList = getDataBasedOnRequestTypes(requestTypes, locationCode);

		List<CustomerOrderDetailsDto> customerOrderSortedList = customerOrderList.stream()
				.sorted(Comparator.comparing(CustomerOrderDetailsDto::getMobileNumber)
						.thenComparing(Comparator.comparing(CustomerOrderDetailsDto::getRequestType)))
				.collect(Collectors.toList());
		
		return customerOrderSortedList;
	}

	private List<CustomerOrderDetailsDto> getDataBasedOnRequestTypes(String requestTypes, String locationCode) {
		List<CustomerOrderDetailsDto> customerOrderList = new ArrayList<>();
		switch (requestTypes) {

		case "EA":
			customerOrderList = getCoOrderData(locationCode);
			break;

		case "COM":
			customerOrderList = getCustomerOrderComData(locationCode);
			break;			
		}
		return customerOrderList;

	}

	private List<CustomerOrderDetailsDto> getCoOrderData(String locationCode) {
		List<CustomerOrderDetailsDto> coDetailsList = new ArrayList<>();
		try {
			Object coOrderData = integrationServiceClient.getCustomerOrderData(locationCode);

			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			CustomerOrderItemsTempDto customerOrderItemDetails = mapper.convertValue(coOrderData,
					new TypeReference<CustomerOrderItemsTempDto>() {
					});
			if (customerOrderItemDetails == null || customerOrderItemDetails.getItems().isEmpty()) {
				throw new ServiceException(CUSTOMER_ORDER_DATA_NOT_AVAILABLE, ERR_COM_008);
			}
			coDetailsList = setCoOrderData(customerOrderItemDetails.getItems(), locationCode);

		} catch (Exception e) {
			throw new ServiceException(WHILE_CALLING_CUSTOMER_ORDER_API_GETTING_ERROR, ERR_COM_009);
		}
		return coDetailsList;
	}

	private List<CustomerOrderDetailsDto> setCoOrderData(List<CustomerOrderDetailsTempDto> customerTempDetailsList,
			String locationCode) {
		List<CustomerOrderDetailsDto> customerOrderList = new ArrayList<>();
		customerTempDetailsList.stream().forEach(ele -> {

			CustomerOrderDetailsDto customerOrderDetails = new CustomerOrderDetailsDto();
			customerOrderDetails.setComOrderNumber(ele.getComOrderNo());
			customerOrderDetails.setMobileNumber(ele.getCustomerMobileNo());
			customerOrderDetails.setCustomerName(ele.getCustomerName());
			customerOrderDetails.setItemCode(ele.getItemCode());
			customerOrderDetails.setGrossWeight(ele.getGrossWeight());
			customerOrderDetails.setOrderValue(ele.getOrderValue());
			customerOrderDetails.setQuantity(ele.getQuantity());
			customerOrderDetails.setRequestBy(ele.getRequestBy());
			customerOrderDetails.setRequestBtq(ele.getRequestBtq());
			customerOrderDetails.setStatus(ele.getStatus());
			customerOrderDetails.setAutostn(ele.getAutostn().equalsIgnoreCase(YES));
			customerOrderDetails.setRequestType(ele.getRequestType());
			customerOrderDetails.setComOrderDateTime(ele.getComOrderDateTime());
			customerOrderDetails.setDeliveryDateTime(ele.getDeliveryDateTime());
			customerOrderDetails.setLotNumber(ele.getLotNumber());
			if (ele.getItemCode() != null) {
				customerOrderDetails.setIsItemCodeAvailable(true);
			}
			customerOrderDetails.setCoStatus(OPEN);

			Optional<CustomerOrderDetailsDto> checkDuplicate = customerOrderList.stream()
					.filter(co -> co.getComOrderNumber().equals(customerOrderDetails.getComOrderNumber())).findAny();
			if (!checkDuplicate.isPresent()) {
				customerOrderList.add(customerOrderDetails);
			}

		});
		return customerOrderList;
	}

//	private List<CustomerOrderDetailsDto> getDataBasedOnOrderTypes(List<String> requestTypes) {
//		List<CustomerOrderDetailsDto> customerOrderList = new ArrayList<>();
//		if (requestTypes.isEmpty()) {
//			List<CustomerOrderTempDao> customerOrderTempDao = customerOrderTempRepository.findAll();
//			customerOrderList = convertCustomerDetailsData(customerOrderTempDao);
//		} else {
//			List<CustomerOrderTempDao> customerOrderTempDao = customerOrderTempRepository
//					.findByRequestTypeIn(requestTypes);
//			customerOrderList = convertCustomerDetailsData(customerOrderTempDao);
//		}
//		return customerOrderList;
//
//	}

	private List<CustomerOrderDetailsDto> getCustomerOrderComData(String locationCode) {
		List<CustomerOrderDetailsDto> customerOrderList = new ArrayList<>();
		try {
			Object comOrderData = integrationServiceClient.getCustomerOrderComData(locationCode);
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			CustomerOrderComItemsDto customerOrderComItem = mapper.convertValue(comOrderData,
					new TypeReference<CustomerOrderComItemsDto>() {
					});

			if (customerOrderComItem == null || customerOrderComItem.getItems().isEmpty()) {
				throw new ServiceException(CUSTOMER_ORDER_COM_DATA_NOT_AVAILABLE, ERR_COM_010);
			}
			customerOrderList = setCustomerOrderComData(customerOrderComItem.getItems());

		} catch (Exception e) {
			throw new ServiceException(WHILE_CALLING_CUSTOMER_ORDER_COM_API_GETTING_ERROR, ERR_COM_011);
		}
		return customerOrderList;
	}

	private List<CustomerOrderDetailsDto> setCustomerOrderComData(
			List<CustomerOrderComItemsDataDto> customerOrderComItemsData) {
		List<CustomerOrderDetailsDto> customerOrderComList = new ArrayList<>();
		customerOrderComItemsData.stream().forEach(ele -> {
			CustomerOrderDetailsDto customerOrderDetails = new CustomerOrderDetailsDto();
			customerOrderDetails.setComOrderNumber(ele.getComOrderNumber());
			customerOrderDetails.setCustomerName(ele.getCustomerName());
			customerOrderDetails.setRequestBtq(ele.getStoreCode());
			customerOrderDetails.setComOrderDateTime(ele.getComOrderDate());
			customerOrderDetails.setMobileNumber(ele.getMobileNumber());
			customerOrderDetails.setRsoName(ele.getRsoName());
			customerOrderDetails.setIsOccassion(ele.getIsOccassion());
			customerOrderDetails.setSpecialOccasion(ele.getSpecialOccasion());
			customerOrderDetails.setDateOfOccasion(ele.getDateOfOccasion());
			customerOrderDetails.setEcelesteFlag(ele.getEcelesteFlag());
			customerOrderDetails.setRequestType(ele.getRequestType());
			customerOrderDetails.setSubType(ele.getSubType());
			customerOrderDetails.setLotNumber(ele.getLotNumber());
			customerOrderDetails.setCfaCode(ele.getCfaCode());
			customerOrderDetails.setIsDummyCode(ele.getIsDummyCode());
			customerOrderDetails.setQuantity(ele.getQuantity());
			customerOrderDetails.setIsSizing(ele.getIsSizing());
			customerOrderDetails.setGoldRate(ele.getGoldRate());
			customerOrderDetails.setGoldCharges(ele.getGoldCharges());
			customerOrderDetails.setMakingCharges(ele.getMakingCharges());
			customerOrderDetails.setStoneCharges(ele.getStoneCharges());
			customerOrderDetails.setOrderValue(ele.getTotalValue());
			customerOrderDetails.setGrossWeight(ele.getGrossWt());
			customerOrderDetails.setWtPerUnit(ele.getWtPerUnit());
			customerOrderDetails.setStoneWt(ele.getStoneWt());
			customerOrderDetails.setNetWeight(ele.getNetWeight());
			customerOrderDetails.setAutostn(false);

			customerOrderDetails.setIsItemCodeAvailable(ele.getIsItemCodeAvailable());
			if (ele.getDeliveryDate() != null) {
				convertDeliveryDateFormat(ele.getDeliveryDate(), customerOrderDetails);
			}
			customerOrderDetails.setCoStatus(OPEN);
			Optional<CustomerOrderDetailsDto> checkDuplicate = customerOrderComList.stream()
					.filter(co -> co.getComOrderNumber().equals(customerOrderDetails.getComOrderNumber())).findAny();
			if (!checkDuplicate.isPresent()) {
				customerOrderComList.add(customerOrderDetails);
			}

		});
		return customerOrderComList;
	}

	private void convertDeliveryDateFormat(String deliveryDate, CustomerOrderDetailsDto customerOrderDetails) {
		SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);
		try {
			Date date = formatter.parse(deliveryDate);
			customerOrderDetails.setDeliveryDateTime(date);
		} catch (ParseException e) {
			throw new ServiceException(WHILE_CONVERTING_STRING_TO_DATE_FORMAT_GETTING_ERROR, ERR_COM_012);
		}
	}

//	private void saveCustomerOrderData(List<CustomerOrderDetailsDto> customerOrderList) {
//		if (!customerOrderList.isEmpty()) {
//			List<CustomerOrderTempDao> customerOrderTempDaoList = new ArrayList<>();
//			for (CustomerOrderDetailsDto customerOrder : customerOrderList) {
//				CustomerOrderTempDao customerOrderTempDao = (CustomerOrderTempDao) MapperUtil
//						.getDtoMapping(customerOrder, CustomerOrderTempDao.class);
//				customerOrderTempDaoList.add(customerOrderTempDao);
//			}
//			customerOrderTempRepository.deleteAll();
//			customerOrderTempRepository.saveAll(customerOrderTempDaoList);
//		}
//
//	}

//	private List<CustomerOrderDetailsDto> convertCustomerDetailsData(
//			List<CustomerOrderTempDao> customerOrderTempDaoList) {
//		List<CustomerOrderDetailsDto> listdata = new ArrayList<>();
//		customerOrderTempDaoList.stream().forEach(customerOrder -> {
//			CustomerOrderDetailsDto customerDto = (CustomerOrderDetailsDto) MapperUtil.getDtoMapping(customerOrder,
//					CustomerOrderDetailsDto.class);
//			listdata.add(customerDto);
//		});
//		return listdata;
//	}

}
