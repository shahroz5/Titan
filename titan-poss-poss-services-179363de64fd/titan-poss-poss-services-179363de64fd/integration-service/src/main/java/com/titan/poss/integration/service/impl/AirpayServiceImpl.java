/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.io.IOException;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.net.ssl.SSLException;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.Consts;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.execchain.RequestAbortedException;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.enums.IntegrationPaymentStatusEnum;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.AirpayConfigPropertiesDto;
import com.titan.poss.integration.dto.request.AirpayCreatePaymentRequestDto;
import com.titan.poss.integration.dto.request.AirpayCustomerInfoReqeuestDto;
import com.titan.poss.integration.dto.request.AirpaySendRequestDto;
import com.titan.poss.integration.dto.response.AirpayVerifyResponseDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.PaymentAuditDao;
import com.titan.poss.integration.intg.repository.PaymentAuditRepository;
import com.titan.poss.integration.repository.VendorConfigRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.PaymentService;
import com.titan.poss.integration.util.DocumentBuilderUtil;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * The Class AirpayServiceImpl.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("IntegrationAirpayService")
public class AirpayServiceImpl implements PaymentService {

	/** The vendor config repository. */
	@Autowired
	private VendorConfigRepository vendorConfigRepository;

	/** The payment audit repository. */
	@Autowired
	private PaymentAuditRepository paymentAuditRepository;

	@Autowired
	private VendorRepository vendorRepository;

	/** The start index of mobile num to be masked. */
	@Value("${mobilenumber.mask.startIndex}")
	private Integer startIndexOfMobileNumToBeMasked;

	/** The end index of mobile num to be masked. */
	@Value("${mobilenumber.mask.endIndex}")
	private Integer endIndexOfMobileNumToBeMasked;

	/** The Constant CONTENT_TYPE. */
	private static final String CONTENT_TYPE = "Content-Type";

	/** The Constant APPLICATION_URL_ENCODED. */
	private static final String APPLICATION_URL_ENCODED = "application/x-www-form-urlencoded";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";
	private static final String VENDOR_NAME = "vendorName";
	private static final String AIRPAY = "AIRPAY";

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
		String url = getUrl(vendor, "CreatePaymentUrl");
		VendorConfigDao vendorConfig = vendorConfigRepository
				.findByVendorVendorCodeAndLocationCodeAndIsActive(vendorCode, CommonUtil.getLocationCode(), true);
		AirpayConfigPropertiesDto airpayConnectionProperties = getAirpayConnectionProperties(vendorConfig);

		PaymentAuditDao paymentAudit = getInitialPaymentAuditData(url, "CreatePayment", CommonUtil.getLocationCode(),
				vendor, paymentRequestDto.getMobileNumber(), paymentId);
		AirpayCreatePaymentRequestDto airpayCreatePaymentRequest = buildAirpayCreatePaymentDto(
				airpayConnectionProperties, paymentRequestDto, paymentAudit);

		String jsonString = MapperUtil.getJsonString(airpayCreatePaymentRequest);
		String input = airpayConnectionProperties.getSecretToken().replace("\"", "") + "~" + jsonString;
		String token = CryptoUtil.getMd5(input);

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair("token", token));
		form.add(new BasicNameValuePair("data", jsonString));
		form.add(new BasicNameValuePair("format", "json"));
		UrlEncodedFormEntity createRequest = new UrlEncodedFormEntity(form, Consts.UTF_8);

		if (!StringUtils.isEmpty(paymentAudit.getMobileNumber())) {
			paymentAudit.setMobileNumber(MapperUtil.maskString(paymentAudit.getMobileNumber(),
					startIndexOfMobileNumToBeMasked, endIndexOfMobileNumToBeMasked, 'X'));
		}
		paymentAudit.setRequest(MapperUtil.getJsonString(airpayCreatePaymentRequest));
		HttpPost sendPostRequest = getCommonPostRequest(url, createRequest);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException e) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, AIRPAY));
		}

		savePaymentAuditData(paymentAudit, httpResponseUtil.getResponse(), httpResponseUtil.getHttpResponseCode());
		return mapCreateResponseDto(httpResponseUtil.getResponse());
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
		VendorConfigDao vendorConfig = vendorConfigRepository.findByVendorVendorCodeAndLocationCodeAndIsActive(
				vendor.getVendorCode(), CommonUtil.getLocationCode(), true);
		AirpayConfigPropertiesDto airpayConnectionProperties = getAirpayConnectionProperties(vendorConfig);
		String url = getUrl(vendor, "VerifyPaymentUrl");
		String privateKey = createPrivateKey(airpayConnectionProperties);
		PaymentAuditDao paymentAudit = getInitialPaymentAuditData(url, "VerifyPayment", CommonUtil.getLocationCode(),
				vendor, null, null);

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair("mercid", airpayConnectionProperties.getMerchantId().replace("\"", "")));
		form.add(new BasicNameValuePair("merchant_txnId", transactionId));
		form.add(new BasicNameValuePair("privatekey", privateKey));
		UrlEncodedFormEntity createRequest = new UrlEncodedFormEntity(form, Consts.UTF_8);

		paymentAudit.setRequest(MapperUtil.getJsonString(transactionId));
		HttpPost sendPostRequest = getCommonPostRequest(url, createRequest);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | SAXException | ParserConfigurationException e) {
			savePaymentAuditWhenException(paymentAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException("Exception while calling third party api", ERR_INT_010, e);
		}
		AirpayVerifyResponseDto airpayVerifyResponseDto = mapVerifyResponseDto(responseDocument);
		savePaymentAuditData(paymentAudit, MapperUtil.getJsonString(airpayVerifyResponseDto),
				httpResponseUtil.getHttpResponseCode());
		return mapAirpayVerifyResponse(airpayVerifyResponseDto);
	}

	/**
	 * Builds the airpay create payment dto.
	 *
	 * @param airpayConnectionProperties the airpay connection properties
	 * @param amount                     the amount
	 * @param paymentRequestDto          the payment request dto
	 * @param paymentAudit               the payment audit
	 * @return the airpay create payment request dto
	 */
	private AirpayCreatePaymentRequestDto buildAirpayCreatePaymentDto(
			AirpayConfigPropertiesDto airpayConnectionProperties, PaymentRequestDto paymentRequestDto,
			PaymentAuditDao paymentAudit) {

		AirpaySendRequestDto sendRequest = AirpaySendRequestDto.builder()
				.email(!StringUtils.isEmpty(paymentRequestDto.getEmailId()))
				.sms(!StringUtils.isEmpty(paymentRequestDto.getMobileNumber())).build();

		String invoiceNumber = StringUtils.isEmpty(paymentRequestDto.getTransactionId())
				? paymentAudit.getLocationCode() + paymentAudit.getSequenceNo()
				: paymentRequestDto.getTransactionId();

		return AirpayCreatePaymentRequestDto.builder()
				.merchantId(airpayConnectionProperties.getMerchantId().replace("\"", ""))
				.customer(buildCustomerInfoDto(paymentRequestDto)).invoiveNumber(invoiceNumber)
				.totalAmount(paymentRequestDto.getAmount()).sendRequest(sendRequest).build();
	}

	private PaymentVerifyResponseDto mapAirpayVerifyResponse(AirpayVerifyResponseDto airpayVerifyResponse) {
		String status = "";
		if (airpayVerifyResponse.getTransacionStatus().equalsIgnoreCase("200")) {
			status = IntegrationPaymentStatusEnum.COMPLETED.toString();
		} else if (airpayVerifyResponse.getTransacionStatus().equalsIgnoreCase("400")) {
			status = IntegrationPaymentStatusEnum.FAILED.toString();
		} else if (airpayVerifyResponse.getTransacionStatus().equalsIgnoreCase("211")) {
			status = IntegrationPaymentStatusEnum.IN_PROGRESS.toString();
		} else {
			status = IntegrationPaymentStatusEnum.CREATED.toString();
		}
		return PaymentVerifyResponseDto.builder().transacionStatus(status)
				.vendorPaymentId(airpayVerifyResponse.getVendorPaymentId())
				.transactionId(airpayVerifyResponse.getTransactionId()).amount(airpayVerifyResponse.getAmount())
				.paymentCode(airpayVerifyResponse.getPaymentCode())
				.responseMesssage(airpayVerifyResponse.getResponseMesssage()).build();
	}

	private AirpayCustomerInfoReqeuestDto buildCustomerInfoDto(PaymentRequestDto paymentRequestDto) {
		return AirpayCustomerInfoReqeuestDto.builder().firstName(paymentRequestDto.getCustomerName())
				.emailId(paymentRequestDto.getEmailId()).phone(paymentRequestDto.getMobileNumber()).build();
	}

	/**
	 * Gets the airpay connection properties.
	 *
	 * @param vendorConfig the vendor config
	 * @return the airpay connection properties
	 */
	private AirpayConfigPropertiesDto getAirpayConnectionProperties(VendorConfigDao vendorConfig) {
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(vendorConfig.getConfigDetails()), JsonData.class);
		AirpayConfigPropertiesDto airpayConfigPropertiesDto = MapperUtil.mapObjToClass(jsonData.getData(),
				AirpayConfigPropertiesDto.class);
		airpayConfigPropertiesDto.setPassword(
				CryptoUtil.decrypt(airpayConfigPropertiesDto.getPassword(), CommonConstants.PASS_WORD, false));

		return airpayConfigPropertiesDto;
	}

	/**
	 * Map verify response dto.
	 *
	 * @param verifyStatusDoc the verify status doc
	 * @return the payment verify response dto
	 */
	private AirpayVerifyResponseDto mapVerifyResponseDto(Document verifyStatusDoc) {

		return AirpayVerifyResponseDto.builder()
				.transacionStatus(
						checkIfElementExists(verifyStatusDoc.getElementsByTagName("TRANSACTIONSTATUS").item(0)))
				.message(checkIfElementExists(verifyStatusDoc.getElementsByTagName("MESSAGE").item(0)))
				.vendorPaymentId(checkIfElementExists(verifyStatusDoc.getElementsByTagName("APTRANSACTIONID").item(0)))
				.transactionId(checkIfElementExists(verifyStatusDoc.getElementsByTagName("TRANSACTIONID").item(0)))
				.amount(checkIfElementExists(verifyStatusDoc.getElementsByTagName("AMOUNT").item(0)))
				.vendorSecureHash(checkIfElementExists(verifyStatusDoc.getElementsByTagName("AP_SECUREHASH").item(0)))
				.customerVar(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CUSTOMVAR").item(0)))
				.cardCountry(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CARDCOUNTRY").item(0)))
				.paymentCode(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CHMOD").item(0)))
				.conversionRate(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CONVERSIONRATE").item(0)))
				.bankName(checkIfElementExists(verifyStatusDoc.getElementsByTagName("BANKNAME").item(0)))
				.cardIssuer(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CARDISSUER").item(0)))
				.cardType(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CARDTYPE").item(0)))
				.customer(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CUSTOMER").item(0)))
				.customerEmail(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CUSTOMEREMAIL").item(0)))
				.customerPhone(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CUSTOMERPHONE").item(0)))
				.currencyCode(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CURRENCYCODE").item(0)))
				.risk(checkIfElementExists(verifyStatusDoc.getElementsByTagName("RISK").item(0)))
				.transactionType(checkIfElementExists(verifyStatusDoc.getElementsByTagName("TRANSACTIONTYPE").item(0)))
				.transactionTime(checkIfElementExists(verifyStatusDoc.getElementsByTagName("TRANSACTIONTIME").item(0)))
				.cardNumber(checkIfElementExists(verifyStatusDoc.getElementsByTagName("CARD_NUMBER").item(0)))
				.responseMesssage(
						checkIfElementExists(verifyStatusDoc.getElementsByTagName("TRANSACTIONPAYMENTSTATUS").item(0)))
				.merchantName(checkIfElementExists(verifyStatusDoc.getElementsByTagName("MERCHANT_NAME").item(0)))
				.walletBalance(checkIfElementExists(verifyStatusDoc.getElementsByTagName("WALLETBALANCE").item(0)))
				.surcharge(checkIfElementExists(verifyStatusDoc.getElementsByTagName("SURCHARGE").item(0)))
				.settlementDate(checkIfElementExists(verifyStatusDoc.getElementsByTagName("SETTLEMENT_DATE").item(0)))
				.billedAmount(checkIfElementExists(verifyStatusDoc.getElementsByTagName("BILLEDAMOUNT").item(0)))
				.failureReason(checkIfElementExists(verifyStatusDoc.getElementsByTagName("TRANSACTIONREASON").item(0)))
				.rrNumber(checkIfElementExists(verifyStatusDoc.getElementsByTagName("RRN").item(0))).build();
	}

	/**
	 * check if there is data in the node otherwise returns null
	 * 
	 * @param item
	 * @return
	 */
	private String checkIfElementExists(Node node) {
		if (node != null) {
			return node.getTextContent().trim();
		}
		return null;
	}

	/**
	 * Map create response dto.
	 *
	 * @param response the response
	 * @return the payment create response dto
	 */
	private PaymentCreateResponseDto mapCreateResponseDto(String response) {

		JsonObject jsonObject = new JsonParser().parse(response).getAsJsonObject();
		String status = jsonObject.get("success").toString().equalsIgnoreCase("true")
				? IntegrationPaymentStatusEnum.CREATED.toString()
				: IntegrationPaymentStatusEnum.FAILED.toString();
		if (status.equalsIgnoreCase("failed")) {
			return PaymentCreateResponseDto.builder().status(status).errorMessage(getErrorMessage(jsonObject)).build();
		} else {
			return PaymentCreateResponseDto.builder().status(status)
					.transactionId(jsonObject.get("invoice_number").toString().replace("\"", ""))
					.paymentUrl(jsonObject.get("payment_url").toString().replace("\"", "")).build();
		}
	}

	/**
	 * Gets the error message from airpay create payment response.
	 *
	 * @param jsonObject the json object
	 * @return the error message
	 */
	private String getErrorMessage(JsonObject jsonObject) {

		JsonObject errorObject = jsonObject.get("message").getAsJsonObject();
		JsonElement error;
		String errorMessage = null;
		error = errorObject.get("invoice_error");
		if (error != null) {
			JsonObject invoiceErrorObject = errorObject.get("invoice_error").getAsJsonObject();
			if (invoiceErrorObject != null) {
				JsonElement invErr = invoiceErrorObject.get("INVOICE_NUMBER");
				if (invErr != null) {
					errorMessage = invErr.toString().replace("\"", "");
				}
				JsonElement merchantErr = invoiceErrorObject.get("MERCHANT_ID");
				if (merchantErr != null) {
					errorMessage = merchantErr.toString().replace("\"", "");
				}
			}
		}
		error = errorObject.get("token");
		if (error != null) {
			errorMessage = error.toString().replace("\"", "");
		}
		return errorMessage;
	}

	/**
	 * Gets the common post request.
	 *
	 * @param url    the url
	 * @param entity the entity
	 * @return the common post request
	 */
	private HttpPost getCommonPostRequest(String url, StringEntity entity) {
		HttpPost postRequest = new HttpPost(url);
		postRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		postRequest.setEntity(entity);
		return postRequest;
	}

	/**
	 * Gets the url. The url's of create and verify api is stored in json field.
	 *
	 * @param vendor  the vendor
	 * @param urlName the url name
	 * @return the url
	 */
	private String getUrl(VendorDao vendor, String urlName) {
		JsonObject jsonObject = new JsonParser().parse(vendor.getVendorDetails()).getAsJsonObject();
		return jsonObject.getAsJsonObject("data").get(urlName).getAsString();
	}

	/**
	 * Creates the private key. This key is required for the verify payment status
	 * api of airpay.
	 *
	 * @param airpayConfigPropertiesDto the airpay connection properties dto
	 * @return the string
	 */
	private String createPrivateKey(AirpayConfigPropertiesDto airpayConfigPropertiesDto) {
		String secretKey = airpayConfigPropertiesDto.getSecretKey().replace("\"", "");
		String userName = airpayConfigPropertiesDto.getUsername().replace("\"", "");
		String password = airpayConfigPropertiesDto.getPassword();
		String input = secretKey + "@" + userName + ":|:" + password;
		return buildPrivateKey(input);
	}

	/**
	 * Builds the private key which is required for verifying the payment status
	 * api. This is the logic given by Airay. Please refer airpay documents for more
	 * details.
	 *
	 * @param input the input
	 * @return the string
	 */
	private String buildPrivateKey(String input) {
		String privateKey = "";
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			md.update(input.getBytes());
			byte[] byteData = md.digest();
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < byteData.length; i++) {
				sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
			}
			privateKey = sb.toString();
		} catch (NoSuchAlgorithmException e) {
			throw new ServiceException("Exception while building the private key", "ERR-INT-018");
		}
		return privateKey;
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
		responseJson.setType("Airpay");
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
		throw new ServiceException("wrong api", "", "Airpay does not support this api");
	}

}
