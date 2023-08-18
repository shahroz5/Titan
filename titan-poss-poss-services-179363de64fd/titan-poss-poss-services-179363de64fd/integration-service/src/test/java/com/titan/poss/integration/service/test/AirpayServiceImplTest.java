/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.test;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.function.Executable;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import com.google.gson.JsonObject;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.enums.IntegrationPaymentStatusEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.PaymentCreateResponseDto;
import com.titan.poss.core.dto.PaymentRequestDto;
import com.titan.poss.core.dto.PaymentVerifyResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.PaymentAuditDao;
import com.titan.poss.integration.intg.repository.PaymentAuditRepository;
import com.titan.poss.integration.repository.VendorConfigRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.impl.AirpayServiceImpl;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest({ HttpClientUtil.class, JsonUtils.class, CustomSecurityPrincipal.class, ApplicationPropertiesUtil.class,
		CryptoUtil.class })
@DisplayName("AirpayServiceImpl Test cases")
@PowerMockIgnore({ "javax.management.*", "com.sun.org.apache.xerces.*", "javax.xml.*", "org.xml.*", "org.w3c.dom.*",
		"com.sun.org.apache.xalan.*", "javax.activation.*" })
public class AirpayServiceImplTest {

	@InjectMocks
	private AirpayServiceImpl airpayServiceImpl;

	@org.mockito.Mock
	private VendorConfigRepository vendorConfigRepository;

	@Mock
	private VendorRepository vendorRepository;

	@org.mockito.Mock
	private PaymentAuditRepository paymentAuditRepository;

	private static final String CDATA = "<![CDATA[]]>\r\n";

	@Test
	@DisplayName("(AirpayServiceImplTest) create payment link succesfully")
	public void createPaymentTest() throws IOException {

		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestHttpResponseUtil());

		PaymentCreateResponseDto paymentCreateResponseDto = airpayServiceImpl
				.createPayment(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123", getTestPaymentRequestDto());
		Assert.assertNotNull(paymentCreateResponseDto);
		assertEquals(IntegrationPaymentStatusEnum.CREATED.toString(), paymentCreateResponseDto.getStatus());
	}

	@Test
	@DisplayName("(AirpayServiceImplTest) verify Payment Test succesfully")
	public void verifyPaymentTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestVerifyHttpResponseUtil());

		PaymentVerifyResponseDto paymentVerifyResponseDto = airpayServiceImpl
				.verifyPaymentStatus(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123");
		Assert.assertNotNull(paymentVerifyResponseDto);
		assertEquals(IntegrationPaymentStatusEnum.COMPLETED.toString(),
				paymentVerifyResponseDto.getTransacionStatus().trim());
	}

	@Test
	@DisplayName("(AirpayServiceImplTest) verify Payment Test with exception")
	public void verifyPaymentTestException() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestVerifyHttpResponseUtilException());

		PaymentVerifyResponseDto paymentVerifyResponseDto = airpayServiceImpl
				.verifyPaymentStatus(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123");
		Assert.assertNotNull(paymentVerifyResponseDto);
		assertEquals(IntegrationPaymentStatusEnum.FAILED.toString(),
				paymentVerifyResponseDto.getTransacionStatus().trim());
	}

	@Test
	@DisplayName("(AirpayServiceImplTest) create payment link with exception")
	public void createPaymentTestException() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenThrow(new IOException());
		Executable exec = () -> airpayServiceImpl.createPayment(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123",
				getTestPaymentRequestDto());
		ServiceException exception = assertThrows(ServiceException.class, exec);
		assertEquals("Exception while calling third party api", exception.getMessage());
	}

	@Test
	@DisplayName("(AirpayServiceImplTest) create payment link with token error")
	public void createPaymentTestTokenError() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestHttpResponseUtilWithTokenError());

		PaymentCreateResponseDto paymentCreateResponseDto = airpayServiceImpl
				.createPayment(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123", getTestPaymentRequestDto());
		Assert.assertNotNull(paymentCreateResponseDto);
		Assert.assertEquals("[Token does not match...]", paymentCreateResponseDto.getErrorMessage());
	}

	@Test
	@DisplayName("(AirpayServiceImplTest) create payment link with merchant id error")
	public void createPaymentTestIdError() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestHttpResponseUtilWithIdError());

		PaymentCreateResponseDto paymentCreateResponseDto = airpayServiceImpl
				.createPayment(VendorCodeEnum.PAYMENT_AIRPAY.toString(), "123", getTestPaymentRequestDto());
		Assert.assertNotNull(paymentCreateResponseDto);
		Assert.assertEquals("[Not a valid Merchant Id.]", paymentCreateResponseDto.getErrorMessage());
	}

	/**
	 * @return
	 */
	private PaymentRequestDto getTestPaymentRequestDto() {
		PaymentRequestDto paymentRequestDto = new PaymentRequestDto();
		paymentRequestDto.setAmount("100");
		paymentRequestDto.setCustomerName("Test");
		paymentRequestDto.setEmailId("TestEmail");
		paymentRequestDto.setTransactionId("URB123");
		return paymentRequestDto;
	}

	private void setInitialTestData() {
		String locationCode = "URB";
		VendorConfigDao testVendorConfig = getTestVendorConfig();

		ReflectionTestUtils.setField(ApplicationPropertiesUtil.class, "env", new StandardEnvironment());
		PowerMockito.mockStatic(CustomSecurityPrincipal.class);
		PowerMockito.when(CustomSecurityPrincipal.getSecurityPrincipal()).thenReturn(getTestAuthUser());
		PowerMockito.mockStatic(JsonUtils.class);
		PowerMockito.when(JsonUtils.decryptPasswordInJson(org.mockito.ArgumentMatchers.any()))
				.thenReturn(getTestJsonObject());

		PowerMockito.mockStatic(CryptoUtil.class);
		PowerMockito.when(CryptoUtil.getMd5(org.mockito.ArgumentMatchers.anyString())).thenReturn("token");

		PowerMockito.mockStatic(ApplicationPropertiesUtil.class);
		PowerMockito.when(ApplicationPropertiesUtil.getProperty(org.mockito.ArgumentMatchers.anyString()))
				.thenReturn("property");

		when(vendorRepository.findByVendorCode(org.mockito.ArgumentMatchers.any())).thenReturn(getTestVendor());
		when(paymentAuditRepository.save(org.mockito.ArgumentMatchers.any())).thenReturn(getTestPaymentAudit());
		when(paymentAuditRepository.getMaxSeqNo(locationCode)).thenReturn(0);
		when(vendorConfigRepository.findByVendorVendorCodeAndLocationCodeAndIsActive(
				VendorCodeEnum.PAYMENT_AIRPAY.toString(), locationCode, true)).thenReturn(testVendorConfig);
	}

	private AuthUser getTestAuthUser() {
		List<GrantedAuthority> authorities = new ArrayList<>();
		return new AuthUser("bos", "urb", authorities, "URB", "a", "a", "a");
	}

	/**
	 * @return
	 */
	private PaymentAuditDao getTestPaymentAudit() {
		PaymentAuditDao paymentAudit = new PaymentAuditDao();
		paymentAudit.setSequenceNo(2);
		paymentAudit.setRequestTime(CalendarUtils.getCurrentDate());
		paymentAudit.setUrl("");
		paymentAudit.setVendor(getTestVendor());
		paymentAudit.setTransactionType("");
		paymentAudit.setLocationCode("URB");
		paymentAudit.setRequestTime(CalendarUtils.getCurrentDate());
		paymentAudit.setPaymentId("");
		return paymentAudit;
	}

	private HttpResponseUtil getTestHttpResponseUtil() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("{ \"success\": true,\r\n" + "    \"invoice_number\": \"5678\",\r\n"
				+ "    \"payment_url\": \"https://tanishqposs.invoicepay.co.in/invoice/MTMxMDU4NDg=\"\r\n" + "}");
		return httpResponseUtil;
	}

	private HttpResponseUtil getTestHttpResponseUtilWithTokenError() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse(
				"{\"message\": {\r\n" + "        \"token\": [\r\n" + "            \"Token does not match...\"\r\n"
						+ "        ]\r\n" + "    },\r\n" + "    \"success\": false\r\n" + "}");
		return httpResponseUtil;
	}

	private HttpResponseUtil getTestHttpResponseUtilWithIdError() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse(
				"{\r\n" + "    \"success\": false,\r\n" + "    \"message\": {\r\n" + "        \"invoice_error\": {\r\n"
						+ "            \"MERCHANT_ID\": [\r\n" + "                \"Not a valid Merchant Id.\"\r\n"
						+ "            ]\r\n" + "        }\r\n" + "    }\r\n" + "}");
		return httpResponseUtil;
	}

	private HttpResponseUtil getTestVerifyHttpResponseUtil() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("<?xml version=\"1.0\"?>\r\n" + "<RESPONSE>\r\n" + "<TRANSACTION>\r\n"
				+ "<TRANSACTIONSTATUS>\r\n" + "<![CDATA[200]]>\r\n" + "</TRANSACTIONSTATUS>\r\n" + "<MESSAGE>\r\n"
				+ "<![CDATA[Success]]>\r\n" + "</MESSAGE>\r\n" + "<APTRANSACTIONID>\r\n" + "<![CDATA[358392]]>\r\n"
				+ "</APTRANSACTIONID>\r\n" + "<TRANSACTIONID>\r\n" + "<![CDATA[URB45]]>\r\n" + "</TRANSACTIONID>\r\n"
				+ "<AMOUNT>\r\n" + "<![CDATA[101.00]]>\r\n" + "</AMOUNT>\r\n" + "<ap_SecureHash>\r\n"
				+ "<![CDATA[149039138]]>\r\n" + "</ap_SecureHash>\r\n" + "<AP_SECUREHASH>\r\n" + "<![CDATA[1383]]>\r\n"
				+ "</AP_SECUREHASH>\r\n" + "<CUSTOMVAR>\r\n" + "<![CDATA[1431|INR|100.00]]>\r\n" + "</CUSTOMVAR>\r\n"
				+ "<CARDCOUNTRY>\r\n" + CDATA + "</CARDCOUNTRY>\r\n" + "<CHMOD>\r\n" + "<![CDATA[ppc]]>\r\n"
				+ "</CHMOD>\r\n" + "<CONVERSIONRATE>\r\n" + CDATA + "</CONVERSIONRATE>\r\n" + "<BANKNAME>\r\n"
				+ "<![CDATA[AmazonPay]]>\r\n" + "</BANKNAME>\r\n" + "<CARDISSUER>\r\n" + CDATA + "</CARDISSUER>\r\n"
				+ "<CARDTYPE>\r\n" + CDATA + "</CARDTYPE>\r\n" + "<CUSTOMER>\r\n" + "<![CDATA[ANUSH]]>\r\n"
				+ "</CUSTOMER>\r\n" + "<CUSTOMEREMAIL>\r\n" + "<![CDATA[anushjkini@gmail.com]]>\r\n"
				+ "</CUSTOMEREMAIL>\r\n" + "<CUSTOMERPHONE>\r\n" + "<![CDATA[8105672850]]>\r\n" + "</CUSTOMERPHONE>\r\n"
				+ "<CURRENCYCODE>\r\n" + "<![CDATA[356]]>\r\n" + "</CURRENCYCODE>\r\n" + "<RISK>\r\n"
				+ "<![CDATA[0]]>\r\n" + "</RISK>\r\n" + "<TRANSACTIONTYPE>\r\n" + "<![CDATA[320]]>\r\n"
				+ "</TRANSACTIONTYPE>\r\n" + "<TRANSACTIONTIME>\r\n" + "<![CDATA[02-07-2020 17:04:56]]>\r\n"
				+ "</TRANSACTIONTIME>\r\n" + "<TRANSACTIONPAYMENTSTATUS>\r\n" + "<![CDATA[SUCCESS]]>\r\n"
				+ "</TRANSACTIONPAYMENTSTATUS>\r\n" + "<MERCHANT_NAME>\r\n" + "<![CDATA[Tanishq - Test]]>\r\n"
				+ "</MERCHANT_NAME>\r\n" + "<WALLETBALANCE>\r\n" + CDATA + "</WALLETBALANCE>\r\n" + "<SURCHARGE>\r\n"
				+ CDATA + "</SURCHARGE>\r\n" + "<SETTLEMENT_DATE>\r\n" + CDATA + "</SETTLEMENT_DATE>\r\n"
				+ "<BILLEDAMOUNT>\r\n" + "<![CDATA[120.00]]>\r\n" + "</BILLEDAMOUNT>\r\n" + "<TRANSACTIONREASON>\r\n"
				+ CDATA + "</TRANSACTIONREASON>\r\n" + "<RRN>\r\n" + "<![CDATA[105877]]>\r\n" + "</RRN>\r\n"
				+ "</TRANSACTION>\r\n" + "</RESPONSE>");
		return httpResponseUtil;
	}

	private HttpResponseUtil getTestVerifyHttpResponseUtilException() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("<?xml version=\"1.0\"?>\r\n" + "<RESPONSE>\r\n" + "<TRANSACTION>\r\n"
				+ "<TRANSACTIONSTATUS>\r\n" + "<![CDATA[503]]>\r\n" + "</TRANSACTIONSTATUS>\r\n" + "<MESSAGE>\r\n"
				+ "<![CDATA[Success]]>\r\n" + "</MESSAGE>\r\n" + "<APTRANSACTIONID>\r\n" + "<![CDATA[358392]]>\r\n"
				+ "</APTRANSACTIONID>\r\n" + "<TRANSACTIONID>\r\n" + "<![CDATA[URB45]]>\r\n" + "</TRANSACTIONID>\r\n"
				+ "<AMOUNT>\r\n" + "<![CDATA[100.00]]>\r\n" + "</AMOUNT>\r\n" + "<ap_SecureHash>\r\n"
				+ "<![CDATA[1490391383]]>\r\n" + "</ap_SecureHash>\r\n" + "<AP_SECUREHASH>\r\n"
				+ "<![CDATA[1490391383]]>\r\n" + "</AP_SECUREHASH>\r\n" + "<CUSTOMVAR>\r\n"
				+ "<![CDATA[1431|INR|100.00]]>\r\n" + "</CUSTOMVAR>\r\n" + "<CARDCOUNTRY>\r\n" + CDATA
				+ "</CARDCOUNTRY>\r\n" + "<CHMOD>\r\n" + "<![CDATA[ppc]]>\r\n" + "</CHMOD>\r\n" + "<CONVERSIONRATE>\r\n"
				+ CDATA + "</CONVERSIONRATE>\r\n" + "<BANKNAME>\r\n" + "<![CDATA[AmazonPay]]>\r\n" + "</BANKNAME>\r\n"
				+ "<CARDISSUER>\r\n" + CDATA + "</CARDISSUER>\r\n" + "<CARDTYPE>\r\n" + CDATA + "</CARDTYPE>\r\n"
				+ "<CUSTOMER>\r\n" + "<![CDATA[ANUSH]]>\r\n" + "</CUSTOMER>\r\n" + "<CUSTOMEREMAIL>\r\n"
				+ "<![CDATA[anushjkini@gmail.com]]>\r\n" + "</CUSTOMEREMAIL>\r\n" + "<CUSTOMERPHONE>\r\n"
				+ "<![CDATA[8105672850]]>\r\n" + "</CUSTOMERPHONE>\r\n" + "<CURRENCYCODE>\r\n" + "<![CDATA[356]]>\r\n"
				+ "</CURRENCYCODE>\r\n" + "<RISK>\r\n" + "<![CDATA[0]]>\r\n" + "</RISK>\r\n" + "<TRANSACTIONTYPE>\r\n"
				+ "<![CDATA[320]]>\r\n" + "</TRANSACTIONTYPE>\r\n" + "<TRANSACTIONTIME>\r\n"
				+ "<![CDATA[02-07-2020 17:04:56]]>\r\n" + "</TRANSACTIONTIME>\r\n" + "<TRANSACTIONPAYMENTSTATUS>\r\n"
				+ "<![CDATA[SUCCESS]]>\r\n" + "</TRANSACTIONPAYMENTSTATUS>\r\n" + "<MERCHANT_NAME>\r\n"
				+ "<![CDATA[Tanishq - Test]]>\r\n" + "</MERCHANT_NAME>\r\n" + "<WALLETBALANCE>\r\n" + CDATA
				+ "</WALLETBALANCE>\r\n" + "<SURCHARGE>\r\n" + CDATA + "</SURCHARGE>\r\n" + "<SETTLEMENT_DATE>\r\n"
				+ CDATA + "</SETTLEMENT_DATE>\r\n" + "<BILLEDAMOUNT>\r\n" + "<![CDATA[100.00]]>\r\n"
				+ "</BILLEDAMOUNT>\r\n" + "<TRANSACTIONREASON>\r\n" + CDATA + "</TRANSACTIONREASON>\r\n" + "<RRN>\r\n"
				+ "<![CDATA[105877]]>\r\n" + "</RRN>\r\n" + "</TRANSACTION>\r\n" + "</RESPONSE>");
		return httpResponseUtil;
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode("PAYMENT_AIRPAY");
		vendor.setVendorType("PAYMENT");
		vendor.setVendorName("AIRPAY");
		vendor.setRetryCount(3);
		vendor.setTimeOutSeconds(3);
		vendor.setVendorDetails(
				"{\"type\":\"AIRPAY\",\"data\":{\"CreatePaymentUrl\":\"https://payments.invoicepay.co.in/api/invoice/create\",\"VerifyPaymentUrl\":\"https://payments.airpay.co.in/order/verify.php\"}}");
		return vendor;
	}

	private VendorConfigDao getTestVendorConfig() {
		VendorConfigDao vendorConfig = new VendorConfigDao();
		vendorConfig.setConfigId("F65833D6-1280-4BEF-ADC8-BA47E8E71ABF");
		vendorConfig.setVendor(getTestVendor());
		vendorConfig.setLocationCode("URB");
		vendorConfig.setOrgCode("TJ");
		vendorConfig.setConfigDetails(
				"{\"type\":\"AIRPAY_CONFIG\",\"data\":{\"MerchantId\":\"245186\",\"Username\":\"2953945\",\"Password\":\"15Gh2ieq5Nse1fhBwTARGA==\",\"SecretKey\":\"X44QBa2Y5hsJXMKs\",\"SecretToken\":\"p6Be5Eni7aZRRAh\"}}");
		vendorConfig.setIsActive(true);
		return vendorConfig;
	}

	private JsonObject getTestJsonObject() {
		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("MerchantId", "30153");
		jsonObject.addProperty("Username", "2492121");
		jsonObject.addProperty("Password", "YMBCzandCeWVhU");
		jsonObject.addProperty("Secretkey", "X44QBa2Y5hsJXGMK");
		jsonObject.addProperty("SecretToken", "X44QBa2Y5hsJXGMK");
		return jsonObject;
	}
}
