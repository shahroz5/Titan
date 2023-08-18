/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.controller.test;

import static org.junit.Assert.assertTrue;

import org.apache.commons.lang.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.sales.SalesBase;
import com.titan.poss.sales.dto.request.CustomerAddDto;
import com.titan.poss.sales.dto.request.CustomerUpdateDto;

/**
 * CustomerController test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class CustomerControllerTest extends SalesBase {

	public static final String URI = "customers";

	public static final String ADDRESS = "\"addressLines\": [\"DS Max Silicon\", \"RR Layout, RR Nagar\"],\"city\": \"Bangalore\",\r\n"
			+ "\"state\": \"Karnataka\",\"pincode\": \"751024\",\r\n" + "\"country\": \"India\",\r\n"
			+ "\"zone\": \"Zone 1\"\r\n";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	private void setRegualrCustomerData(CustomerAddDto customerAddDto, String otherCheck) {
		Object obj = MapperUtil.getJsonFromString("    {\r\n" + "        \"catchmentName\": \"ERODE\",\r\n"
				+ "    	\"birthday\": \"1990-01-01T23:28:56.782Z\",\r\n"
				+ "    	\"spouseBirthday\": \"1992-01-01T23:28:56.782Z\",\r\n"
				+ "    	\"anniversary\": \"2014-01-01T23:28:56.782Z\",\r\n" + "    	\"panCardNo\": \"AAAAA0000A\",\r\n"
				+ "    	\"canSendSMS\": \"true\",\r\n" + "    	\"isForm60AndIdProofSubmitted\": \"true\",\r\n"
				+ ADDRESS + "    }\r\n");

		JsonData jsonData = new JsonData();

		if ("CustomerTypeChange".equalsIgnoreCase(otherCheck))
			jsonData.setType(CustomerTypeEnum.ONETIME.name());
		else
			jsonData.setType(customerAddDto.getCustomerType());

		jsonData.setData(obj);

		customerAddDto.setCustomerDetails(jsonData);

		if ("NoMobileNumber".equalsIgnoreCase(otherCheck))
			customerAddDto.setMobileNumber(null);

		if ("RemoveTitle".equalsIgnoreCase(otherCheck))
			customerAddDto.setTitle(null);

	}

	private void setInternationalCustomerDto(CustomerAddDto customerAddDto, String otherCheck) {
		Object obj = MapperUtil.getJsonFromString(
				"{  \"catchmentName\": \"ERODE\",      \"panCardNo\": \"AAAAA0000A\",       \"canSendSMS\": true,       \"isForm60AndIdProofSubmitted\": true,       \"gstNo\": \"22AAAAA0000A1Z5\",  "
						+ ADDRESS
						+ ",       \"companyName\": \"Delta\",       \"partnerProprietorship\": \"XYZ\",       \"isNRI\": false    }");

		JsonData jsonData = new JsonData();
		jsonData.setType(customerAddDto.getCustomerType());
		jsonData.setData(obj);

		if ("NoDetails".equalsIgnoreCase(otherCheck))
			customerAddDto.setCustomerDetails(null);
		else
			customerAddDto.setCustomerDetails(jsonData);

		if ("NoMobileNumber".equalsIgnoreCase(otherCheck))
			customerAddDto.setMobileNumber(null);

		if ("RemoveTitle".equalsIgnoreCase(otherCheck))
			customerAddDto.setTitle(null);
	}

	private void setInstitutionalCustomerDto(CustomerAddDto customerAddDto, String otherCheck) {
		Object obj = MapperUtil.getJsonFromString("    {\r\n" + "    	\"panCardNo\": \"AAAAA0000A\",\r\n"
				+ "        \"catchmentName\": \"ERODE\",\r\n" + "    	\"contactNames\": [\"Suresh\", \"Ramesh\"],\r\n"
				+ "    	\"emailIds\": [\"suresh@gmail.com\", \"ramesh@rediffmail.com\"],\r\n"
				+ "    	\"contactNumbers\": [\"9988776655\", \"7878655677\"],\r\n"
				+ "    	\"fax\": \"+91-80-1234\",\r\n" + "    	\"gstNo\": \"22AAAAA0000A1Z5\",\r\n" + ADDRESS
				+ "    }\r\n");

		JsonData jsonData = new JsonData();
		jsonData.setType(customerAddDto.getCustomerType());

		if ("NoAddress1".equalsIgnoreCase(otherCheck)) {
			obj = MapperUtil.getJsonFromString("    {\r\n" + "    	\"panCardNo\": \"AAAAA0000A\",\r\n"
					+ "        \"catchmentName\": \"ERODE\",\r\n"
					+ "    	\"contactNames\": [\"Suresh\", \"Ramesh\"],\r\n"
					+ "    	\"emailIds\": [\"suresh@gmail.com\", \"ramesh@rediffmail.com\"],\r\n"
					+ "    	\"contactNumbers\": [\"9988776655\", \"7878655677\"],\r\n"
					+ "    	\"fax\": \"+91-80-1234\",\r\n" + "    	\"gstNo\": \"22AAAAA0000A1Z5\"\r\n" + "    }\r\n");

			jsonData.setData(obj);
		} else if ("NoAddress2".equalsIgnoreCase(otherCheck)) {
			obj = MapperUtil.getJsonFromString("    {\r\n" + "    	\"panCardNo\": \"AAAAA0000A\",\r\n"
					+ "        \"catchmentName\": \"ERODE\",\r\n"
					+ "    	\"contactNames\": [\"Suresh\", \"Ramesh\"],\r\n"
					+ "    	\"emailIds\": [\"suresh@gmail.com\", \"ramesh@rediffmail.com\"],\r\n"
					+ "    	\"contactNumbers\": [\"9988776655\", \"7878655677\"],\r\n"
					+ "    	\"fax\": \"+91-80-1234\",\r\n" + "    	\"gstNo\": \"22AAAAA0000A1Z5\",\r\n"
					+ "\"addressLines\": [\"DS Max Silicon\", \"RR Layout, RR Nagar\"],\"city\": \"Bengaluru\",\r\n"
					+ "\"state\": \"Karnataka\",\"pincode\": \"560002\",\r\n" + "\"country\": \"\"\r\n" + "    }\r\n");

			jsonData.setData(obj);
		} else {
			jsonData.setData(obj);
		}

		customerAddDto.setCustomerDetails(jsonData);

		if ("SetTitle".equalsIgnoreCase(otherCheck))
			customerAddDto.setTitle("Mr");

	}

	private void setOneTimeCustomer(CustomerAddDto customerAddDto, String otherCheck) {
		Object obj = MapperUtil
				.getJsonFromString("    {\r\n" + "        \"catchmentName\": \"ERODE\",\r\n" + ADDRESS + "    }\r\n");

		JsonData jsonData = new JsonData();
		jsonData.setType(customerAddDto.getCustomerType());

		if ("NoData".equalsIgnoreCase(otherCheck))
			jsonData.setData(null);
		else
			jsonData.setData(obj);

		if ("NoJson".equalsIgnoreCase(otherCheck))
			customerAddDto.setCustomerDetails(null);
		else
			customerAddDto.setCustomerDetails(jsonData);

		if ("RemoveTitle".equalsIgnoreCase(otherCheck))
			customerAddDto.setTitle(null);

	}

	@ParameterizedTest
	@CsvSource({ "REGULAR,,,,OK", "INTERNATIONAL,,,,OK", "INSTITUTIONAL,,,,OK", "ONETIME,,,,OK",
			"REGULAR,9999999999,,,BAD_REQUEST", "INTERNATIONAL,,one@gmail.com,,BAD_REQUEST",
			"INTERNATIONAL,,,NoDetails,UNPROCESSABLE_ENTITY", "ONETIME,,,NoData,BAD_REQUEST", "ONETIME,,,NoJson,OK",
			"REGULAR,,,CustomerTypeChange,BAD_REQUEST", "REGULAR,,,NoMobileNumber,UNPROCESSABLE_ENTITY",
			"INTERNATIONAL,,,NoMobileNumber,UNPROCESSABLE_ENTITY", "INSTITUTIONAL,,,SetTitle,UNPROCESSABLE_ENTITY",
			"REGULAR,,,RemoveTitle,UNPROCESSABLE_ENTITY", "INTERNATIONAL,,,RemoveTitle,UNPROCESSABLE_ENTITY",
			"ONETIME,,,RemoveTitle,UNPROCESSABLE_ENTITY", "INSTITUTIONAL,,,NoAddress1,UNPROCESSABLE_ENTITY",
			"INSTITUTIONAL,,,NoAddress2,UNPROCESSABLE_ENTITY" })
	void testCreateCustomer(String customerType, String mobileNo, String emailId, String otherCheck, String status) {
		CustomerAddDto customerAddDto = new CustomerAddDto();

		customerAddDto.setCustomerType(customerType);

		if (!CustomerTypeEnum.INSTITUTIONAL.equals(CustomerTypeEnum.valueOf(customerType)))
			customerAddDto.setTitle("Mr");

		if (!CustomerTypeEnum.ONETIME.equals(CustomerTypeEnum.valueOf(customerType)))
			customerAddDto.setMobileNumber(RandomStringUtils.random(10, mobileNumString));

		if (!StringUtils.isEmpty(mobileNo))
			customerAddDto.setMobileNumber(mobileNo);

		if (!StringUtils.isEmpty(emailId))
			customerAddDto.setEmailId(emailId);

		customerAddDto.setCustomerName(("Test " + RandomStringUtils.random(4, characters)).toUpperCase());

		switch (customerType) {
		case "REGULAR":
			setRegualrCustomerData(customerAddDto, otherCheck);
			break;

		case "INTERNATIONAL":
			setInternationalCustomerDto(customerAddDto, otherCheck);
			break;

		case "INSTITUTIONAL":
			setInstitutionalCustomerDto(customerAddDto, otherCheck);
			break;

		case "ONETIME":
			setOneTimeCustomer(customerAddDto, otherCheck);
			break;

		default:
			break;
		}

		HttpEntity<CustomerAddDto> entity = new HttpEntity<>(customerAddDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "700170118645,ULP_ID,OK", "xxx,ULP_ID,BAD_REQUEST", "9012330103,MOBILE_NO,OK",
			"00000,MOBILE_NO,BAD_REQUEST", "37AAFCA6140B1Z5,INSTITUTIONAL_TAX_NO,OK",
			"CPYPR122EE,CUSTOMER_TAX_NO,BAD_REQUEST" })
	void testGetCustomerSearchTypeEnum(String searchField, String searchType, String status) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(
						URI + "?searchField=" + searchField + "&searchType=" + SearchTypeEnum.valueOf(searchType)),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "01001,BAD_REQUEST" })
	void testGetCustomerInteger(int customerId, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + customerId),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "1001,BAD_REQUEST" })
	void testUpdateCustomer(int customerId, String status) {

		CustomerUpdateDto updateCustomerDto = new CustomerUpdateDto();

		HttpEntity<CustomerUpdateDto> entity = new HttpEntity<>(updateCustomerDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + customerId),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "11111,MOBILE_NO,OK", "999@,MOBILE_NO,UNPROCESSABLE_ENTITY", "aa,EMAIL_ID,OK",
			"zzz,INSTITUTIONAL_TAX_NO,OK", "aaa,CUSTOMER_TAX_NO,OK", "zzz,INVALID,UNPROCESSABLE_ENTITY" })
	void testIsUniqueMobileNo(String mobileNo, String searchType, String status) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/unique-checks?value=" + mobileNo + "&searchType=" + searchType),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
