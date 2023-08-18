/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.test;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
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
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import com.google.gson.JsonObject;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.gc.GiftCardActivateRequestDto;
import com.titan.poss.integration.dto.request.gc.GiftCardCancelActivateDto;
import com.titan.poss.integration.dto.request.gc.GiftCardRedeemRequestDto;
import com.titan.poss.integration.dto.request.gc.GiftCardReverseRedeemRequestDto;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.GiftCardAuditDao;
import com.titan.poss.integration.intg.dao.VendorConfigDaoExt;
import com.titan.poss.integration.intg.repository.GiftCardAuditRepository;
import com.titan.poss.integration.intg.repository.VendorConfigRepositoryExt;
import com.titan.poss.integration.repository.VendorConfigRepository;
import com.titan.poss.integration.service.impl.QwikCilverGiftCardServiceImpl;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RunWith(PowerMockRunner.class)
@PrepareForTest({ HttpClientUtil.class, JsonUtils.class, CustomSecurityPrincipal.class, CryptoUtil.class,
		ApplicationPropertiesUtil.class })
@DisplayName("QwikCilverGiftCardServiceImpl Test cases")
@PowerMockIgnore({ "javax.management.*", "com.sun.org.apache.xerces.*", "javax.xml.*", "org.xml.*", "org.w3c.dom.*",
		"com.sun.org.apache.xalan.*", "javax.activation.*" })
public class QwikCilverGiftCardServiceImplTest {

	@InjectMocks
	private QwikCilverGiftCardServiceImpl qwikCilverGiftCardServiceImpl;

	@org.mockito.Mock
	private VendorConfigRepository vendorConfigRepository;

	@org.mockito.Mock
	private GiftCardAuditRepository giftCardAuditRepository;

	@Mock
	private VendorConfigRepositoryExt vendorConfigRepositoryExt;

	private static final String CARD_NUMBER = "9807641100001121";

	private static final String TRACK_DATA = "1980071640110003009110215";

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) get gift card balance test succesfully")
	public void getBalanceTest() throws IOException {
		setInitialTestData();
		mockHttpRequest();
		VendorDao testVendor = getTestVendor();
		GcResponseDto gcResponseDto = qwikCilverGiftCardServiceImpl.getBalance(testVendor, "",
				"19800716401100030091102155", false, GiftCardTypeEnum.GIFTCARD_CODE);

		Assert.assertNotNull(gcResponseDto);
		assertEquals(CARD_NUMBER, gcResponseDto.getCardNumber());
	}

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) get customer info test succesfully")
	public void getCustomerInfoTest() throws IOException {
		setInitialTestData();
		mockHttpRequest();
		VendorDao testVendor = getTestVendor();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestHttpResponseUtil2());

		GcCustomerResponseDto gcCustomerResponseDto = qwikCilverGiftCardServiceImpl.getCustomerInfo(testVendor,
				"8877661190000030");
		Assert.assertNotNull(gcCustomerResponseDto);
		assertEquals(CARD_NUMBER, gcCustomerResponseDto.getCardNumber());
	}

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) redeem gift card balance test succesfully")
	public void redeemGiftCardBalanaceTest() throws IOException {
		setInitialTestData();
		mockHttpRequest();
		VendorDao testVendor = getTestVendor();
		GcResponseDto gcResponseDto = qwikCilverGiftCardServiceImpl.redeemGiftCardBalanace(testVendor,
				getTestGiftCardredeemDto(), GiftCardTypeEnum.GIFTCARD_CODE);
		Assert.assertNotNull(gcResponseDto);
		assertEquals(CARD_NUMBER, gcResponseDto.getCardNumber());
	}

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) reverse redeem gift card balance test succesfully")
	public void reverseRedeemGiftCardBalanaceTest() throws IOException {
		setInitialTestData();
		mockHttpRequest();
		VendorDao testVendor = getTestVendor();
		GcResponseDto gcResponseDto = qwikCilverGiftCardServiceImpl.reverseRedeem(testVendor,
				getTestGiftCardReverseRedeemRequestDto(), GiftCardTypeEnum.GIFTCARD_CODE);
		Assert.assertNotNull(gcResponseDto);
		assertEquals(CARD_NUMBER, gcResponseDto.getCardNumber());
	}

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) activate gift card test succesfully")
	public void activateGiftCardTest() throws IOException {
		setInitialTestData();
		mockHttpRequest();
		VendorDao testVendor = getTestVendor();
		GcActivateResponseDto gcActivateResponseDto = qwikCilverGiftCardServiceImpl.activateGiftCard(testVendor,
				getTestGiftCardActivateRequestDto());
		Assert.assertNotNull(gcActivateResponseDto);
		assertEquals("8877661190000030", gcActivateResponseDto.getCardNumber());
	}

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) cancel activate gift card test succesfully")
	public void cancelActivateGiftCardTest() throws IOException {
		setInitialTestData();
		mockHttpRequest();
		VendorDao testVendor = getTestVendor();
		GcResponseDto gcResponseDto = qwikCilverGiftCardServiceImpl.cancelActivate(testVendor,
				getTestGiftCardCancelActivateDto());
		Assert.assertNotNull(gcResponseDto);
		assertEquals(CARD_NUMBER, gcResponseDto.getCardNumber());
	}

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) initialize test succesfully")
	public void initializeTest() throws IOException {
		setInitialTestData();
		mockHttpRequest();
		VendorDao testVendor = getTestVendor();
		qwikCilverGiftCardServiceImpl.initialize(testVendor);
		Mockito.verify(giftCardAuditRepository, times(1)).getMaxSeqNo(org.mockito.ArgumentMatchers.anyString());
	}

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) redeem gift card balance test throws exception")
	public void redeemGiftCardBalanaceTestException() throws IOException {
		setInitialTestData();
		VendorDao testVendor = getTestVendor();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenThrow(new IOException());
		Executable exec = () -> qwikCilverGiftCardServiceImpl.redeemGiftCardBalanace(testVendor,
				getTestGiftCardredeemDto(), GiftCardTypeEnum.GIFTCARD_CODE);
		ServiceException exception = assertThrows(ServiceException.class, exec);
		assertEquals("Exception while calling third party api", exception.getMessage());
	}

	@Test
	@DisplayName("(QwikCilverGiftCardServiceImpl) get gift card balance test exception")
	public void getBalanceTestException() throws IOException {
		setInitialTestData();
		VendorDao testVendor = getTestVendor();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenThrow(new IOException());

		Executable exec = () -> qwikCilverGiftCardServiceImpl.getBalance(testVendor, "", "19800716401100030091102155",
				false, GiftCardTypeEnum.GIFTCARD_CODE);
		ServiceException exception = assertThrows(ServiceException.class, exec);
		assertEquals("Exception while calling third party api", exception.getMessage());
	}

	private GiftCardCancelActivateDto getTestGiftCardCancelActivateDto() {
		GiftCardCancelActivateDto giftCardCancelActivateDto = new GiftCardCancelActivateDto();
		giftCardCancelActivateDto.setTrackData(TRACK_DATA);
		giftCardCancelActivateDto.setOriginalAmount("100");
		return giftCardCancelActivateDto;
	}

	private void setInitialTestData() {
		GiftCardAuditDao testGiftCardAudit = getTestGiftCardAudit();
		String locationCode = "URB";
		VendorConfigDao testVendorConfig = getTestVendorConfig();

		ReflectionTestUtils.setField(ApplicationPropertiesUtil.class, "env", new StandardEnvironment());

		PowerMockito.mockStatic(CustomSecurityPrincipal.class);
		PowerMockito.when(CustomSecurityPrincipal.getSecurityPrincipal()).thenReturn(getTestAuthUser());

		PowerMockito.mockStatic(JsonUtils.class);
		PowerMockito.when(JsonUtils.decryptPasswordInJson(org.mockito.ArgumentMatchers.anyString()))
				.thenReturn(getTestJsonObject());
		PowerMockito.when(JsonUtils.encryptPasswordInJson(org.mockito.ArgumentMatchers.anyString()))
				.thenReturn(getTestJsonObject());

		PowerMockito.mockStatic(CryptoUtil.class);
		PowerMockito
				.when(CryptoUtil.decrypt(org.mockito.ArgumentMatchers.anyString(),
						org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.anyBoolean()))
				.thenReturn("token");

		PowerMockito.mockStatic(ApplicationPropertiesUtil.class);
		PowerMockito.when(ApplicationPropertiesUtil.getProperty(org.mockito.ArgumentMatchers.anyString()))
				.thenReturn("property");

		when(giftCardAuditRepository.save(org.mockito.ArgumentMatchers.any())).thenReturn(testGiftCardAudit);
		when(giftCardAuditRepository.getMaxSeqNo(locationCode)).thenReturn(0);
		when(vendorConfigRepository.findByVendorVendorCodeAndLocationCodeAndIsActive(getTestVendor().getVendorCode(),
				locationCode, true)).thenReturn(testVendorConfig);
		when(vendorConfigRepositoryExt.findByVendorVendorCodeAndLocationCode(getTestVendor().getVendorCode(),
				locationCode)).thenReturn(getTestVendorConfigExt());
	}

	private void mockHttpRequest() throws IOException {
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(),
				org.mockito.ArgumentMatchers.any())).thenReturn(getTestHttpResponseUtil());
	}

	/**
	 * @return
	 */
	private AuthUser getTestAuthUser() {
		List<GrantedAuthority> authorities = new ArrayList<>();
		return new AuthUser("bos", "urb", authorities, "URB", "a", "a", "a");
	}

	private GiftCardActivateRequestDto getTestGiftCardActivateRequestDto() {
		GiftCardActivateRequestDto giftCardActivateRequestDto = new GiftCardActivateRequestDto();
		giftCardActivateRequestDto.setAmount("100");
		giftCardActivateRequestDto.setTrackData(TRACK_DATA);
		return giftCardActivateRequestDto;
	}

	private GiftCardReverseRedeemRequestDto getTestGiftCardReverseRedeemRequestDto() {
		GiftCardReverseRedeemRequestDto giftCardReverseRedeemRequestDto = new GiftCardReverseRedeemRequestDto();
		giftCardReverseRedeemRequestDto.setAmount(100.00);
		giftCardReverseRedeemRequestDto.setBillAmount(10000.0);
		giftCardReverseRedeemRequestDto.setTransactionId("URB1");
		giftCardReverseRedeemRequestDto.setTrackData(TRACK_DATA);
		return giftCardReverseRedeemRequestDto;
	}

	/**
	 * @return
	 */
	private GiftCardRedeemRequestDto getTestGiftCardredeemDto() {
		GiftCardRedeemRequestDto giftCardRedeemRequestDto = new GiftCardRedeemRequestDto();
		giftCardRedeemRequestDto.setAmount(100.00);
		giftCardRedeemRequestDto.setBillAmount(10000.00);
		giftCardRedeemRequestDto.setTrackData(TRACK_DATA);
		giftCardRedeemRequestDto.setInvoiceNumber("URB1");
		return giftCardRedeemRequestDto;
	}

	private HttpResponseUtil getTestHttpResponseUtil() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("{\"CardNumber\": \"8877661190000030\",\r\n"
				+ "\"CardExpiry\": \"2021-07-09T10:32:15.413\",\r\n" + "    \"Amount\": 1500.0,\r\n"
				+ "\"InvoiceNumber\":\"123\"," + "\"Notes\": \"{ValType~GCACT}\",\r\n"
				+ "\"CardType\": \"Tanishq Retail Gift Card\",\r\n" + "    \"CardCreationType\": \"Physical\",\r\n"
				+ "\"CardProgramGroupType\": \"Retail Gift Cards\",\r\n" + "    \"ApprovalCode\": \"19781932\",\r\n"
				+ "\"ApiWebProperties\": {" + "        \"MerchantOutletName\": \"Tanishq-Corporate\",\r\n"
				+ "        \"AcquirerId\": \"Tanishq SCLP\",\r\n"
				+ "        \"OrganizationName\": \"Tanishq SCLP\",\r\n" + "        \"POSEntryMode\": 2,\r\n"
				+ "        \"POSTypeId\": 1,\r\n" + "        \"POSName\": \"Tanishq-SCLP-POS-01\",\r\n"
				+ "        \"TermAppVersion\": \"null\",\r\n" + "        \"CurrentBatchNumber\": 10679342,\r\n"
				+ "        \"TerminalId\": \"TQ:Tanishq-SCLP-POS-01\",\r\n" + "        \"MID\": \"null\",\r\n"
				+ "        \"UserName\": \"manager\",\r\n" + "        \"Password\": \"welcome\",\r\n"
				+ "        \"ForwardingEntityId\": \"tanishq.com\",\r\n"
				+ "        \"ForwardingEntityPassword\": \"tanishq.com\",\r\n"
				+ "        \"DateAtClient\": \"2019-11-04T12:33:02\",\r\n"
				+ "        \"IsForwardingEntityExists\": false\r\n" + "    },\r\n" + "    \"ResponseCode\": 0,\r\n"
				+ "    \"ResponseMessage\": \"Transaction successful.\" \r\n" + "}");
		return httpResponseUtil;
	}


	private HttpResponseUtil getTestHttpResponseUtil2() {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);
		httpResponseUtil.setResponse("{\r\n" + "    \"FirstName\": \"Customer\",\r\n"
				+ "    \"Phone\": \"9845012345\",\r\n" + "    \"Email\": \"\",\r\n" + "    \"CardsResponse\": [\r\n"
				+ "        {\r\n" + "            \"CardNumber\": \"9807641100001121\",\r\n"
				+ "            \"CardStatus\": \"ACTIVATED\",\r\n"
				+ "            \"OutstandingBalance\": \"3990.0000\",\r\n"
				+ "            \"CardExpiryDate\": \"2020-12-31T00:00:00\",\r\n"
				+ "            \"CardProgramGroupName\": \"Tanishq EC Gift Card\"\r\n" + "        }\r\n"
				+ "    ],  \r\n" + "    \"ResponseCode\": 0,\r\n"
				+ "    \"ResponseMessage\": \"Transaction successful.\"\r\n" + "}");
		return httpResponseUtil;
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode("QC");
		vendor.setVendorType("GIFT_CARD");
		vendor.setVendorName("QwikCilver");
		vendor.setBaseurl("https://qc3.qwikcilver.com/Qwikcilver/eGMS.RestApi/api");
		vendor.setRetryCount(3);
		vendor.setTimeOutSeconds(3);
		vendor.setVendorDetails(
				"{\"type\":\"QC\",\"data\":{\"UserName\":\"manager\",\"Password\":\"welcome\",\"ForwardingEntityId\":\"tanishq.com\",\"ForwardingEntityPassword\":\"tanishq.com\",\"Host\":\"qc3.qwikcilver.com\",\"IsForwardingEntityExists\":\"true\",\"POSEntrymode\":\"2\",\"POSTypeId\":\"3\"}}");
		return vendor;
	}

	private VendorConfigDao getTestVendorConfig() {
		VendorConfigDao vendorConfig = new VendorConfigDao();
		vendorConfig.setConfigId("F65833D6-1280-4BEF-ADC8-BA47E8E71ABF");
		vendorConfig.setVendor(getTestVendor());
		vendorConfig.setLocationCode("URB");
		vendorConfig.setOrgCode("TJ");
		vendorConfig.setConfigDetails("{\"type\":\"QCGC_CONFIG\",\"data\":{\"TerminalId\":\"CPD_hostname1\"}}");
		vendorConfig.setConnectionDetails(
				"{\"type\":\"QcgcConnectionDetails\",\"data\":{\"MerchantOutletName\":\"Tanishq-Corporate\",\"AcquirerId\":\"Tanishq SCLP\",\"OrganizationName\":\"Tanishq SCLP\",\"POSEntryMode\":2,\"POSTypeId\":1,\"POSName\":\"TNQ-CPD_hostname1\",\"TermAppVersion\":null,\"CurrentBatchNumber\":10746744,\"TerminalId\":\"CPD_hostname1\",\"MID\":null,\"UserName\":\"manager\",\"Password\":\"yf4duW0+Us6325g57LGEMQ==\",\"ForwardingEntityId\":\"tanishq.com\",\"ForwardingEntityPassword\":\"tanishq.com\",\"DateAtClient\":\"2020-11-25T11:25:27\",\"IsForwardingEntityExists\":true}}");
		vendorConfig.setIsActive(true);
		return vendorConfig;
	}

	private VendorConfigDaoExt getTestVendorConfigExt() {
		VendorConfigDaoExt vendorConfig = new VendorConfigDaoExt();
		vendorConfig.setConfigId("F65833D6-1280-4BEF-ADC8-BA47E8E71ABF");
		vendorConfig.setVendor(getTestVendor());
		vendorConfig.setLocationCode("URB");
		vendorConfig.setOrgCode("TJ");
		vendorConfig.setConfigDetails("{\"type\":\"QCGC_CONFIG\",\"data\":{\"TerminalId\":\"CPD_hostname1\"}}");
		vendorConfig.setConnectionDetails(
				"{\"type\":\"QcgcConnectionDetails\",\"data\":{\"MerchantOutletName\":\"Tanishq-Corporate\",\"AcquirerId\":\"Tanishq SCLP\",\"OrganizationName\":\"Tanishq SCLP\",\"POSEntryMode\":2,\"POSTypeId\":1,\"POSName\":\"TNQ-CPD_hostname1\",\"TermAppVersion\":null,\"CurrentBatchNumber\":10746744,\"TerminalId\":\"CPD_hostname1\",\"MID\":null,\"UserName\":\"manager\",\"Password\":\"yf4duW0+Us6325g57LGEMQ==\",\"ForwardingEntityId\":\"tanishq.com\",\"ForwardingEntityPassword\":\"tanishq.com\",\"DateAtClient\":\"2020-11-25T11:25:27\",\"IsForwardingEntityExists\":true}}");
		vendorConfig.setIsActive(true);
		return vendorConfig;
	}

	private GiftCardAuditDao getTestGiftCardAudit() {
		GiftCardAuditDao giftCardAudit = new GiftCardAuditDao();
		giftCardAudit.setSequenceNo(1);
		giftCardAudit.setRequestTime(CalendarUtils.getCurrentDate());
		giftCardAudit.setUrl("https://qc3.qwikcilver.com/Qwikcilver/eGMS.RestApi/api/gc/balanceenquiry");
		giftCardAudit.setVendor(getTestVendor());
		giftCardAudit.setTransactionType("balanceenquiry");
		giftCardAudit.setLocationCode("URB");
		giftCardAudit.setCardNumber(CARD_NUMBER);
		giftCardAudit.setInvoiceNumber(null);
		return giftCardAudit;
	}

	private JsonObject getTestJsonObject() {
		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("Password", "30153");
		return jsonObject;
	}
}
