/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.net.ssl.SSLException;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.Consts;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.impl.execchain.RequestAbortedException;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.dto.CustomerAddDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerUpdateDto;
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.core.enums.CustomerSearchTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.response.HttpResponseUtil;
import com.titan.poss.integration.intg.dao.LoyaltyAuditDao;
import com.titan.poss.integration.intg.repository.LoyaltyAuditRepository;
import com.titan.poss.integration.service.NetcarrotsErrorService;
import com.titan.poss.integration.service.NetcarrotsService;
import com.titan.poss.integration.util.DocumentBuilderUtil;
import com.titan.poss.integration.util.HttpClientUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * The following api's are specific to Netcarrots. Please refer the netcarrots
 * document to understand the structure of request and response.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("IntegrationNetcarrotsService")
public class NetcarrotsServiceImpl implements NetcarrotsService {

	@Autowired
	private LoyaltyAuditRepository loyaltyAuditRepository;

	@Autowired
	private NetcarrotsErrorService netCarrotErrorService;

	@Value("${mobilenumber.mask.startIndex}")
	private Integer startIndexOfMobileNumToBeMasked;

	@Value("${mobilenumber.mask.endIndex}")
	private Integer endIndexOfMobileNumToBeMasked;

	private static final String ALLOT_CARD = "AllotmentCardNumber";
	private static final String MEMBER_ENROLLMENT = "MemberEnrollment";
	private static final String MEMBER_SEARCH = "MemberSearchAPIAdditional";
	private static final String UPDATE_MEMBER = "UpdateProfile";
	private static final String GET_BALANCE = "GetBalance";
	private static final String REDEEM_POINTS = "RedeemPointsMethod";
	private static final String REDEEM_POINTS_REVERSAL = "RedeemedPointsreversalMethod";
	private static final String AVAIL_DISCOUNT = "DiscountAvailedAdditional";
	private static final String BILL_CANCEL = "BillCancellationAdditional";
	private static final String VOID_TRANSACTION = "VoidTransaction";
	private static final String ERR_INT_010 = "ERR-INT-010";
	private static final String EXCEPTION_MSG = "Cannot connect to {vendorName} application, please try again";
	private static final String OUTLET_CODE = "OutletCode";
	private static final String MOBILE_NUMBER = "MobileNumber";
	private static final String STRING = "string";
	private static final String CHANNEL_CODE = "ChannelCode";
	private static final String DATE_FORMAT = "dd-MMM-yyyy";
	private static final String HOUSE_NO = "HouseNo";
	private static final String BUILDING_NAME = "BuildingName";
	private static final String STREET_ROAD = "StreetRoad";
	private static final String COLONY_LOCALITY = "ColonyLocality";
	private static final String CITY = "City";
	private static final String CITY_OTHERS = "CityOthers";
	private static final String PIN_CODE = "PinCode";
	private static final String CONTENT_TYPE = "Content-Type";
	private static final String APPLICATION_URL_ENCODED = "application/x-www-form-urlencoded";
	private static final String USER_NAME = "UserName";
	private static final String PASS_WORD = "Password";
	private static final String UNIQUE_ID = "UniqueId";
	private static final String EMAIL_ID = "EmailID";
	private static final String CARD_NO = "CardNo";
	private static final String ENCIRCLE = "Encircle";
	private static final String VENDOR_NAME = "vendorName";
	private static final String BIRTHDATE = "BirthDate";
	private static final String ANNIVERSARYDATE = "AnniversaryDate";

	/**
	 * Allocates a card number to the customer mobile number and if the customer
	 * does not exist, then enroll.
	 *
	 * @param vendor         the integration
	 * @param customerAddDto the customer add dto
	 * @return the customer dto
	 */
	@Override
	public CustomerDto createLoyaltyCustomer(VendorDao vendor, String locCode, CustomerAddDto customerAddDto) {

		String locationCode = CommonUtil.isAStoreUser() ? CommonUtil.getLocationCode() : locCode;
		if (StringUtils.isEmpty(locationCode)) {
			throw new ServiceException("Location code is required", "ERR-INT-056");
		}
		String mobileNumber = customerAddDto.getMobileNumber();

		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + ALLOT_CARD)
				.queryParam(OUTLET_CODE, locationCode).queryParam(MOBILE_NUMBER, mobileNumber).build().toUriString();

		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, ALLOT_CARD, locationCode, vendor, false);
		setCommonRequestLoyaltyData(loyaltyAudit, url, mobileNumber, null);

		HttpGet getRequest = new HttpGet(url);
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(getRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}

		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());
		CustomerDto customerDto = new CustomerDto();
		customerDto.setResponseCode(ulpBaseResponseDto.getResponseCode().trim());
		customerDto.setResponseMessage(ulpBaseResponseDto.getResponseMessage());
		String memberAlreadyExists = responseDocument.getElementsByTagName(STRING).item(2).getTextContent();
		String ulpId = responseDocument.getElementsByTagName(STRING).item(1).getTextContent();
		if (ulpBaseResponseDto.getResponseCode().equalsIgnoreCase("0")) {
			if (memberAlreadyExists.equalsIgnoreCase("1")) {
				saveLoyaltyAuditDaoData(loyaltyAudit, "Member already exists", null, false, ulpId,
						httpResponseUtil.getHttpResponseCode());
				throw new ServiceException("Member already exist", "ERR-INT-011");
			} else {
				saveLoyaltyAuditDaoData(loyaltyAudit, "Allotmentcard: " + ulpId, null, true, ulpId,
						httpResponseUtil.getHttpResponseCode());
				return enrollLoyaltyMember(vendor, locationCode, customerAddDto, ulpId);
			}
		} else {
			return customerDto;
		}
	}

	/**
	 * Enroll loyalty member using the generated card number.
	 *
	 * @param vendor         the vendor
	 * @param customerAddDto the customer add dto
	 * @param ulpId          the ulp id
	 * @return the customer dto
	 */
	private CustomerDto enrollLoyaltyMember(VendorDao vendor, String locationCode, CustomerAddDto customerAddDto,
			String ulpId) {

		String channelCode = getChannelCode(vendor);
		String mobileNumber = customerAddDto.getMobileNumber();
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + MEMBER_ENROLLMENT).build()
				.toUriString();

		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, MEMBER_ENROLLMENT, locationCode, vendor,
				false);
		setCommonRequestLoyaltyData(loyaltyAudit, MapperUtil.getJsonString(customerAddDto), mobileNumber, ulpId);

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair("TransactionDate",
				CalendarUtils.formatDateToString(CalendarUtils.getCurrentDate(), DATE_FORMAT)));
		form.add(new BasicNameValuePair("OldMembershipNo", ""));
		form.add(new BasicNameValuePair("OldChannelCode", ""));
		form.add(new BasicNameValuePair("NewMembershipNo", ulpId));
		form.add(new BasicNameValuePair("FirstName", customerAddDto.getCustomerName()));
		form.add(new BasicNameValuePair("LastName", ""));
		form.add(new BasicNameValuePair(CHANNEL_CODE, channelCode));
		form.add(new BasicNameValuePair(OUTLET_CODE, locationCode));
		form.add(new BasicNameValuePair(MOBILE_NUMBER, mobileNumber));
		form.add(new BasicNameValuePair(EMAIL_ID, checkIfEmpty(customerAddDto.getEmailId())));
		form.add(new BasicNameValuePair(HOUSE_NO, extractAddressData(customerAddDto.getAddressLines(), 0)));
		form.add(new BasicNameValuePair(BUILDING_NAME, extractAddressData(customerAddDto.getAddressLines(), 1)));
		form.add(new BasicNameValuePair(STREET_ROAD, extractAddressData(customerAddDto.getAddressLines(), 2)));
		form.add(new BasicNameValuePair(COLONY_LOCALITY, extractAddressData(customerAddDto.getAddressLines(), 3)));
		form.add(new BasicNameValuePair(CITY, checkIfEmpty(customerAddDto.getCity())));
		form.add(new BasicNameValuePair(CITY_OTHERS, ""));
		form.add(new BasicNameValuePair(PIN_CODE, checkIfEmpty(customerAddDto.getPincode())));

		UrlEncodedFormEntity memberEnrollEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);
		HttpPost sendPostRequest = new HttpPost(url);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		sendPostRequest.setEntity(memberEnrollEntity);
		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}

		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());

		CustomerDto customerDto = new CustomerDto();
		customerDto.setResponseCode(ulpBaseResponseDto.getResponseCode().trim());
		customerDto.setResponseMessage(ulpBaseResponseDto.getResponseMessage());

		if (ulpBaseResponseDto.getResponseCode().equalsIgnoreCase("0")) {
			saveLoyaltyAuditDaoData(loyaltyAudit, "Enrollment success", null, true, ulpId,
					httpResponseUtil.getHttpResponseCode());
			return mapCustomerDto(customerDto, customerAddDto, ulpId);
		} else {
			saveLoyaltyAuditDaoData(loyaltyAudit, ulpBaseResponseDto.getResponseMessage(), null, false, ulpId,
					httpResponseUtil.getHttpResponseCode());
			return customerDto;
		}
	}

	private CustomerDto mapCustomerDto(CustomerDto customerDto, CustomerAddDto customerAddDto, String ulpId) {

		customerDto.setUlpId(ulpId);
		customerDto.setPointBalance(new BigDecimal(0));
		customerDto.setEnrollmentDate(CalendarUtils.getCurrentDate());
		customerDto.setIsMemberBlocked(false);
		customerDto = (CustomerDto) MapperUtil.getObjectMapping(customerAddDto, customerDto);
		return customerDto;
	}

	/**
	 * Search loyalty member.
	 *
	 * @param vendor     the integration
	 * @param searchType the search type
	 * @param value      the value
	 * @return the customer dto
	 */
	@Override
	public CustomerDto searchLoyaltyCustomer(VendorDao vendor, String searchType, String locationCode, String value) {

		String mobileNumber = "";
		String ulpId = "";
		if (searchType.equalsIgnoreCase(CustomerSearchTypeEnum.MOBILE_NO.toString())) {
			mobileNumber = value;
		} else if (searchType.equalsIgnoreCase(CustomerSearchTypeEnum.ULP_ID.toString())) {
			ulpId = value;
		}

		return searchMember(vendor, locationCode, mobileNumber, ulpId);
	}

	/**
	 * Search a customer/member based on the mobile number or card number.
	 *
	 * @param vendor       the vendor
	 * @param mobileNumber the mobile number
	 * @param ulpId        the ulp id
	 * @return the customer dto
	 */
	private CustomerDto searchMember(VendorDao vendor, String locCode, String mobileNumber, String ulpId) {
		String channelCode = getChannelCode(vendor);
		String locationCode = CommonUtil.isAStoreUser() ? CommonUtil.getLocationCode() : locCode;
		if (StringUtils.isEmpty(locationCode)) {
			throw new ServiceException("Location code is required", "ERR-INT-056");
		}
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + MEMBER_SEARCH).build()
				.toUriString();

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair(CHANNEL_CODE, channelCode));
		form.add(new BasicNameValuePair(OUTLET_CODE, locationCode));
		form.add(new BasicNameValuePair(MOBILE_NUMBER, mobileNumber));
		form.add(new BasicNameValuePair("OldChannelCode", ""));
		form.add(new BasicNameValuePair("OldMembershipNo", ""));
		form.add(new BasicNameValuePair("NewMembershipNo", ulpId));
		form.add(new BasicNameValuePair(EMAIL_ID, ""));
		form.add(new BasicNameValuePair("LandLineNo", ""));
		form.add(new BasicNameValuePair("Name", ""));
		form.add(new BasicNameValuePair("DateOfBirth", ""));
		form.add(new BasicNameValuePair(CITY, ""));
		UrlEncodedFormEntity memberSearchAPIAdditionalEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, MEMBER_SEARCH, locationCode, vendor, false);
		setCommonRequestLoyaltyData(loyaltyAudit, MapperUtil.getJsonString(form), mobileNumber, ulpId);

		HttpPost sendPostRequest = new HttpPost(url);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		sendPostRequest.setEntity(memberSearchAPIAdditionalEntity);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			log.info("Response: " + httpResponseUtil.getResponse());
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			log.info("Response: " + httpResponseUtil.getResponse());
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}
		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName("ErrorCode").item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());
		CustomerDto customerDto = new CustomerDto();
		if (ulpBaseResponseDto.getResponseCode().trim().equalsIgnoreCase("0")) {
			customerDto = mapSearchResultDocToCustomerDto(responseDocument);
			saveLoyaltyAuditDaoData(loyaltyAudit, MapperUtil.getJsonString(customerDto), null, true, ulpId,
					httpResponseUtil.getHttpResponseCode());
		}
		customerDto.setResponseMessage(ulpBaseResponseDto.getResponseMessage());
		customerDto.setResponseCode(ulpBaseResponseDto.getResponseCode().trim());
		return customerDto;
	}

	/**
	 * Update loyalty member.
	 *
	 * @param vendor            the integration
	 * @param customerUpdateDto the customer update dto
	 */
	@Override
	public UlpBaseResponseDto updateLoyaltyCustomer(VendorDao vendor, CustomerUpdateDto customerUpdateDto) {
		String locationCode = CommonUtil.getLocationCode();
		String mobileNumber = customerUpdateDto.getMobileNumber();
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + UPDATE_MEMBER).build()
				.toUriString();

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair(MOBILE_NUMBER, customerUpdateDto.getMobileNumber()));
		form.add(new BasicNameValuePair(OUTLET_CODE, locationCode));
		form.add(new BasicNameValuePair("PossUserId", CommonUtil.getAuthUser().getUsername()));
		form.add(new BasicNameValuePair("LastName", ""));
		form.add(new BasicNameValuePair(EMAIL_ID, checkIfEmpty(customerUpdateDto.getEmailId())));
		form.add(new BasicNameValuePair(HOUSE_NO, extractAddressData(customerUpdateDto.getAddressLines(), 0)));
		form.add(new BasicNameValuePair(BUILDING_NAME, extractAddressData(customerUpdateDto.getAddressLines(), 1)));
		form.add(new BasicNameValuePair(STREET_ROAD, extractAddressData(customerUpdateDto.getAddressLines(), 2)));
		form.add(new BasicNameValuePair(COLONY_LOCALITY, extractAddressData(customerUpdateDto.getAddressLines(), 3)));
		form.add(new BasicNameValuePair(CITY, checkIfEmpty(customerUpdateDto.getCity())));
		form.add(new BasicNameValuePair("CityOther", ""));
//		if (customerUpdateDto.getBirthday() != null)
//			form.add(new BasicNameValuePair(BIRTHDATE, customerUpdateDto.getBirthday().toString()));
//		if (customerUpdateDto.getAnniversary() != null)
//			form.add(new BasicNameValuePair(ANNIVERSARYDATE, customerUpdateDto.getAnniversary().toString()));
		form.add(new BasicNameValuePair(PIN_CODE, checkIfEmpty(customerUpdateDto.getPincode())));

		UrlEncodedFormEntity updateProfileEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

		HttpPost sendPostRequest = new HttpPost(url);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		sendPostRequest.setEntity(updateProfileEntity);

		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, UPDATE_MEMBER, locationCode, vendor, false);
		setCommonRequestLoyaltyData(loyaltyAudit, MapperUtil.getJsonString(form), mobileNumber, null);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			log.info("Response: " + httpResponseUtil.getResponse());
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			log.info("Response: " + httpResponseUtil.getResponse());
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}

		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());
		if (ulpBaseResponseDto.getResponseCode().trim().equalsIgnoreCase("0")) {
			saveLoyaltyAuditDaoData(loyaltyAudit, "Member updated succesfully", null, true, null,
					httpResponseUtil.getHttpResponseCode());
		}
		return ulpBaseResponseDto;
	}

	/**
	 * Gets the loyalty points balance.
	 *
	 * @param vendor the vendor
	 * @param ulpNo  the ulp no
	 * @return the loyalty points balance
	 */
	@Override
	public UlpBalanceResponseDto getloyaltyPointsBalance(VendorDao vendor, String ulpNo) {
		String locationCode = CommonUtil.getLocationCode();
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + GET_BALANCE)
				.queryParam(CARD_NO, ulpNo).build().toUriString();

		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, GET_BALANCE, locationCode, vendor, false);
		setCommonRequestLoyaltyData(loyaltyAudit, url, null, ulpNo);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		HttpGet getRequest = new HttpGet(url);
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(getRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}

		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());
		UlpBalanceResponseDto ulpBalanceResponseDto = new UlpBalanceResponseDto();
		ulpBalanceResponseDto.setResponseCode(ulpBaseResponseDto.getResponseCode().trim());
		ulpBalanceResponseDto.setResponseMessage(ulpBaseResponseDto.getResponseMessage());
		if (ulpBaseResponseDto.getResponseCode().trim().equalsIgnoreCase("0")) {
			String pointsBalance = responseDocument.getElementsByTagName(STRING).item(1).getTextContent();
			saveLoyaltyAuditDaoData(loyaltyAudit, pointsBalance, null, true, ulpNo,
					httpResponseUtil.getHttpResponseCode());
			ulpBalanceResponseDto.setBalancePoints(new BigDecimal(pointsBalance));
		}
		return ulpBalanceResponseDto;
	}

	/**
	 * Redeem loyalty points.
	 *
	 * @param vendor                 the vendor
	 * @param redeemLoyaltyPointsDto the redeem loyalty points dto
	 * @return the redeem points dto
	 */
	@Override
	public RedeemPointsDto redeemLoyaltyPoints(VendorDao vendor, UlpRedeemLoyaltyPointsDto redeemLoyaltyPointsDto) {
		String locationCode = CommonUtil.getLocationCode();
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + REDEEM_POINTS).build()
				.toUriString();
		String channelCode = getChannelCode(vendor);
		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, REDEEM_POINTS, locationCode, vendor, true);

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair(CHANNEL_CODE, channelCode));
		form.add(new BasicNameValuePair(OUTLET_CODE, locationCode));
		form.add(new BasicNameValuePair("MembershipNo", redeemLoyaltyPointsDto.getUlpId()));
		form.add(new BasicNameValuePair("RedeemedPoints", redeemLoyaltyPointsDto.getRedeemedPoints().toString()));
		form.add(new BasicNameValuePair(USER_NAME, ""));
		form.add(new BasicNameValuePair(PASS_WORD, ""));
		String uniqueId = loyaltyAudit.getLocationCode() + loyaltyAudit.getSequenceNo();
		form.add(new BasicNameValuePair(UNIQUE_ID, uniqueId));

		UrlEncodedFormEntity redeemPointsEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

		HttpPost sendPostRequest = new HttpPost(url);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		sendPostRequest.setEntity(redeemPointsEntity);

		setCommonRequestLoyaltyData(loyaltyAudit, MapperUtil.getJsonString(form), null,
				redeemLoyaltyPointsDto.getUlpId());

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, 500, e);
			voidTransaction(vendor, uniqueId);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}

		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());

		RedeemPointsDto redeemPointsDto = new RedeemPointsDto();
		redeemPointsDto.setResponseCode(ulpBaseResponseDto.getResponseCode().trim());
		redeemPointsDto.setResponseMessage(ulpBaseResponseDto.getResponseMessage());
		if (ulpBaseResponseDto.getResponseCode().trim().equalsIgnoreCase("0")) {
			String referenceNumber = responseDocument.getElementsByTagName(STRING).item(1).getTextContent();
			redeemPointsDto.setRedemptionReferenceNumber(referenceNumber);
			redeemPointsDto
					.setAuthorizationCode(responseDocument.getElementsByTagName(STRING).item(2).getTextContent());
			redeemPointsDto
					.setRedemtionProcessFlag(responseDocument.getElementsByTagName(STRING).item(3).getTextContent());
			redeemPointsDto.setBalancePoints(responseDocument.getElementsByTagName(STRING).item(4).getTextContent());
			saveLoyaltyAuditDaoData(loyaltyAudit, MapperUtil.getJsonString(redeemPointsDto), referenceNumber, true,
					redeemLoyaltyPointsDto.getUlpId(), httpResponseUtil.getHttpResponseCode());
		}

		return redeemPointsDto;
	}

	/**
	 * Reverse redeemed points.
	 *
	 * @param vendor                        the vendor
	 * @param reverseRedeemLoyaltyPointsDto the reverse redeem loyalty points dto
	 * @return the string
	 */
	@Override
	public UlpReverseRedeemResponseDto reverseRedeemedPoints(VendorDao vendor,
			UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto) {
		String locationCode = CommonUtil.getLocationCode();
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + REDEEM_POINTS_REVERSAL).build()
				.toUriString();
		String channelCode = getChannelCode(vendor);

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair(CHANNEL_CODE, channelCode));
		form.add(new BasicNameValuePair(OUTLET_CODE, locationCode));
		form.add(new BasicNameValuePair("MembershipNo", reverseRedeemLoyaltyPointsDto.getUlpId()));
		form.add(
				new BasicNameValuePair("ReversalPoints", reverseRedeemLoyaltyPointsDto.getRedeemedPoints().toString()));
		form.add(new BasicNameValuePair(USER_NAME, ""));
		form.add(new BasicNameValuePair(PASS_WORD, ""));
		String uniqueId = UUID.randomUUID().toString();
		form.add(new BasicNameValuePair(UNIQUE_ID, uniqueId));
		form.add(new BasicNameValuePair("RRNumber", reverseRedeemLoyaltyPointsDto.getRefernceNumber()));

		UrlEncodedFormEntity redeemPointsEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

		HttpPost sendPostRequest = new HttpPost(url);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		sendPostRequest.setEntity(redeemPointsEntity);

		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, REDEEM_POINTS_REVERSAL, locationCode, vendor,
				false);
		setCommonRequestLoyaltyData(loyaltyAudit, MapperUtil.getJsonString(form), null,
				reverseRedeemLoyaltyPointsDto.getUlpId());

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
			voidTransaction(vendor, uniqueId);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}

		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());
		UlpReverseRedeemResponseDto ulpReverseRedeemResponseDto = new UlpReverseRedeemResponseDto();
		if (ulpBaseResponseDto.getResponseCode().trim().equalsIgnoreCase("0")) {
			String referenceNumber = responseDocument.getElementsByTagName(STRING).item(1).getTextContent();
			ulpReverseRedeemResponseDto.setReferenceNumber(referenceNumber);
			saveLoyaltyAuditDaoData(loyaltyAudit,
					"Redeemed points reversed: " + reverseRedeemLoyaltyPointsDto.getRedeemedPoints(), referenceNumber,
					true, reverseRedeemLoyaltyPointsDto.getUlpId(), httpResponseUtil.getHttpResponseCode());
		}
		ulpReverseRedeemResponseDto.setResponseCode(ulpBaseResponseDto.getResponseCode().trim());
		ulpReverseRedeemResponseDto.setResponseMessage(ulpBaseResponseDto.getResponseMessage());
		return ulpReverseRedeemResponseDto;
	}

	/**
	 * Avail loyalty discount.
	 *
	 * @param vendor         the vendor
	 * @param ulpDiscountDto the ulp discount dto
	 */
	@Override
	public UlpDiscountResponseDto availLoyaltyDiscount(VendorDao vendor, UlpDiscountDto ulpDiscountDto) {
		if (!checkDate(ulpDiscountDto.getInvoiceDate())) {
			UlpDiscountResponseDto responseDto = new UlpDiscountResponseDto();
			responseDto.setResponseCode("ERR-INT-035");
			responseDto.setResponseMessage("Invoice date cannot be > 1 month from the current date or future date");
			return responseDto;
		}
		String locationCode = CommonUtil.getLocationCode();
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + AVAIL_DISCOUNT).build()
				.toUriString();
		String channelCode = getChannelCode(vendor);

		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, AVAIL_DISCOUNT, locationCode, vendor, true);

		String discountType = getDiscountType(ulpDiscountDto.getDiscountType());
		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair(CARD_NO, ulpDiscountDto.getUlpId()));
		String uniqueId = loyaltyAudit.getLocationCode() + loyaltyAudit.getSequenceNo();
		form.add(new BasicNameValuePair("InvoiceNo", uniqueId));
		form.add(new BasicNameValuePair(CHANNEL_CODE, channelCode));
		form.add(new BasicNameValuePair(OUTLET_CODE, locationCode));
		form.add(new BasicNameValuePair("InvoiceDate",
				CalendarUtils.formatDateToString(ulpDiscountDto.getInvoiceDate(), DATE_FORMAT)));
		form.add(new BasicNameValuePair("DiscountType", discountType));
		UrlEncodedFormEntity discountEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

		HttpPost sendPostRequest = new HttpPost(url);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		sendPostRequest.setEntity(discountEntity);

		setCommonRequestLoyaltyData(loyaltyAudit, MapperUtil.getJsonString(form), null, ulpDiscountDto.getUlpId());

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
			voidTransaction(vendor, uniqueId);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}
		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());

		if (ulpBaseResponseDto.getResponseCode().trim().equalsIgnoreCase("0")) {
			saveLoyaltyAuditDaoData(loyaltyAudit, "Discount availed successfully: " + ulpDiscountDto.getDiscountType(),
					null, true, ulpDiscountDto.getUlpId(), httpResponseUtil.getHttpResponseCode());
		}

		return mapDiscountResponseDto(ulpDiscountDto.getUlpId(), ulpDiscountDto.getDiscountType(),
				ulpDiscountDto.getInvoiceDate(), uniqueId, ulpBaseResponseDto.getResponseCode().trim(),
				ulpBaseResponseDto.getResponseMessage());
	}

	/**
	 * @return
	 */
	private UlpDiscountResponseDto mapDiscountResponseDto(String ulpId, String discountType, Date transactionDate,
			String transactionId, String responseCode, String responseMessage) {

		UlpDiscountResponseDto ulpDiscountResponseDto = new UlpDiscountResponseDto();
		ulpDiscountResponseDto.setUlpId(ulpId);
		ulpDiscountResponseDto.setDiscountType(discountType);
		ulpDiscountResponseDto.setTransactionDate(transactionDate);
		ulpDiscountResponseDto.setTransactionId(transactionId);
		ulpDiscountResponseDto.setResponseCode(responseCode);
		ulpDiscountResponseDto.setResponseMessage(responseMessage);

		return ulpDiscountResponseDto;
	}

	/**
	 * Reverse availed discount.
	 *
	 * @param vendor              the vendor
	 * @param billCancellationDto the bill cancellation dto
	 */
	@Override
	public UlpBaseResponseDto reverseAvailedDiscount(VendorDao vendor, UlpBillCancellationDto billCancellationDto) {
		if (!checkDate(billCancellationDto.getInvoiceCancelDate())) {
			UlpBaseResponseDto responseDto = new UlpBaseResponseDto();
			responseDto.setResponseCode("ERR-INT-035");
			responseDto.setResponseMessage("Invoice date cannot be > 1 month from the current date or future date");
			return responseDto;
		}
		String locationCode = CommonUtil.getLocationCode();
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + BILL_CANCEL).build().toUriString();
		String channelCode = getChannelCode(vendor);
		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, BILL_CANCEL, locationCode, vendor, true);

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair(CARD_NO, billCancellationDto.getUlpId()));
		String uniqueId = loyaltyAudit.getLocationCode() + loyaltyAudit.getSequenceNo();
		String discountType = getDiscountType(billCancellationDto.getDiscountType());
		form.add(new BasicNameValuePair("InvoiceNo", billCancellationDto.getTransactionId()));
		form.add(new BasicNameValuePair(CHANNEL_CODE, channelCode));
		form.add(new BasicNameValuePair(OUTLET_CODE, locationCode));
		form.add(new BasicNameValuePair("DateOfTransaction",
				CalendarUtils.formatDateToString(billCancellationDto.getInvoiceCancelDate(), DATE_FORMAT)));
		form.add(new BasicNameValuePair("DiscountType", discountType));
		UrlEncodedFormEntity reverseDiscountEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

		HttpPost sendPostRequest = new HttpPost(url);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		sendPostRequest.setEntity(reverseDiscountEntity);

		setCommonRequestLoyaltyData(loyaltyAudit, MapperUtil.getJsonString(form), null, billCancellationDto.getUlpId());

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
			voidTransaction(vendor, uniqueId);
			throw new ServiceException(EXCEPTION_MSG, ERR_INT_010, e, Map.of(VENDOR_NAME, ENCIRCLE));
		}

		UlpBaseResponseDto ulpBaseResponseDto = validateErrorCode(
				responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
				httpResponseUtil.getHttpResponseCode());

		if (ulpBaseResponseDto.getResponseCode().trim().equalsIgnoreCase("0")) {
			saveLoyaltyAuditDaoData(loyaltyAudit,
					"Bill cancelled successfully: " + billCancellationDto.getDiscountType(), null, true,
					billCancellationDto.getUlpId(), httpResponseUtil.getHttpResponseCode());
		}

		return ulpBaseResponseDto;
	}

	/**
	 * Void transaction.
	 *
	 * @param vendor   the vendor
	 * @param uniqueId the unique id
	 */
	@Override
	public void voidTransaction(VendorDao vendor, String uniqueId) {
		String locationCode = CommonUtil.getLocationCode();
		String url = UriComponentsBuilder.fromUriString(vendor.getBaseurl() + "/" + VOID_TRANSACTION).build()
				.toUriString();
		String channelCode = getChannelCode(vendor);

		List<NameValuePair> form = new ArrayList<>();
		form.add(new BasicNameValuePair(CHANNEL_CODE, channelCode));
		form.add(new BasicNameValuePair(OUTLET_CODE, locationCode));
		form.add(new BasicNameValuePair(USER_NAME, ""));
		form.add(new BasicNameValuePair(PASS_WORD, ""));
		form.add(new BasicNameValuePair(UNIQUE_ID, uniqueId));

		UrlEncodedFormEntity voidEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

		HttpPost sendPostRequest = new HttpPost(url);
		sendPostRequest.addHeader(CONTENT_TYPE, APPLICATION_URL_ENCODED);
		sendPostRequest.setEntity(voidEntity);

		LoyaltyAuditDao loyaltyAudit = getInitialLoyaltyAuditDaoData(url, VOID_TRANSACTION, locationCode, vendor,
				false);
		setCommonRequestLoyaltyData(loyaltyAudit, MapperUtil.getJsonString(form), null, null);

		HttpResponseUtil httpResponseUtil = new HttpResponseUtil();
		Document responseDocument = null;
		try {
			httpResponseUtil = HttpClientUtil.sendHttpRequest(sendPostRequest, vendor.getRetryCount(),
					vendor.getTimeOutSeconds(), null);
			responseDocument = DocumentBuilderUtil.buildDocumentFromXml(httpResponseUtil.getResponse());
		} catch (SSLException | ConnectTimeoutException | SocketException | RequestAbortedException
				| SocketTimeoutException ex) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), ex);
			throwConnectionTimedoutException(ex);
		} catch (IOException | ParserConfigurationException | SAXException e) {
			saveLoyaltyAuditDaoWhenException(loyaltyAudit, httpResponseUtil.getHttpResponseCode(), e);
		}
		if (responseDocument != null) {
			validateErrorCode(responseDocument.getElementsByTagName(STRING).item(0).getTextContent(), loyaltyAudit,
					httpResponseUtil.getHttpResponseCode());
		}
		if (responseDocument != null && responseDocument.getElementsByTagName(STRING).item(0).getTextContent().trim()
				.equalsIgnoreCase("0")) {
			saveLoyaltyAuditDaoData(loyaltyAudit, "Transaction has been voided successfully: " + uniqueId, null, true,
					null, httpResponseUtil.getHttpResponseCode());
		}
	}

	/**
	 * Maps the tag value to customer dto based on the tag name.
	 *
	 * @param searchResultDoc the search result doc
	 * @return the customer dto
	 */
	private CustomerDto mapSearchResultDocToCustomerDto(Document searchResultDoc) {

		CustomerDto customerDto = new CustomerDto();
		customerDto.setCustomerName(searchResultDoc.getElementsByTagName("FIRSTNAME").item(0).getTextContent());
		customerDto.setMobileNumber(searchResultDoc.getElementsByTagName(MOBILE_NUMBER).item(0).getTextContent());
		customerDto.setEmailId(searchResultDoc.getElementsByTagName(EMAIL_ID).item(0).getTextContent());
		List<String> addressLines = new ArrayList<>();
		addressLines.add(searchResultDoc.getElementsByTagName(HOUSE_NO).item(0).getTextContent());
		addressLines.add(searchResultDoc.getElementsByTagName(BUILDING_NAME).item(0).getTextContent());
		addressLines.add(searchResultDoc.getElementsByTagName(STREET_ROAD).item(0).getTextContent());
		addressLines.add(searchResultDoc.getElementsByTagName(COLONY_LOCALITY).item(0).getTextContent());
		customerDto.setAddressLines(addressLines);
		customerDto.setCity(searchResultDoc.getElementsByTagName(CITY).item(0).getTextContent());
		customerDto.setPincode(searchResultDoc.getElementsByTagName(PIN_CODE).item(0).getTextContent());
		customerDto.setUlpId(searchResultDoc.getElementsByTagName("ULPNo").item(0).getTextContent());

		String birthDateString = searchResultDoc.getElementsByTagName(BIRTHDATE).item(0).getTextContent();
		if (!StringUtils.isEmpty(birthDateString)) {
			customerDto.setBirthday(CalendarUtils.convertStringToDate(birthDateString, DATE_FORMAT));
		}
		String anniversaryDateString = searchResultDoc.getElementsByTagName(ANNIVERSARYDATE).item(0).getTextContent();
		if (!StringUtils.isEmpty(anniversaryDateString)) {
			customerDto.setAnniversary(CalendarUtils.convertStringToDate(anniversaryDateString, DATE_FORMAT));
		}

		customerDto.setUlpId(searchResultDoc.getElementsByTagName("ULPNo").item(0).getTextContent());
		String pointsBalance = searchResultDoc.getElementsByTagName("PointBalance").item(0).getTextContent();
		if (!StringUtils.isEmpty(pointsBalance)) {
			customerDto.setPointBalance(new BigDecimal(pointsBalance));
		}
		customerDto.setCurrentTier(searchResultDoc.getElementsByTagName("CurrentTier").item(0).getTextContent());
		String enrollmentDateString = searchResultDoc.getElementsByTagName("EnrollmentDate").item(0).getTextContent();
		if (!StringUtils.isEmpty(enrollmentDateString)) {
			customerDto.setEnrollmentDate(CalendarUtils.convertStringToDate(enrollmentDateString, DATE_FORMAT));
		}
		String memberBlocked = searchResultDoc.getElementsByTagName("MemberBlocked").item(0).getTextContent();
		if (!StringUtils.isEmpty(enrollmentDateString)) {
			customerDto.setIsMemberBlocked(!memberBlocked.equalsIgnoreCase("N"));
		}
		customerDto.setBirthdayDiscount(
				searchResultDoc.getElementsByTagName("EligibleForBirthdayDiscount").item(0).getTextContent());
		customerDto.setBirthdayValdityPeriod(
				searchResultDoc.getElementsByTagName("BirthdayValidityPeriod").item(0).getTextContent());
		customerDto.setAnniversaryDiscount(
				searchResultDoc.getElementsByTagName("EligibleForAniversaryDiscount").item(0).getTextContent());
		customerDto.setAnniversaryValidityPeriod(
				searchResultDoc.getElementsByTagName("AnniversaryValidityPeriod").item(0).getTextContent());
		customerDto.setSpouseBirthdayDiscount(
				searchResultDoc.getElementsByTagName("EligibleForSpouseDOBDiscount").item(0).getTextContent());
		customerDto.setSpouseBirthdayValidityPeriod(
				searchResultDoc.getElementsByTagName("SpouseBirthdayValidityPeriod").item(0).getTextContent());
		customerDto.setChild1BirthdayDiscount(
				searchResultDoc.getElementsByTagName("EligibleForChild1DOBDiscount").item(0).getTextContent());
		customerDto.setChild1BirthdayValidityPeriod(
				searchResultDoc.getElementsByTagName("Child1BirthdayValidityPeriod").item(0).getTextContent());
		customerDto.setChild2BirthdayDiscount(
				searchResultDoc.getElementsByTagName("EligibleForChild2DOBDiscount").item(0).getTextContent());
		customerDto.setChild2BirthdayValidityPeriod(
				searchResultDoc.getElementsByTagName("Child2BirthdayValidityPeriod").item(0).getTextContent());

		return customerDto;
	}

	/**
	 * Validate Error code. If the error code is equal to 0, then there is no error
	 * Otherwise pass the error code to netcarrot error service
	 *
	 * @param errorCode    the error code
	 * @param loyaltyAudit the loyalty audit
	 * @return true, if successful
	 */
	private UlpBaseResponseDto validateErrorCode(String errorCode, LoyaltyAuditDao loyaltyAudit,
			Integer httpResponseCode) {
		if (!errorCode.trim().equalsIgnoreCase("0")) {
			return netCarrotErrorService.handleErrorCode(errorCode, loyaltyAudit, httpResponseCode);
		} else {
			UlpBaseResponseDto ulpBaseResponseDto = new UlpBaseResponseDto();
			ulpBaseResponseDto.setResponseCode(errorCode);
			return ulpBaseResponseDto;
		}
	}

	/**
	 * Check if empty.
	 *
	 * @param value the value
	 * @return the string
	 */
	private String checkIfEmpty(String value) {
		return StringUtils.isEmpty(value) ? "" : value;
	}

	/**
	 * Extract address data.
	 *
	 * @param addressDetails the address details
	 * @param index          the index
	 * @return the string
	 */
	private String extractAddressData(List<String> addressDetails, Integer index) {
		if (CollectionUtils.isEmpty(addressDetails) || index >= addressDetails.size()) {
			return "";
		} else {
			return addressDetails.get(index);
		}
	}

	/**
	 * Gets the channel code.
	 *
	 * @param vendor the vendor
	 * @return the channel code
	 */
	private String getChannelCode(VendorDao vendor) {
		JsonObject jsonObject = new JsonParser().parse(vendor.getVendorDetails()).getAsJsonObject();
		return jsonObject.getAsJsonObject("data").get("senderID").getAsString();
	}

	/**
	 * Gets the discount type.
	 *
	 * @param discountType the discount type
	 * @return the discount type
	 */
	private String getDiscountType(String discountType) {
		if (discountType.equalsIgnoreCase("ANNIVERSARY")) {
			return "A";
		} else if (discountType.equalsIgnoreCase("BIRTHDAY")) {
			return "MB";
		} else if (discountType.equalsIgnoreCase("SPOUSE_BIRTHDAY")) {
			return "MSB";
		}
		throw new ServiceException("Invalid discount type", "ERR-INT-012");
	}

	/**
	 * Gets the common loyalty audit data.
	 *
	 * @param url             the url
	 * @param transactionType the transaction type
	 * @param locationCode    the location code
	 * @param vendor          the integration
	 * @return the common loyalty audit data
	 */
	private LoyaltyAuditDao getInitialLoyaltyAuditDaoData(String url, String transactionType, String locationCode,
			VendorDao vendor, boolean maxSeqQuery) {
		LoyaltyAuditDao loyaltyAudit = new LoyaltyAuditDao();
		Integer maxId = 1;
		if (maxSeqQuery)
			maxId = loyaltyAuditRepository.getMaxSeqNo(locationCode);
		loyaltyAudit.setSequenceNo(++maxId);
		loyaltyAudit.setRequestTime(CalendarUtils.getCurrentDate());
		loyaltyAudit.setUrl(url);
		loyaltyAudit.setVendor(vendor);
		loyaltyAudit.setTransactionType(transactionType);
		loyaltyAudit.setLocationCode(locationCode);
		return loyaltyAuditRepository.save(loyaltyAudit);
	}

	/**
	 * Save loyalty audit when the transaction is successful.
	 *
	 * @param loyaltyAudit     the loyalty audit
	 * @param httpResponseCode the http response code
	 * @param e                the e
	 */
	private void saveLoyaltyAuditDaoData(LoyaltyAuditDao loyaltyAudit, String response, String referenceNumber,
			Boolean transactionStatus, String ulpId, Integer httpResponseCode) {

		loyaltyAudit.setResponse(response);
		loyaltyAudit.setHttpStatus(httpResponseCode);
		loyaltyAudit.setUlpNo(ulpId);
		loyaltyAudit.setResponseTime(CalendarUtils.getCurrentDate());
		loyaltyAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - loyaltyAudit.getRequestTime().getTime());
		loyaltyAudit.setTransactionStatus(transactionStatus);
		loyaltyAudit.setReferenceNumber(referenceNumber);
		loyaltyAuditRepository.save(loyaltyAudit);
	}

	private void setCommonRequestLoyaltyData(LoyaltyAuditDao loyaltyAudit, String request, String mobileNumber,
			String ulpNo) {

		loyaltyAudit.setRequest(request);
		loyaltyAudit.setUlpNo(ulpNo);
		if (!StringUtils.isEmpty(mobileNumber)) {
			loyaltyAudit.setMobileNumber(MapperUtil.maskString(mobileNumber, startIndexOfMobileNumToBeMasked,
					endIndexOfMobileNumToBeMasked, 'X'));
		}
	}

	/**
	 * Save loyalty audit when exception.
	 *
	 * @param loyaltyAudit     the loyalty audit
	 * @param httpResponseCode the http response code
	 * @param e                the e
	 */
	private void saveLoyaltyAuditDaoWhenException(LoyaltyAuditDao loyaltyAudit, Integer httpResponseCode, Exception e) {
		loyaltyAudit.setHttpStatus(httpResponseCode);
		loyaltyAudit.setTransactionStatus(false);
		loyaltyAudit.setResponseTime(CalendarUtils.getCurrentDate());
		loyaltyAudit.setTotalTime(CalendarUtils.getCurrentDate().getTime() - loyaltyAudit.getRequestTime().getTime());
		loyaltyAudit.setResponse(e.getMessage());
		loyaltyAuditRepository.save(loyaltyAudit);
	}

	private void throwConnectionTimedoutException(Exception ex) {
		throw new ServiceException("Connection timed out. Please try again", "ERR-INT-038", ex);
	}

	/**
	 * Check invoice date is less than or equal to 1 month of the current date.
	 *
	 * @param date the date
	 * @return true, if successful
	 */
	private boolean checkDate(Date date) {
		LocalDate invoiceDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		LocalDate oneMonthAgo = LocalDate.now().plusMonths(-1);
		return (invoiceDate.equals(LocalDate.now())
				|| ((invoiceDate.isAfter(oneMonthAgo) || invoiceDate.isEqual(oneMonthAgo))
						&& invoiceDate.isBefore(LocalDate.now())));
	}
}
