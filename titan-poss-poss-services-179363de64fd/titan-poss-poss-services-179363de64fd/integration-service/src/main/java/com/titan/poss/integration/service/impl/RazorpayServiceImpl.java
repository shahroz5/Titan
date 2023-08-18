/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;

import javax.net.ssl.SSLException;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.execchain.RequestAbortedException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amazonaws.http.apache.request.impl.HttpGetWithBody;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.enums.IntegrationPaymentStatusEnum;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.RazorpayConfigDto;
import com.titan.poss.integration.dto.request.RazaorpayBaseRequestDto;
import com.titan.poss.integration.dto.request.RazorpayCheckoutRequestDto;
import com.titan.poss.integration.dto.request.RazorpayCreateRequestDto;
import com.titan.poss.integration.dto.request.RazorpayCustomerDto;
import com.titan.poss.integration.dto.request.RazorpayNotifyRequestDto;
import com.titan.poss.integration.dto.request.RazorpayRequestOptionsDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.dto.response.RazorpayOrderPaymentsResponseDto;
import com.titan.poss.integration.dto.response.RazorpayResponseDto;
import com.titan.poss.integration.intg.dao.PaymentAuditDao;
import com.titan.poss.integration.intg.repository.PaymentAuditRepository;
import com.titan.poss.integration.repository.VendorConfigRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.PaymentService;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class RazorpayServiceImpl implements PaymentService {

	/** The payment audit repository. */
	@Autowired
	private PaymentAuditRepository paymentAuditRepository;

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private VendorConfigRepository vendorConfigRepository;

	/** The start index of mobile num to be masked. */
	@Value("${mobilenumber.mask.startIndex}")
	private Integer startIndexOfMobileNumToBeMasked;

	/** The end index of mobile num to be masked. */
	@Value("${mobilenumber.mask.endIndex}")
	private Integer endIndexOfMobileNumToBeMasked;

	private static final String ERR_INT_010 = "ERR-INT-010";

	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";

	private static final String CONTENT_TYPE = "Content-Type";

	private static final String APPLICATION_JSON = "application/json";

	private static final String RAZORPAY = "RAZORPAY";

	private static final String VENDOR_NAME = "vendorName";

	/**
	 * Creates the payment.
	 *
	 * @param vendor            the vendor
	 * @param amount            the amount
	 * @param paymentId         the payment id
	 * @param paymentRequestDto the payment request dto
	 * @return the payment create response dto
	 */
	@Override
	public PaymentCreateResponseDto createPayment(String vendorCode, String paymentId,
			PaymentRequestDto paymentRequestDto) {

		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);

		String url = vendor.getBaseurl();
		RazorpayConfigDto razorPayConfig = getRazorPayConfig(vendor);
		PaymentAuditDao paymentAudit = getInitialPaymentAuditData(url, "CreatePayment", CommonUtil.getLocationCode(),
				vendor, paymentRequestDto.getMobileNumber(), paymentId);

		RazorpayCreateRequestDto razorpayCreatePaymentDto = buildRazorpayCreatePaymentDto(razorPayConfig,
				paymentRequestDto, paymentAudit.getLocationCode() + paymentAudit.getSequenceNo(), vendorCode);

		if (!StringUtils.isEmpty(paymentAudit.getMobileNumber())) {
			paymentAudit.setMobileNumber(MapperUtil.maskString(paymentAudit.getMobileNumber(),
					startIndexOfMobileNumToBeMasked, endIndexOfMobileNumToBeMasked, 'X'));
		}
		paymentAudit.setRequest(MapperUtil.getJsonString(razorpayCreatePaymentDto));
		HttpPost sendPostRequest = getCommonPostRequest(url, MapperUtil.getJsonString(razorpayCreatePaymentDto));

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), getBasicAuth(razorPayConfig));
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException e) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, RAZORPAY));
		}
		savePaymentAuditData(paymentAudit, httpResponseUtil.getResponse(), httpResponseUtil.getHttpResponseCode());
		RazorpayResponseDto razorpayCreateResponseDto = mapRazorpayResponseDto(httpResponseUtil.getResponse(),
				httpResponseUtil.getHttpResponseCode());

		return mapPaymentCreateResponseDto(razorpayCreateResponseDto);
	}

	/**
	 * @param razorpayResponseDto
	 * @return
	 */
	private PaymentCreateResponseDto mapPaymentCreateResponseDto(RazorpayResponseDto razorpayResponseDto) {
		String status = "";
		if (razorpayResponseDto.getStatus().equalsIgnoreCase("created")) {
			status = IntegrationPaymentStatusEnum.CREATED.toString();
		} else if (razorpayResponseDto.getStatus().equalsIgnoreCase("paid")) {
			status = IntegrationPaymentStatusEnum.COMPLETED.toString();
		} else {
			status = IntegrationPaymentStatusEnum.FAILED.toString();
		}
		String errorMessage = razorpayResponseDto.getErrorMessage() == null ? null
				: razorpayResponseDto.getErrorMessage().replace("\"", "");
		return PaymentCreateResponseDto.builder().status(status).transactionId(razorpayResponseDto.getId())
				.paymentUrl(razorpayResponseDto.getShortUrl()).errorMessage(errorMessage).build();
	}

	/**
	 * Verify payment status.
	 *
	 * @param vendor        the vendor
	 * @param transactionId the transaction id
	 * @return the payment verify response dto
	 */
	@Override
	public PaymentVerifyResponseDto verifyPaymentStatus(String vendorCode, String transactionId) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		String url = vendor.getBaseurl() + transactionId;
		PaymentAuditDao paymentAudit = getInitialPaymentAuditData(url, "VerifyPayment", CommonUtil.getLocationCode(),
				vendor, null, null);
		RazorpayConfigDto razorPayConfig = getRazorPayConfig(vendor);
		paymentAudit.setRequest(MapperUtil.getJsonString(transactionId));

		HttpGetWithBody sendGetRequest = getCommonGetRequest(url,
				MapperUtil.getJsonString(getRazaorpayBaseRequestDto(vendorCode)));

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendGetRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), getBasicAuth(razorPayConfig));
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException e) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, RAZORPAY));
		}
		RazorpayResponseDto razorpayCreateResponseDto = mapRazorpayResponseDto(httpResponseUtil.getResponse(),
				httpResponseUtil.getHttpResponseCode());
		savePaymentAuditData(paymentAudit, MapperUtil.getJsonString(razorpayCreateResponseDto),
				httpResponseUtil.getHttpResponseCode());
		
		if (!razorpayCreateResponseDto.getStatus().equalsIgnoreCase("paid")
				&& !StringUtils.isEmpty(razorpayCreateResponseDto.getOrderId())
				){
			String fetchOrderPaymentsUrl = razorPayConfig.getFetchOrderPaymentsUrl() + razorpayCreateResponseDto.getOrderId() + "/payments";
			
			HttpGetWithBody sendFetchOrderPaymentsGetRequest = getCommonGetRequest(fetchOrderPaymentsUrl,
					MapperUtil.getJsonString(getRazaorpayBaseRequestDto(vendorCode)));
			
			HttpResponseUtil fetchOrderPaymentsHttpResponseUtil = new HttpResponseUtil();
			try {
				fetchOrderPaymentsHttpResponseUtil = HttpClientUtil.sendHttpRequest(sendFetchOrderPaymentsGetRequest, vendor.getRetryCount(),
						vendor.getTimeOutSeconds(), getBasicAuth(razorPayConfig));
			} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
					| SocketTimeoutException ex) {
				savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), ex);
				throwConnectionTimedoutException(ex);
			} catch (IOException e) {
				savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), e);
				throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, RAZORPAY));
			}
			
			JsonObject jsonObject = new JsonParser().parse(fetchOrderPaymentsHttpResponseUtil.getResponse()).getAsJsonObject();
			if (fetchOrderPaymentsHttpResponseUtil.getHttpResponseCode() == 200) {
				Integer paymentCount = jsonObject.get("count").getAsInt();
				if (paymentCount > 0) {
					JsonArray itemsArray = jsonObject.get("items").getAsJsonArray();
					RazorpayOrderPaymentsResponseDto razorpayOrderPaymentsResponseDto = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(itemsArray.get(paymentCount - 1).toString()),
						RazorpayOrderPaymentsResponseDto.class);
					razorpayCreateResponseDto.setErrorCode(razorpayOrderPaymentsResponseDto.getErrorCode());
					razorpayCreateResponseDto.setErrorMessage(razorpayOrderPaymentsResponseDto.getErrorDescription());
				}
				
			} else {
				JsonObject errorObject = jsonObject.get("error").getAsJsonObject();
				razorpayCreateResponseDto.setErrorCode(errorObject.get("code").toString());
				razorpayCreateResponseDto.setErrorMessage(errorObject.get("description").toString());
			}
			
		}
		
		return mapPaymentVerifyResponseDto(razorpayCreateResponseDto);
	}

	private RazaorpayBaseRequestDto getRazaorpayBaseRequestDto(String vendorCode) {
		VendorConfigDao vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCodeAndIsActive(vendorCode, CommonUtil.getLocationCode(), true);
		if (vendorConfig == null || vendorConfig.getConfigDetails() == null) {
			throw new ServiceException("No razorpay config found for location: " + CommonUtil.getLocationCode(),
					"ERR-INT-080");
		}
		JSONObject obj = new JSONObject(vendorConfig.getConfigDetails());
		String accountId = obj.getJSONObject("data").getString("accountId");
		RazaorpayBaseRequestDto razorpayBaseRequestDto = new RazaorpayBaseRequestDto();
		razorpayBaseRequestDto.setAccountId(accountId);
		return razorpayBaseRequestDto;
	}

	private RazorpayCreateRequestDto buildRazorpayCreatePaymentDto(RazorpayConfigDto razorPayConfig,
			PaymentRequestDto paymentRequestDto, String referenceId, String vendorCode) {

		RazorpayCustomerDto customer = RazorpayCustomerDto.builder().name(paymentRequestDto.getCustomerName())
				.email(paymentRequestDto.getEmailId()).contact(paymentRequestDto.getMobileNumber()).build();

		RazorpayNotifyRequestDto notify = RazorpayNotifyRequestDto.builder()
				.email(!StringUtils.isEmpty(paymentRequestDto.getEmailId()))
				.sms(!StringUtils.isEmpty(paymentRequestDto.getMobileNumber())).build();

		Integer expireBy = razorPayConfig.getExpireTimeInMin();
		LocalDateTime localDateTime = LocalDateTime.now().plusMinutes(expireBy);
		long expireByEpochTime = CalendarUtils.convertLocalDateTimeToEpoch(localDateTime);

		// multiplying by 100 as per razor pay logic
		BigDecimal amount = new BigDecimal(paymentRequestDto.getAmount()).multiply(new BigDecimal("100"));
		RazorpayCreateRequestDto razorpayCreateRequestDto = new RazorpayCreateRequestDto();
		razorpayCreateRequestDto.setAmount(amount.intValue());
		razorpayCreateRequestDto.setCurrency(paymentRequestDto.getCurrency());
		razorpayCreateRequestDto.setCustomer(customer);
		razorpayCreateRequestDto.setExpireBy(expireByEpochTime);
		razorpayCreateRequestDto.setReferenceId(referenceId);
		razorpayCreateRequestDto.setNotify(notify);
		razorpayCreateRequestDto
				.setOptions(new RazorpayRequestOptionsDto(new RazorpayCheckoutRequestDto(razorPayConfig.getName())));
		razorpayCreateRequestDto.setAccountId(getRazaorpayBaseRequestDto(vendorCode).getAccountId());

		return razorpayCreateRequestDto;
	}

	/**
	 * Gets the razorpay connection properties.
	 *
	 * @param vendor the vendor
	 * @return the razor pay config
	 */
	private RazorpayConfigDto getRazorPayConfig(VendorDao vendor) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendor.getVendorDetails()), JsonData.class);
		return MapperUtil.mapObjToClass(jsonData.getData(), RazorpayConfigDto.class);
	}

	/**
	 * Map verify response dto.
	 * 
	 * @param razorpayResponseDto
	 *
	 * @param verifyStatusDoc     the verify status doc
	 * @return the payment verify response dto
	 */
	private PaymentVerifyResponseDto mapPaymentVerifyResponseDto(RazorpayResponseDto razorpayResponseDto) {

		String status = "";
		String errorCode = null;
		String responseMessage = null;
		if (razorpayResponseDto.getStatus().equalsIgnoreCase("paid")) {
			status = IntegrationPaymentStatusEnum.COMPLETED.toString();
			responseMessage = razorpayResponseDto.getPayments() == null || razorpayResponseDto.getPayments().isEmpty()
					? null
					: razorpayResponseDto.getPayments().get(0).getStatus();
		} else if (razorpayResponseDto.getStatus().equalsIgnoreCase("created")) {
			if (!StringUtils.isEmpty(razorpayResponseDto.getErrorCode())
					&& !StringUtils.isEmpty(razorpayResponseDto.getErrorMessage())) {
				status = IntegrationPaymentStatusEnum.FAILED.toString();
				errorCode = razorpayResponseDto.getErrorCode().trim().replace("\"", "");
				responseMessage = razorpayResponseDto.getErrorMessage().trim().replace("\"", "");
			} else {
				status = IntegrationPaymentStatusEnum.CREATED.toString();
				responseMessage = razorpayResponseDto.getPayments() == null || razorpayResponseDto.getPayments().isEmpty()
						? null
						: razorpayResponseDto.getPayments().get(0).getStatus();
			}
		} else {
			status = IntegrationPaymentStatusEnum.FAILED.toString();
			errorCode = razorpayResponseDto.getErrorCode() == null || razorpayResponseDto.getErrorCode().isEmpty()
					? null
					: razorpayResponseDto.getErrorCode().trim().replace("\"", "");
			responseMessage = razorpayResponseDto.getErrorMessage() == null || razorpayResponseDto.getErrorMessage().isEmpty()
					? null
					: razorpayResponseDto.getErrorMessage().trim().replace("\"", "");
		}
		String paymentCode = razorpayResponseDto.getPayments() == null || razorpayResponseDto.getPayments().isEmpty()
				? null
				: razorpayResponseDto.getPayments().get(0).getMethod();
		String paymentVendorId = razorpayResponseDto.getPayments() == null || razorpayResponseDto.getPayments().isEmpty()
				? null
				: razorpayResponseDto.getPayments().get(0).getPaymentId();
		String amount = razorpayResponseDto.getAmount() == null ? null
				: String.valueOf(razorpayResponseDto.getAmount() / 100);
		return PaymentVerifyResponseDto.builder().transacionStatus(status)
				.vendorPaymentId(paymentVendorId).transactionId(razorpayResponseDto.getId())
				.amount(amount).paymentCode(paymentCode).errorCode(errorCode).responseMesssage(responseMessage).build();
	}

	/**
	 * Map create response dto.
	 *
	 * @param response the response
	 * @return the payment create response dto
	 */
	private RazorpayResponseDto mapRazorpayResponseDto(String response, Integer responseCode) {
		JsonObject jsonObject = new JsonParser().parse(response).getAsJsonObject();
		if (responseCode == 200) {
			return MapperUtil.getObjectMapperInstance().convertValue(MapperUtil.getJsonFromString(response),
					RazorpayResponseDto.class);
		} else {
			JsonObject errorObject = jsonObject.get("error").getAsJsonObject();
			return RazorpayResponseDto.builder().status("FAILED")
					.errorMessage(errorObject.get("description").toString()).build();
		}
	}

	private boolean mapRazorpayResendResponseDto(String response) {
		JsonObject jsonObject = new JsonParser().parse(response).getAsJsonObject();
		return jsonObject.get("success").getAsBoolean();
	}

	/**
	 * Gets the common post request.
	 *
	 * @param url    the url
	 * @param entity the entity
	 * @return the common post request
	 */
	private HttpPost getCommonPostRequest(String url, String entity) {
		HttpPost postRequest = new HttpPost(url);
		postRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);

		if (!StringUtils.isEmpty(entity)) {
			try {
				postRequest.setEntity(new StringEntity(entity));
			} catch (UnsupportedEncodingException e) {
				throw new ServiceException("Exception while creating entity", "ERR-INT-079",
						"Exception while creating String entity");
			}
		}
		return postRequest;
	}

	private HttpGetWithBody getCommonGetRequest(String url, String entity) {
		HttpGetWithBody getRequest = new HttpGetWithBody(url);
		getRequest.addHeader(CONTENT_TYPE, APPLICATION_JSON);
		if (!StringUtils.isEmpty(entity)) {
			try {
				getRequest.setEntity(new StringEntity(entity));
			} catch (UnsupportedEncodingException e) {
				throw new ServiceException("Exception while creating entity", "ERR-INT-079",
						"Exception while creating String entity");
			}
		}
		return getRequest;
	}

	private String getBasicAuth(RazorpayConfigDto razorPayConfig) {
		String auth = razorPayConfig.getKeyId() + ":" + razorPayConfig.getKeySecret();
		return new String(Base64.encodeBase64(auth.getBytes(StandardCharsets.ISO_8859_1)));
	}

	/**
	 * Gets the initial payment audit data which is required to get the invoice
	 * number.
	 *
	 * @param url             the url
	 * @param transactionType the transaction type
	 * @param locationCode    the location code
	 * @param vendor          the vendor
	 * @param mobileNumber    the mobile number
	 * @param paymentId       the payment id
	 * @return the initial payment audit dao data
	 */
	private PaymentAuditDao getInitialPaymentAuditData(String url, String transactionType, String locationCode,
			VendorDao vendor, String mobileNumber, String paymentId) {

		PaymentAuditDao paymentAudit = new PaymentAuditDao();
		Integer maxSeqNo = paymentAuditRepository.getMaxSeqNo(locationCode);
		paymentAudit.setSequenceNo(++maxSeqNo);
		paymentAudit.setRequestTime(CalendarUtils.getCurrentDate());
		paymentAudit.setUrl(url);
		paymentAudit.setVendor(vendor);
		paymentAudit.setTransactionType(transactionType);
		paymentAudit.setLocationCode(locationCode);
		paymentAudit.setRequestTime(CalendarUtils.getCurrentDate());
		paymentAudit.setPaymentId(paymentId);
		if (!StringUtils.isEmpty(mobileNumber)) {
			paymentAudit.setMobileNumber(MapperUtil.maskString(mobileNumber, startIndexOfMobileNumToBeMasked,
					endIndexOfMobileNumToBeMasked, 'X'));
		}
		return paymentAuditRepository.save(paymentAudit);
	}

	/**
	 * Save payment audit data.
	 *
	 * @param paymentAudit     the payment audit
	 * @param response         the response
	 * @param httpResponseCode the http response code
	 */
	private void savePaymentAuditData(PaymentAuditDao paymentAudit, String response, Integer httpResponseCode) {
		JsonData responseJson = new JsonData();
		responseJson.setType("Razorpay");
		responseJson.setData(response);
		paymentAudit.setResponse(
				MapperUtil.getJsonString(responseJson).replace("\\", "").replace("\"{", "{").replace("}\"", "}"));
		paymentAudit.setResponseTime(CalendarUtils.getCurrentDate());
		paymentAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - paymentAudit.getRequestTime().getTime());
		paymentAudit.setHttpStatus(httpResponseCode);
		paymentAudit.setTransactionStatus(true);
		paymentAuditRepository.save(paymentAudit);
	}

	/**
	 * Save payment audit data when exception.
	 *
	 * @param paymentAudit     the payment audit
	 * @param httpResponseCode the http response code
	 * @param e                the e
	 */
	private void savePaymentAuditWhenException(PaymentAuditDao paymentAudit, Integer httpResponseCode, Exception e) {

		paymentAudit.setHttpStatus(httpResponseCode);
		paymentAudit.setTransactionStatus(false);
		paymentAudit.setResponseTime(CalendarUtils.getCurrentDate());
		paymentAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - paymentAudit.getRequestTime().getTime());
		paymentAudit.setResponse(e.getMessage());
		paymentAuditRepository.save(paymentAudit);
	}

	private void throwConnectionTimedoutException(Exception ex) {
		throw new ServiceException("Connection timed out, Please try again", "ERR-INT-038", ex);
	}

	@Override
	public boolean resendPaymentRequest(String vendorCode, String transactionId, String notifyBy) {

		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		String url = vendor.getBaseurl() + transactionId + "/" + "notify_by" + "/" + notifyBy;
		RazorpayConfigDto razorPayConfig = getRazorPayConfig(vendor);
		PaymentAuditDao paymentAudit = getInitialPaymentAuditData(url, "ResendPayment", CommonUtil.getLocationCode(),
				vendor, null, null);

		if (!StringUtils.isEmpty(paymentAudit.getMobileNumber())) {
			paymentAudit.setMobileNumber(MapperUtil.maskString(paymentAudit.getMobileNumber(),
					startIndexOfMobileNumToBeMasked, endIndexOfMobileNumToBeMasked, 'X'));
		}
		paymentAudit.setRequest(transactionId);
		HttpPost sendPostRequest = getCommonPostRequest(url,
				MapperUtil.getJsonString(getRazaorpayBaseRequestDto(vendorCode)));

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), getBasicAuth(razorPayConfig));
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException e) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, RAZORPAY));
		}
		savePaymentAuditData(paymentAudit, httpResponseUtil.getResponse(), httpResponseUtil.getHttpResponseCode());
		return mapRazorpayResendResponseDto(httpResponseUtil.getResponse());

	}

}
