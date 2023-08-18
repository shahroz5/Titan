/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.core.domain.constant.ComTypeEnum;
import com.titan.poss.core.dto.ComUpdateRequestDto;
import com.titan.poss.core.dto.ConfirmCustomerOrderDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.COResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.ConfirmCustomerOrderDto;
import com.titan.poss.integration.dto.ConfirmInvoiceDetailsDto;
import com.titan.poss.integration.dto.CustomerOrderVendorDetailsDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.ComAuditDao;
import com.titan.poss.integration.intg.repository.ComAuditRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.CustomerOrderService;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class CustomerOrderServiceImpl implements CustomerOrderService {

	private static final String AUTHORIZATION = "Authorization";
	private static final String BASIC = "Basic ";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";
	private static final String INVALID_VENDOR = "Vendor is not active";
	private static final String ERR_INT_017 = "ERR-INT-017";
	private static final String VENDOR_CODE = "ENDLESS_AISLE";
	private static final String SERVICE_UNAVAILBLE = "ENDLESS_AISLE service not availble";
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_JSON = "application/json";
	private static final String CUSTOMER_ORDER_NUMBER_NOT_AVAILABLE = "Customer order number not available";
	private static final String ERR_INT_097 = "ERR-INT-097";
	private static final String REQUEST_ID = "request_id";
	private static final String STATUS = "status";
//	private static final String INVOICE_DETAILS_CAN_NOT_BE_EMPTY = "Invoice details can not be empty";
//	private static final String ERR_INT_099 = "ERR-INT-099";

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private ComAuditRepository comAuditRepository;

	@Override
	public Object getCustomerOrderData(String locationCode) {
		VendorDao vendor = validateVendor(VENDOR_CODE);

		CustomerOrderVendorDetailsDto customerOrderVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
						CustomerOrderVendorDetailsDto.class));

		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(vendor.getBaseurl() + customerOrderVendorDetailsDto.getFetchComOrders() + locationCode);

		Object response = getDataFromEndlessAisle(uriBuilder, customerOrderVendorDetailsDto, vendor);

		return response;
	}

	private Object getDataFromEndlessAisle(UriComponentsBuilder uriBuilder,
			CustomerOrderVendorDetailsDto customerOrderVendorDetailsDto, VendorDao vendor) {

		String username = customerOrderVendorDetailsDto.getUsername();
		String password = customerOrderVendorDetailsDto.getPassword();
		String basicAuth = username + ":" + password;

		String encodedPassword = new String(Base64.getEncoder().encode(basicAuth.getBytes()));

		HttpGet sendGetRequest = new HttpGet(uriBuilder.toUriString());

		sendGetRequest.setHeader(AUTHORIZATION, BASIC + encodedPassword);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();

		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendGetRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
		}
		Object resposeObj;
		if (httpResponseUtil.getHttpResponseCode() == 200
				&& (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			resposeObj = httpResponseUtil.getResponse();
		} else {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
		}

		return resposeObj;
	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		boolean isActive = vendor.getIsActive();
		if (!isActive) {
			throw new ServiceException(INVALID_VENDOR, ERR_INT_017);
		}
		return vendor;
	}

	@Override
	public Object getCustomerOrderComData(String locationCode) {
		VendorDao vendor = validateVendor(VENDOR_CODE);
		CustomerOrderVendorDetailsDto customerOrderVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
						CustomerOrderVendorDetailsDto.class));

		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(
				vendor.getBaseurl() + customerOrderVendorDetailsDto.getFetchComOrdersMajor() + locationCode);

		Object response = getDataFromEndlessAisle(uriBuilder, customerOrderVendorDetailsDto, vendor);

		return response;

	}

	@Override
	public Object updateStatus(ComUpdateRequestDto comUpdateRequestDto) {

		VendorDao vendor = validateVendor(VENDOR_CODE);

		CustomerOrderVendorDetailsDto customerOrderVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
						CustomerOrderVendorDetailsDto.class));

		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(vendor.getBaseurl() + customerOrderVendorDetailsDto.getUpdateStatus());

		String username = customerOrderVendorDetailsDto.getUsername();
		String password = customerOrderVendorDetailsDto.getPassword();
		String basicAuth = username + ":" + password;
		String encodedPassword = new String(Base64.getEncoder().encode(basicAuth.getBytes()));
		HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		sendPostRequest.setHeader(AUTHORIZATION, BASIC + encodedPassword);
		Gson gson = new Gson();
		String jsonString = gson.toJson(comUpdateRequestDto);
		JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			sendPostRequest.setEntity(new StringEntity(jsonObject.toString()));
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (Exception e) {

			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
		}

		Object resposeObj;
		if (httpResponseUtil.getHttpResponseCode() == 200
				&& (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {
			resposeObj = httpResponseUtil.getResponse();
		} else {
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
		}
		return resposeObj;
	}

	@Override
	public List<COResponseDto> confirmCustomerOrder(ConfirmCustomerOrderDetailsDto confirmCODetailsDto) {

		if (confirmCODetailsDto.getComOrderNo().isEmpty()) {
			throw new ServiceException(CUSTOMER_ORDER_NUMBER_NOT_AVAILABLE, ERR_INT_097);
		}

		List<COResponseDto> coResponseDtoList = new ArrayList<>();

		for (String comOrderNo : confirmCODetailsDto.getComOrderNo()) {

			Date requestTime = CalendarUtils.getCurrentDate();

			ConfirmCustomerOrderDto customerOrderDto = new ConfirmCustomerOrderDto();
			customerOrderDto.setCOMOrderNo(comOrderNo);
			customerOrderDto.setPossCustomerOrderDocNo(confirmCODetailsDto.getPossCustomerOrderDocNo());
			customerOrderDto.setPossCustomerOrderLocationCode(confirmCODetailsDto.getPossCustomerOrderLocationCode());
			customerOrderDto.setPossCusotmerOrderFiscalYear(confirmCODetailsDto.getPossCusotmerOrderFiscalYear());
			customerOrderDto.setPossCustomerOrderTotalValue(confirmCODetailsDto.getPossCustomerOrderTotalValue());
			customerOrderDto
					.setPossCustomerOrderAmountCollected(confirmCODetailsDto.getPossCustomerOrderAmountCollected());
			customerOrderDto.setGoldRate(confirmCODetailsDto.getGoldRate());
			customerOrderDto.setGoldRateFrozenFlag(confirmCODetailsDto.getGoldRateFrozenFlag());
			customerOrderDto.setPOSLoginId(confirmCODetailsDto.getPosLoginId());
			customerOrderDto.setStatus(confirmCODetailsDto.getStatus());
			customerOrderDto.setPossCustomerOrderDateTime(confirmCODetailsDto.getPossCustomerOrderDateTime());

			VendorDao vendor = validateVendor(VENDOR_CODE);

			CustomerOrderVendorDetailsDto customerOrderVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
							CustomerOrderVendorDetailsDto.class));

			UriComponentsBuilder uriBuilder = UriComponentsBuilder
					.fromHttpUrl(vendor.getBaseurl() + customerOrderVendorDetailsDto.getConfirmComOrder());

			String username = customerOrderVendorDetailsDto.getUsername();
			String password = customerOrderVendorDetailsDto.getPassword();
			String basicAuth = username + ":" + password;
			String encodedPassword = new String(Base64.getEncoder().encode(basicAuth.getBytes()));
			HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
			sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
			sendPostRequest.setHeader(AUTHORIZATION, BASIC + encodedPassword);
			Gson gson = new Gson();
			String jsonString = gson.toJson(confirmCODetailsDto);
			JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
			HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
			try {
				sendPostRequest.setEntity(new StringEntity(jsonObject.toString()));
				httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
						vendor.getTimeOutSeconds(), null);
			} catch (Exception e) {

				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
			}

			if (httpResponseUtil.getHttpResponseCode() == 200
					&& (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {

				saveComAudit(MapperUtil.getJsonString(customerOrderDto), httpResponseUtil.getResponse(), requestTime,
						customerOrderDto.getCOMOrderNo(), ComTypeEnum.CONFIRM_CUSTOMER_ORDER.name());

				coResponseDtoList.add(getResponseData(httpResponseUtil.getResponse(), comOrderNo));

			} else {
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
			}
		}

		return coResponseDtoList;
	}

	private COResponseDto getResponseData(String response, String comOrderNumber) {
		JsonReader reader = new JsonReader(new StringReader(response));
		reader.setLenient(true);
		JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
		COResponseDto coResponseDto = new COResponseDto();
		coResponseDto.setComOrderNumber(comOrderNumber);
		coResponseDto.setRequestId(jsonObject.get(REQUEST_ID).getAsString());
		coResponseDto.setStatus(jsonObject.get(STATUS).getAsString());
		return coResponseDto;

	}

	private void saveComAudit(String request, String response, Date requestTime, String comOrderNumber,
			String comType) {
		ComAuditDao comAuditDao = new ComAuditDao();
		comAuditDao.setComOrderNumber(comOrderNumber);
		comAuditDao.setRequest(request);
		comAuditDao.setResponse(response);
		comAuditDao.setRequestTime(requestTime);
		comAuditDao.setResponseTime(CalendarUtils.getCurrentDate());
		comAuditDao.setComType(comType);
		comAuditRepository.save(comAuditDao);
	}

	@Override
	public List<COResponseDto> confirmInvoiceDetails(List<ConfirmInvoiceDetailsDto> confirmInvoiceDetailsDtoList) {
		VendorDao vendor = validateVendor(VENDOR_CODE);

		List<COResponseDto> coResponseDtoList = new ArrayList<>();

		for (ConfirmInvoiceDetailsDto confirmInvoiceDetailsDto : confirmInvoiceDetailsDtoList) {

			Date requestTime = CalendarUtils.getCurrentDate();

			CustomerOrderVendorDetailsDto customerOrderVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
							CustomerOrderVendorDetailsDto.class));

			UriComponentsBuilder uriBuilder = UriComponentsBuilder
					.fromHttpUrl(vendor.getBaseurl() + customerOrderVendorDetailsDto.getOrderStatusCM());

			String username = customerOrderVendorDetailsDto.getUsername();
			String password = customerOrderVendorDetailsDto.getPassword();
			String basicAuth = username + ":" + password;
			String encodedPassword = new String(Base64.getEncoder().encode(basicAuth.getBytes()));
			HttpPost sendPostRequest = new HttpPost(uriBuilder.toUriString());
			sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
			sendPostRequest.setHeader(AUTHORIZATION, BASIC + encodedPassword);
			Gson gson = new Gson();
			String jsonString = gson.toJson(confirmInvoiceDetailsDto);
			JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();
			HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
			try {
				sendPostRequest.setEntity(new StringEntity(jsonObject.toString()));
				httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
						vendor.getTimeOutSeconds(), null);
			} catch (Exception e) {

				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
			}

			if (httpResponseUtil.getHttpResponseCode() == 200
					&& (httpResponseUtil.getResponse() != null && !httpResponseUtil.getResponse().isEmpty())) {

				saveComAudit(MapperUtil.getJsonString(confirmInvoiceDetailsDto), httpResponseUtil.getResponse(),
						requestTime, confirmInvoiceDetailsDto.getCOMOrderNo(),
						ComTypeEnum.CONFIRM_INVOICE_DETAILS.name());

				coResponseDtoList
						.add(getResponseData(httpResponseUtil.getResponse(), confirmInvoiceDetailsDto.getCOMOrderNo()));

			} else {
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
			}
		}

		return coResponseDtoList;
	}

//	public 	List<COResponseDto> testConfirmInvoiceDetails(List<ConfirmInvoiceDetailsDto> confirmInvoiceDetailsDtoList) {
//
//		if (confirmInvoiceDetailsDtoList.isEmpty()) {
//			throw new ServiceException(INVOICE_DETAILS_CAN_NOT_BE_EMPTY, ERR_INT_099);
//		}
//		List<COResponseDto> response=new ArrayList<>();
//		for (ConfirmInvoiceDetailsDto confirmInvoiceDetailsDto : confirmInvoiceDetailsDtoList) {
//			Date requestTime = CalendarUtils.getCurrentDate();
//
//			VendorDao vendor = validateVendor(VENDOR_CODE);
//
//			CustomerOrderVendorDetailsDto customerOrderVendorDetailsDto = (MapperUtil.getObjectMapperInstance()
//					.convertValue(MapperUtil.mapObjToClass(vendor.getVendorDetails(), JsonData.class).getData(),
//							CustomerOrderVendorDetailsDto.class));
//			String uri = vendor.getBaseurl() + customerOrderVendorDetailsDto.getOrderStatusCM();
//
//			String username = customerOrderVendorDetailsDto.getUsername();
//			String password = customerOrderVendorDetailsDto.getPassword();
//
//			HttpHeaders requestHeaders = new HttpHeaders();
//			requestHeaders.setBasicAuth(username, password);
//			HttpEntity<ConfirmInvoiceDetailsDto> requestEntity = new HttpEntity<ConfirmInvoiceDetailsDto>(
//					confirmInvoiceDetailsDto, requestHeaders);
//			// RestTemplate restTemplate = new RestTemplate();
//			ResponseEntity<Object> responseData = null;
//			try {
//				log.info("inside try  uri: {} ", uri);
//				responseData = restTemplate().exchange(uri, HttpMethod.POST, requestEntity, Object.class);
//			} catch (Exception e) {
//				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e.getMessage());
//			}
//			if (responseData.getStatusCodeValue() == 200 || responseData.getBody() != null) {
//				saveComAudit(MapperUtil.getJsonString(confirmInvoiceDetailsDto),
//						MapperUtil.getJsonString(responseData.getBody()), requestTime,
//						confirmInvoiceDetailsDto.getCOMOrderNo(), ComTypeEnum.CONFIRM_INVOICE_DETAILS.name());
//				response.add(getResponseData(MapperUtil.getJsonString(responseData.getBody()),confirmInvoiceDetailsDto.getCOMOrderNo()));
//			} else {
//				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, SERVICE_UNAVAILBLE);
//			}
//			log.info("String response {}", responseData.getBody());
//			log.info("Status code {}", responseData.getStatusCode());
//		}
//
//		return response;
//	}
//
//
//
//
//	private RestTemplate restTemplate() {
//		TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;
//
//		SSLContext sslContext = null;
//		try {
//			sslContext = org.apache.http.ssl.SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy)
//					.build();
//		} catch (NoSuchAlgorithmException e) {
//			throw new ServiceException(ERR_INT_010, e.getMessage());
//		} catch (KeyManagementException e) {
//			throw new ServiceException(ERR_INT_010, e.getMessage());
//		} catch (KeyStoreException e) {
//			throw new ServiceException(ERR_INT_010, e.getMessage());
//		}
//
//		SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);
//
//		CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(csf).build();
//
//		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
//
//		requestFactory.setHttpClient(httpClient);
//		RestTemplate restTemplate = new RestTemplate(requestFactory);
//		return restTemplate;
//	}

}
