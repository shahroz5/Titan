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
import com.titan.poss.integration.service.impl.RazorpayServiceImpl;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RunWith(PowerMockRunner.class)
@PrepareForTest({ HttpClientUtil.class, JsonUtils.class, CustomSecurityPrincipal.class, ApplicationPropertiesUtil.class,
		CryptoUtil.class })
@DisplayName("RazorpayServiceImpl Test cases")
@PowerMockIgnore({ "javax.management.*", "com.sun.org.apache.xerces.*", "javax.xml.*", "org.xml.*", "org.w3c.dom.*",
		"com.sun.org.apache.xalan.*", "javax.activation.*" })
public class RazorpayServiceImplTest {

	@InjectMocks
	private RazorpayServiceImpl razorpayServiceImpl;

	@org.mockito.Mock
	private VendorConfigRepository vendorConfigRepository;

	@Mock
	private VendorRepository vendorRepository;

	@org.mockito.Mock
	private PaymentAuditRepository paymentAuditRepository;

	@Test
	@DisplayName("(RazorpayServiceImplTest) create payment link succesfully")
	public void createPaymentTest() throws IOException {

		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestHttpResponseUtil());

		PaymentCreateResponseDto paymentCreateResponseDto = razorpayServiceImpl
				.createPayment(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), "123", getTestPaymentRequestDto());
		Assert.assertNotNull(paymentCreateResponseDto);
		assertEquals(IntegrationPaymentStatusEnum.CREATED.toString(), paymentCreateResponseDto.getStatus());
	}

	@Test
	@DisplayName("(RazorpayServiceImplTest) verify Payment Test succesfully")
	public void verifyPaymentCompletedTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestVerifyCompletedHttpResponseUtil());

		PaymentVerifyResponseDto paymentVerifyResponseDto = razorpayServiceImpl
				.verifyPaymentStatus(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), "123");
		Assert.assertNotNull(paymentVerifyResponseDto);
		assertEquals(IntegrationPaymentStatusEnum.COMPLETED.toString(),
				paymentVerifyResponseDto.getTransacionStatus().trim());
	}

	@Test
	@DisplayName("(RazorpayServiceImplTest) verify Payment Test failure")
	public void verifyPaymentCreatedTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestVerifyCreateHttpResponseUtil());

		PaymentVerifyResponseDto paymentVerifyResponseDto = razorpayServiceImpl
				.verifyPaymentStatus(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), "123");
		Assert.assertNotNull(paymentVerifyResponseDto);
		assertEquals(IntegrationPaymentStatusEnum.CREATED.toString(),
				paymentVerifyResponseDto.getTransacionStatus().trim());
	}

	@Test
	@DisplayName("(RazorpayServiceImplTest) resend Payment Test succesfully")
	public void resendPaymentTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestResendHttpResponseUtil());

		boolean resendPaymentRequest = razorpayServiceImpl
				.resendPaymentRequest(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), "123", "email");
		assertEquals(true, resendPaymentRequest);
	}

	@Test
	@DisplayName("(RazorpayServiceImplTest) verify Payment Test with exception")
	public void verifyPaymentTestException() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestVerifyHttpResponseUtilException());

		PaymentVerifyResponseDto paymentVerifyResponseDto = razorpayServiceImpl
				.verifyPaymentStatus(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), "123");
		Assert.assertNotNull(paymentVerifyResponseDto);
		assertEquals(IntegrationPaymentStatusEnum.FAILED.toString(),
				paymentVerifyResponseDto.getTransacionStatus().trim());
	}

	@Test
	@DisplayName("(RazorpayServiceImplTest) create payment link with exception")
	public void createPaymentTestException() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenThrow(new IOException());
		Executable exec = () -> razorpayServiceImpl.createPayment(VendorCodeEnum.PAYMENT_RAZORPAY.toString(), "123",
				getTestPaymentRequestDto());
		ServiceException exception = assertThrows(ServiceException.class, exec);
		assertEquals("Exception while calling third party api", exception.getMessage());
	}

	private HttpResponseUtil getTestVerifyCreateHttpResponseUtil() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("{\r\n" + "    \"accept_partial\": true,\r\n" + "    \"amount\": 1000,\r\n"
				+ "    \"amount_paid\": 0,\r\n" + "    \"cancelled_at\": 0,\r\n" + "    \"created_at\": 1619708294,\r\n"
				+ "    \"currency\": \"INR\",\r\n" + "    \"customer\": {\r\n"
				+ "        \"contact\": \"8105672850\",\r\n" + "        \"email\": \"anush.kini2@mindtree.com\",\r\n"
				+ "        \"name\": \"Gaurav Kumar\"\r\n" + "    },\r\n"
				+ "    \"description\": \"Payment for policy no #23456\",\r\n" + "    \"expire_by\": 0,\r\n"
				+ "    \"expired_at\": 0,\r\n" + "    \"first_min_partial_amount\": 100,\r\n"
				+ "    \"id\": \"plink_H4mI2hxaCAwj6E\",\r\n" + "    \"notes\": null,\r\n" + "    \"notify\": {\r\n"
				+ "        \"email\": true,\r\n" + "        \"sms\": true\r\n" + "    },\r\n"
				+ "    \"order_id\": \"order_H4mIFRy8JxyZ68\",\r\n" + "    \"payments\": [],\r\n"
				+ "    \"reference_id\": \"#223454122221\",\r\n" + "    \"reminder_enable\": true,\r\n"
				+ "    \"reminders\": {\r\n" + "        \"status\": \"failed\"\r\n" + "    },\r\n"
				+ "    \"short_url\": \"https://rzp.io/i/qpnfknVT\",\r\n" + "    \"status\": \"created\",\r\n"
				+ "    \"updated_at\": 1619708305,\r\n" + "    \"upi_link\": false,\r\n" + "    \"user_id\": \"\"\r\n"
				+ "}");
		return httpResponseUtil;
	}

	private HttpResponseUtil getTestVerifyCompletedHttpResponseUtil() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("{  \"accept_partial\": true,\r\n" + "    \"amount\": 1000,\r\n"
				+ "    \"amount_paid\": 0,\r\n" + "    \"cancelled_at\": 0,\r\n" + "    \"created_at\": 1619708294,\r\n"
				+ "    \"currency\": \"INR\",\r\n" + "    \"customer\": {\r\n"
				+ "        \"contact\": \"8105672850\",\r\n" + "        \"email\": \"anush.kini2@mindtree.com\",\r\n"
				+ "        \"name\": \"Gaurav Kumar\"\r\n" + " },\r\n"
				+ "    \"description\": \"Payment for policy no #23456\",\r\n" + "    \"expire_by\": 0,\r\n"
				+ "    \"expired_at\": 0,\r\n" + "    \"first_min_partial_amount\": 100,\r\n"
				+ "    \"id\": \"plink_H4mI2hxaCAwj6E\",\r\n" + "    \"notes\": null,\r\n" + "    \"notify\": {\r\n"
				+ "        \"email\": true,\r\n" + "        \"sms\": true\r\n" + "},\r\n"
				+ "    \"order_id\": \"order_H4mIFRy8JxyZ68\",\r\n" + "    \"payments\": [],\r\n"
				+ "    \"reference_id\": \"#223454122221\",\r\n" + "    \"reminder_enable\": true,\r\n"
				+ "    \"reminders\": {\r\n" + "        \"status\": \"failed\"\r\n" + " },\r\n"
				+ "    \"short_url\": \"https://rzp.io/i/qpnfknVT\",\r\n" + "    \"status\": \"paid\",\r\n"
				+ "    \"updated_at\": 1619708305,\r\n" + "    \"upi_link\": false,\r\n" + "    \"user_id\": \"\"\r\n"
				+ "}");
		return httpResponseUtil;
	}

	private HttpResponseUtil getTestResendHttpResponseUtil() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("{\"success\": true}");
		return httpResponseUtil;
	}

	private HttpResponseUtil getTestVerifyHttpResponseUtilException() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(400);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("{\r\n" + "    \"error\": {\r\n" + "        \"code\": \"BAD_REQUEST_ERROR\",\r\n"
				+ "        \"description\": \"invalid input [strippedId] = [H4mI2hxaCAwjs6E]\",\r\n"
				+ "        \"metadata\": [],\r\n" + "        \"reason\": null,\r\n" + "        \"source\": null,\r\n"
				+ "        \"step\": null\r\n" + "    }\r\n" + "}");
		return httpResponseUtil;
	}

	private HttpResponseUtil getTestHttpResponseUtil() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("{\r\n" + "    \"accept_partial\": true,\r\n" + "    \"amount\": 1000,\r\n"
				+ "    \"amount_paid\": 0,\r\n" + "    \"cancelled_at\": 0,\r\n" + "    \"created_at\": 1619708036,\r\n"
				+ "    \"currency\": \"INR\",\r\n" + "    \"customer\": {\r\n"
				+ "        \"contact\": \"8105672850\",\r\n" + "        \"email\": \"anush.kini2@mindtree.com\",\r\n"
				+ "        \"name\": \"Gaurav Kumar\"\r\n" + "    },\r\n"
				+ "    \"description\": \"Payment for policy no #23456\",\r\n" + "    \"expire_by\": 0,\r\n"
				+ "    \"expired_at\": 0,\r\n" + "    \"first_min_partial_amount\": 100,\r\n"
				+ "    \"id\": \"plink_H4mDUvivhoBwXC\",\r\n" + "    \"notes\": null,\r\n" + "    \"notify\": {\r\n"
				+ "        \"email\": true,\r\n" + "        \"sms\": true\r\n" + "    },\r\n"
				+ "    \"payments\": null,\r\n" + "    \"reference_id\": \"#22345412221\",\r\n"
				+ "    \"reminder_enable\": true,\r\n" + "    \"reminders\": [],\r\n"
				+ "    \"short_url\": \"https://rzp.io/i/0lnb2kSkYC\",\r\n" + "    \"status\": \"created\",\r\n"
				+ "    \"updated_at\": 1619708036,\r\n" + "    \"upi_link\": false,\r\n" + "    \"user_id\": \"\"\r\n"
				+ "}");
		return httpResponseUtil;
	}

	private AuthUser getTestAuthUser() {
		List<GrantedAuthority> authorities = new ArrayList<>();
		return new AuthUser("bos", "urb", authorities, "URB", "a", "a", "a");
	}

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
				VendorCodeEnum.PAYMENT_RAZORPAY.toString(), locationCode, true)).thenReturn(testVendorConfig);
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode("PAYMENT_RAZORPAY");
		vendor.setVendorType("PAYMENT");
		vendor.setVendorName("RAZORPAY");
		vendor.setBaseurl("https://api.razorpay.com/v1/payment_links/");
		vendor.setRetryCount(3);
		vendor.setTimeOutSeconds(3);
		vendor.setVendorDetails(
				"{\"type\":\"RAZORPAY\",\"data\":{\"keyId\": \"rzp_test_partner_FaW480tw41tTmt\", \"keySecret\":\"S0Qn478jjF8z6F8Tj8TqxTp8\",\"expireTimeInMin\":\"10\",\"name\":\"Tanishq\"}}");
		return vendor;
	}

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

	private VendorConfigDao getTestVendorConfig() {
		VendorConfigDao vendorConfig = new VendorConfigDao();
		vendorConfig.setConfigId("F65833D6-1280-4BEF-ADC8-BA47E8E71ABF");
		vendorConfig.setVendor(getTestVendor());
		vendorConfig.setLocationCode("URB");
		vendorConfig.setOrgCode("TJ");
		vendorConfig.setConfigDetails("{\"type\":\"RAZORPAY_CONFIG\",\"data\":{\"accountId\":\"FbeKY5gEL5g1JN\"}}");
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
