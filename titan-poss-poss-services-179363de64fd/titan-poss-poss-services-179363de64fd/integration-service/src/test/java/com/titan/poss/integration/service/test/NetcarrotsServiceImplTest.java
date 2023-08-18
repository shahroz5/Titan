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
import java.util.Date;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.function.Executable;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.dto.CustomerAddDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerUpdateDto;
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.core.enums.CustomerSearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.LoyaltyAuditDao;
import com.titan.poss.integration.intg.repository.LoyaltyAuditRepository;
import com.titan.poss.integration.service.NetcarrotsErrorService;
import com.titan.poss.integration.service.impl.NetcarrotsServiceImpl;
import com.titan.poss.integration.util.HttpClientUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest({ HttpClientUtil.class, CustomSecurityPrincipal.class })
@DisplayName("NetcarrotsServiceImpl Test cases")
@PowerMockIgnore({ "javax.management.*", "com.sun.org.apache.xerces.*", "javax.xml.*", "org.xml.*", "org.w3c.dom.*",
		"com.sun.org.apache.xalan.*", "javax.activation.*" })
public class NetcarrotsServiceImplTest {

	@InjectMocks
	private NetcarrotsServiceImpl netcarrotsServiceImpl;

	@org.mockito.Mock
	private NetcarrotsErrorService netCarrotErrorService;

	@org.mockito.Mock
	private LoyaltyAuditRepository loyaltyAuditRepository;

	private static final String DISCOUNT = "discount";

	private static final String SEARCH = "search";

	private static final String STRING_0 = "<string>0</string>\r\n";

	private static final String ARRAY_OF_STRING = "<ArrayOfString xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns=\"http://tempuri.org/\">\r\n";

	private static final String ARRAY_CLOSING_TAG = "</ArrayOfString>";

	private static final String ANNIVERSARY = "ANNIVERSARY";

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) create loyalty customer succesfully")
	public void createCustomerTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito.doAnswer(new Answer<HttpResponseUtil>() {
			private int count = 1;

			@Override
			public HttpResponseUtil answer(InvocationOnMock invocation) {
				if (count == 1) {
					count++;
					return getTestHttpResponseUtil("allotmentCard");
				} else if (count == 2) {
					count++;
					return getTestHttpResponseUtil("memberEnroll");
				}
				return getTestHttpResponseUtil(SEARCH);
			}
		}).when(HttpClientUtil.class);
		HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
				org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null);
		VendorDao testVendor = getTestVendor();
		CustomerDto customerDto = netcarrotsServiceImpl.createLoyaltyCustomer(testVendor, "URB",
				getTestCustomerAddDto());
		Assert.assertNotNull(customerDto);
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) search loyalty customer succesfully")
	public void searchCustomerTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenReturn(getTestHttpResponseUtil(SEARCH));

		VendorDao testVendor = getTestVendor();
		CustomerDto customerDto = netcarrotsServiceImpl.searchLoyaltyCustomer(testVendor,
				CustomerSearchTypeEnum.ULP_ID.toString(), "URB", "700002369115");
		Assert.assertNotNull(customerDto);
		Assert.assertEquals("Test Name", customerDto.getCustomerName());
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) update loyalty customer succesfully")
	public void updateCustomerTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenReturn(getTestHttpResponseUtil("updateMember"));

		VendorDao testVendor = getTestVendor();
		netcarrotsServiceImpl.updateLoyaltyCustomer(testVendor, getTestCustomerUpdateDto());
		Mockito.verify(loyaltyAuditRepository, times(1)).getMaxSeqNo(org.mockito.ArgumentMatchers.anyString());
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) get Balance test succesfully")
	public void getBalanceTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenReturn(getTestHttpResponseUtil("getBalance"));

		VendorDao testVendor = getTestVendor();
		UlpBalanceResponseDto ulpBalanceResponseDto = netcarrotsServiceImpl.getloyaltyPointsBalance(testVendor,
				"700002543556");
		Assert.assertEquals("0", ulpBalanceResponseDto.getResponseCode());
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) redeem points test succesfully")
	public void redeemTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenReturn(getTestHttpResponseUtil("redeem"));

		VendorDao testVendor = getTestVendor();
		RedeemPointsDto redeemPointsDto = netcarrotsServiceImpl.redeemLoyaltyPoints(testVendor,
				getTestRedeemLoyaltyPointsDto());
		Assert.assertNotNull(redeemPointsDto);
		Assert.assertEquals("999", redeemPointsDto.getBalancePoints());
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) reverse redeem points test succesfully")
	public void reverseRedeemTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenReturn(getTestHttpResponseUtil("reverseRedeem"));

		VendorDao testVendor = getTestVendor();
		UlpReverseRedeemResponseDto ulpReverseRedeemResponseDto = netcarrotsServiceImpl
				.reverseRedeemedPoints(testVendor, getTestReverseRedeemLoyaltyPointsDto());
		Assert.assertEquals("1000019936", ulpReverseRedeemResponseDto.getReferenceNumber());
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) avail discount test succesfully")
	public void availDiscountTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenReturn(getTestHttpResponseUtil(DISCOUNT));

		VendorDao testVendor = getTestVendor();
		UlpDiscountResponseDto ulpDiscountResponseDto = netcarrotsServiceImpl.availLoyaltyDiscount(testVendor,
				getTestUlpDiscountDto());
		Assert.assertNotNull(ulpDiscountResponseDto);
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) reverse discount test succesfully")
	public void reverseDiscountTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenReturn(getTestHttpResponseUtil(DISCOUNT));

		VendorDao testVendor = getTestVendor();
		netcarrotsServiceImpl.reverseAvailedDiscount(testVendor, getTestBillCancellationDto());
		Mockito.verify(loyaltyAuditRepository, times(1)).getMaxSeqNo(org.mockito.ArgumentMatchers.anyString());
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) void transaction test succesfully")
	public void voidTransactionTest() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenReturn(getTestHttpResponseUtil(DISCOUNT));

		VendorDao testVendor = getTestVendor();
		netcarrotsServiceImpl.voidTransaction(testVendor, "123");
		Mockito.verify(loyaltyAuditRepository, times(1)).getMaxSeqNo(org.mockito.ArgumentMatchers.anyString());
	}

	@Test
	@DisplayName("(NetcarrotsServiceImplTest) get Balance test with exception")
	public void getBalanceTestException() throws IOException {
		setInitialTestData();
		PowerMockito.mockStatic(HttpClientUtil.class);
		PowerMockito
				.when(HttpClientUtil.sendHttpRequest(org.mockito.ArgumentMatchers.any(Object.class),
						org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.anyInt(), null))
				.thenThrow(new IOException());

		VendorDao testVendor = getTestVendor();
		Executable exec = () -> netcarrotsServiceImpl.getloyaltyPointsBalance(testVendor, "700002543556");
		ServiceException exception = assertThrows(ServiceException.class, exec);
		assertEquals("Something went wrong", exception.getMessage());
	}

	/**
	 * @return
	 */
	private UlpBillCancellationDto getTestBillCancellationDto() {
		UlpBillCancellationDto ulpBillCancellationDto = new UlpBillCancellationDto();
		ulpBillCancellationDto.setDiscountType(ANNIVERSARY);
		ulpBillCancellationDto.setTransactionId("123");
		ulpBillCancellationDto.setUlpId("700002369895");
		ulpBillCancellationDto.setInvoiceCancelDate(CalendarUtils.getCurrentDate());
		return ulpBillCancellationDto;
	}

	/**
	 * @return
	 */
	private UlpDiscountDto getTestUlpDiscountDto() {
		UlpDiscountDto ulpDiscountDto = new UlpDiscountDto();
		ulpDiscountDto.setDiscountType(ANNIVERSARY);
		ulpDiscountDto.setUlpId("700002369895");
		ulpDiscountDto.setInvoiceDate(new Date(19999));
		return ulpDiscountDto;
	}

	/**
	 * @return
	 */
	private UlpReverseRedeemedLoyaltyPointsDto getTestReverseRedeemLoyaltyPointsDto() {
		UlpReverseRedeemedLoyaltyPointsDto ulpReverseRedeemedLoyaltyPointsDto = new UlpReverseRedeemedLoyaltyPointsDto();
		ulpReverseRedeemedLoyaltyPointsDto.setRedeemedPoints(100);
		ulpReverseRedeemedLoyaltyPointsDto.setUlpId("700002369825");
		ulpReverseRedeemedLoyaltyPointsDto.setRefernceNumber("12345");
		return ulpReverseRedeemedLoyaltyPointsDto;
	}

	/**
	 * @return
	 */
	private UlpRedeemLoyaltyPointsDto getTestRedeemLoyaltyPointsDto() {
		UlpRedeemLoyaltyPointsDto ulpRedeemLoyaltyPointsDto = new UlpRedeemLoyaltyPointsDto();
		ulpRedeemLoyaltyPointsDto.setRedeemedPoints(100);
		ulpRedeemLoyaltyPointsDto.setUlpId("700002369825");
		return ulpRedeemLoyaltyPointsDto;
	}

	/**
	 * @return
	 */
	private CustomerUpdateDto getTestCustomerUpdateDto() {
		CustomerUpdateDto customerUpdateDto = new CustomerUpdateDto();
		customerUpdateDto.setMobileNumber("99999999999");
		return customerUpdateDto;
	}

	/**
	 * @return
	 */
	private CustomerAddDto getTestCustomerAddDto() {
		CustomerAddDto customerAddDto = new CustomerAddDto();
		customerAddDto.setCustomerName("Test");
		return customerAddDto;
	}

	private void setInitialTestData() {
		PowerMockito.mockStatic(CustomSecurityPrincipal.class);
		PowerMockito.when(CustomSecurityPrincipal.getSecurityPrincipal()).thenReturn(getTestAuthUser());
		String locationCode = "URB";
		ReflectionTestUtils.setField(netcarrotsServiceImpl, "startIndexOfMobileNumToBeMasked", 2);
		ReflectionTestUtils.setField(netcarrotsServiceImpl, "endIndexOfMobileNumToBeMasked", 6);
		when(loyaltyAuditRepository.save(org.mockito.ArgumentMatchers.any())).thenReturn(getTestLoyaltyAudit());
		when(loyaltyAuditRepository.getMaxSeqNo(locationCode)).thenReturn(1);
	}

	private AuthUser getTestAuthUser() {
		List<GrantedAuthority> authorities = new ArrayList<>();
		return new AuthUser("bos", "urb", authorities, "URB", "a", "a", "a");
	}

	/**
	 * @return
	 */
	private LoyaltyAuditDao getTestLoyaltyAudit() {
		LoyaltyAuditDao loayltyAudit = new LoyaltyAuditDao();
		loayltyAudit.setSequenceNo(2);
		loayltyAudit.setRequestTime(CalendarUtils.getCurrentDate());
		loayltyAudit.setUrl("");
		loayltyAudit.setVendor(getTestVendor());
		loayltyAudit.setTransactionType("");
		loayltyAudit.setLocationCode("URB");
		loayltyAudit.setRequestTime(CalendarUtils.getCurrentDate());
		return loayltyAudit;
	}

	private HttpResponseUtil getTestHttpResponseUtil(String responseType) {
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		httpResponseUtil.setHttpResponseCode(200);
		httpResponseUtil.setResponseTime(1000);

		switch (responseType) {
		case SEARCH:
			httpResponseUtil.setResponse(searchResponse());
			break;
		case "allotmentCard":
			httpResponseUtil.setResponse(allotmentCardResponse());
			break;
		case "memberEnroll":
			httpResponseUtil.setResponse(memberEnrollmentResponse());
			break;
		case "updateMember":
			httpResponseUtil.setResponse(updateMemberResponse());
			break;
		case "getBalance":
			httpResponseUtil.setResponse(getBalanceResponse());
			break;
		case "redeem":
			httpResponseUtil.setResponse(redeemResponse());
			break;
		case "reverseRedeem":
			httpResponseUtil.setResponse(reverseRedeemResponse());
			break;
		case DISCOUNT:
			httpResponseUtil.setResponse(discountResponse());
			break;

		default:
			httpResponseUtil.setResponse("");
		}
		return httpResponseUtil;
	}

	private String discountResponse() {
		return ARRAY_OF_STRING + STRING_0 + ARRAY_CLOSING_TAG;
	}

	private String reverseRedeemResponse() {
		return ARRAY_OF_STRING + STRING_0 + "<string>1000019936</string>\r\n" + ARRAY_CLOSING_TAG;
	}

	private String redeemResponse() {
		return ARRAY_OF_STRING + STRING_0 + "<string>1000019935</string>\r\n" + "<string>4867</string>\r\n"
				+ "<string>1</string>\r\n" + "<string>999</string>\r\n" + ARRAY_CLOSING_TAG;
	}

	private String allotmentCardResponse() {
		return ARRAY_OF_STRING + STRING_0 + "<string>700002543556</string>\r\n" + STRING_0 + ARRAY_CLOSING_TAG;
	}

	private String getBalanceResponse() {
		return ARRAY_OF_STRING + STRING_0 + "<string>1000</string>\r\n" + STRING_0 + ARRAY_CLOSING_TAG;
	}

	private String updateMemberResponse() {
		return ARRAY_OF_STRING + STRING_0 + ARRAY_CLOSING_TAG;
	}

	private String memberEnrollmentResponse() {
		return ARRAY_OF_STRING + STRING_0 + STRING_0 + ARRAY_CLOSING_TAG;
	}

	private String searchResponse() {
		return "<DataSet xmlns=\"http://tempuri.org/\">\r\n"
				+ "<diffgr:diffgram xmlns:msdata=\"urn:schemas-microsoft-com:xml-msdata\" xmlns:diffgr=\"urn:schemas-microsoft-com:xml-diffgram-v1\">\r\n"
				+ "<NewDataSet xmlns=\"\">\r\n" + "<Table diffgr:id=\"Table1\" msdata:rowOrder=\"0\">\r\n"
				+ "<ErrorCode>0</ErrorCode>\r\n" + "<ExistingChannel>Unified</ExistingChannel>\r\n"
				+ "<ExistingLoyaltyNo/>\r\n" + "<ULPNo>700002369115</ULPNo>\r\n" + "<Title/>\r\n"
				+ "<FIRSTNAME>Test Name</FIRSTNAME>\r\n" + "<LASTNAME/>\r\n" + "<City/>\r\n"
				+ "<MobileNumber>8105611150</MobileNumber>\r\n" + "<LandLineNumber/>\r\n" + "<BirthDate/>\r\n"
				+ "<AnniversaryDate>02-Jul-1988</AnniversaryDate>\r\n" + "<EmailID/>\r\n"
				+ "<PointBalance>1000</PointBalance>\r\n" + "<HomeStore>No</HomeStore>\r\n" + "<HouseNo/>\r\n"
				+ "<BuildingName/>\r\n" + "<StreetRoad/>\r\n" + "<ColonyLocality/>\r\n" + "<CityOther/>\r\n"
				+ "<PinCode/>\r\n" + "<CurrentTier>Encircle Gold</CurrentTier>\r\n"
				+ "<EnrollmentDate>01-Feb-2020</EnrollmentDate>\r\n" + "<State/>\r\n"
				+ "<MemberBlocked>N</MemberBlocked>\r\n"
				+ "<EligibleForBirthdayDiscount>DNU</EligibleForBirthdayDiscount>\r\n" + "<BirthdayValidityPeriod/>\r\n"
				+ "<EligibleForAniversaryDiscount>Y</EligibleForAniversaryDiscount>\r\n"
				+ "<AnniversaryValidityPeriod>12-Jun-2020~22-Jul-2020</AnniversaryValidityPeriod>\r\n"
				+ "<EligibleForSpouseDOBDiscount>DNU</EligibleForSpouseDOBDiscount>\r\n"
				+ "<SpouseBirthdayValidityPeriod/>\r\n"
				+ "<EligibleForChild1DOBDiscount>DNU</EligibleForChild1DOBDiscount>\r\n"
				+ "<Child1BirthdayValidityPeriod/>\r\n"
				+ "<EligibleForChild2DOBDiscount>DNU</EligibleForChild2DOBDiscount>\r\n"
				+ "<Child2BirthdayValidityPeriod/>\r\n" + "</Table>\r\n" + "</NewDataSet>\r\n"
				+ "</diffgr:diffgram>\r\n" + "</DataSet>";
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode("ULP_NETCARROTS");
		vendor.setVendorType("ULP");
		vendor.setVendorName("Netcarrots Loyalty Services");
		vendor.setRetryCount(3);
		vendor.setBaseurl("https://ulpdemo2.netcarrots.in/WEBAPI/API/ULPService.asmx");
		vendor.setTimeOutSeconds(3);
		vendor.setVendorDetails("{\"data\":{\"senderID\":\"TANISHQ\"}}");
		return vendor;
	}
}
