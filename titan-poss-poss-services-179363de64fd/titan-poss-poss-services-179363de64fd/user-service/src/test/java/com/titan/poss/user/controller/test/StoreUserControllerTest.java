package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.user.UserBase;
import com.titan.poss.user.dto.request.OtpRequestDetails;
import com.titan.poss.user.dto.request.StoreAddTemporaryUserDto;
import com.titan.poss.user.dto.request.StoreAddUserDto;
import com.titan.poss.user.dto.request.StoreUpdateUserDto;
import com.titan.poss.user.dto.response.EmployeeListDto;

@ExtendWith(SpringExtension.class)
class StoreUserControllerTest extends UserBase {

	public static final String URI = "store/users";

	public static final String ADDRESS = "address";

	public static final String CASHIER = "CASHIER";

	public static final String ADDRESS_DETAILS = "{\"line1\": \"DS Max Silicon\",\"line2\": \"RR Layout, RR Nagar\",\"city\": \"Bangalore\",\"state\": \"Karnataka\",\"pincode\": \"751024\",\"country\": \"India\"}";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	private Map<String, EmployeeListDto> getEmpCodeAndData() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Map<String, EmployeeListDto> empCodes = new HashMap<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			EmployeeListDto employeeListDto = new EmployeeListDto();
			employeeListDto.setEmployeeCode(data.get("employeeCode").asText());
			employeeListDto.setEmpName(data.get("empName").asText());
			employeeListDto.setLocationCode(data.get("locationCode").asText());
			employeeListDto.setUserType(data.get("userType").asText());
			employeeListDto.setPrimaryRoleCode(data.get("primaryRoleCode").asText());
			employeeListDto.setPrimaryRoleName(data.get("primaryRoleName").asText());
			employeeListDto.setIsLoginActive(data.get("isLoginActive").asBoolean());
			employeeListDto.setIsLocked(data.get("isLocked").asBoolean());
			employeeListDto.setIsActive(data.get("isActive").asBoolean());

			empCodes.put(data.get("employeeCode").asText(), employeeListDto);
		}

		return empCodes;
	}

	@ParameterizedTest
	@ValueSource(strings = { "?isActive=true&roleCodes=BOS", "?searchField=sm.khn" })
	void testListUsers(String filter) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + filter), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "sm.khn,OK", "zxzx,BAD_REQUEST" })
	void testGetStoreUserDetails(String empcode, String status) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + empcode), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testAddStoreUserDetails")
	@ParameterizedTest
	@CsvSource({ "BOS,,OK", "BOS,CASHIER,OK", "1ROLECODE,,BAD_REQUEST", "BOS,8608455840,BAD_REQUEST",
			"BOS,abc@gmail.com,UNPROCESSABLE_ENTITY", "BOS,sm.khn@mindtree.com,BAD_REQUEST",
			"CASHIER,sm.khn,BAD_REQUEST", "CASHIER,admin,BAD_REQUEST", "BOS,1ROLECODE,BAD_REQUEST" })
	void testAddStoreUserDetails(String roleCode, String mailOrMobOrEmpCodeOrTempCode, String status) {

		String empName = String.valueOf("StoreUT" + RandomStringUtils.random(4, characters));

		StoreAddUserDto storeAddUserDto = new StoreAddUserDto();
		storeAddUserDto.setEmployeeCode(empName);
		storeAddUserDto.setEmpName(empName);
		storeAddUserDto.setEmailId(empName + "@titan.co.in");
		storeAddUserDto.setMobileNo("9" + RandomStringUtils.random(9, mobileNumString));
		storeAddUserDto.setBirthDate(CalendarUtils.getCurrentDate());
		storeAddUserDto.setPrimaryRoleCode(roleCode);
		storeAddUserDto.setIsLoginActive(true);
		storeAddUserDto.setStartDate(CalendarUtils.getCurrentDate());
		Object obj = MapperUtil.getJsonFromString(ADDRESS_DETAILS);
		JsonData jsonData = new JsonData();
		jsonData.setType(ADDRESS);
		jsonData.setData(obj);

		storeAddUserDto.setAddress(jsonData);

		if ("sm.khn".equalsIgnoreCase(mailOrMobOrEmpCodeOrTempCode)
				|| "admin".equalsIgnoreCase(mailOrMobOrEmpCodeOrTempCode))
			storeAddUserDto.setEmployeeCode(mailOrMobOrEmpCodeOrTempCode);
		else if ("BOS".equalsIgnoreCase(roleCode) && !StringUtils.isEmpty(mailOrMobOrEmpCodeOrTempCode)) {
			if ("8608455840".equals(mailOrMobOrEmpCodeOrTempCode))
				storeAddUserDto.setMobileNo(mailOrMobOrEmpCodeOrTempCode);
			else if (CASHIER.equalsIgnoreCase(mailOrMobOrEmpCodeOrTempCode)
					|| "1ROLECODE".equalsIgnoreCase(mailOrMobOrEmpCodeOrTempCode)) {
				storeAddUserDto.setTempRoleCodes(Set.of(mailOrMobOrEmpCodeOrTempCode));
				storeAddUserDto.setExpiryDate(CalendarUtils.addTimeToCurrentTime(null, 1, null, null, null, null));
			} else {
				storeAddUserDto.setEmailId(mailOrMobOrEmpCodeOrTempCode);
			}
		}

		HttpEntity<StoreAddUserDto> entity = new HttpEntity<>(storeAddUserDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "bos.khn,,OK", "yen,address,OK", "gwen,false,OK", "gwen,true,OK", "zxzx,,BAD_REQUEST", ",,OK",
			",sm.khn@mindtree.com,BAD_REQUEST", ",8608455840,BAD_REQUEST", ",address,BAD_REQUEST", "hun,,BAD_REQUEST",
			"gwen,CASHIER,OK", "ten,SM-Update,BAD_REQUEST", "ten,CASHIER-Update,OK", "ten,CASHIER-Remove,OK" })
	void testUpdateUserDetails(String empCode, String emailOrMobNoOrAddressOrIsActiveOrTempCode, String status) {
		Map<String, EmployeeListDto> empCodeAndData = getEmpCodeAndData();
		String[] empCodeList = empCodeAndData.keySet().toArray(new String[0]);

		EmployeeListDto employeeDto = new EmployeeListDto();
		StoreUpdateUserDto storeUpdateUserDto = new StoreUpdateUserDto();
		String employeeCode;

		if ((empCode != null) && (!"yen".equals(empCode))) {
			storeUpdateUserDto.setEmpName(empCode);
			employeeCode = empCode;
		} else {
			for (String emp : empCodeList) {
				if (BooleanUtils.isTrue(empCodeAndData.get(emp).getIsLoginActive()))
					employeeDto = empCodeAndData.get(emp);
			}
			employeeCode = employeeDto.getEmployeeCode();
			storeUpdateUserDto.setEmpName(employeeDto.getEmpName());
		}

		if (emailOrMobNoOrAddressOrIsActiveOrTempCode != null) {

			switch (emailOrMobNoOrAddressOrIsActiveOrTempCode) {
			case "sm.khn@mindtree.com":
				storeUpdateUserDto.setEmailId(emailOrMobNoOrAddressOrIsActiveOrTempCode);
				break;

			case "8608455840":
				storeUpdateUserDto.setMobileNo(emailOrMobNoOrAddressOrIsActiveOrTempCode);
				break;

			case "false":
				storeUpdateUserDto.setIsLoginActive(false);
				break;

			case "true":
				storeUpdateUserDto.setIsLoginActive(true);
				break;

			case CASHIER:
				storeUpdateUserDto.setAddTempRoleCodes(Set.of(CASHIER));
				storeUpdateUserDto.setStartDate(CalendarUtils.addTimeToCurrentTime(null, 1, null, null, null, null));
				storeUpdateUserDto.setExpiryDate(CalendarUtils.addTimeToCurrentTime(null, 2, null, null, null, null));
				break;

			case "CASHIER-Update":
				storeUpdateUserDto.setUpdateTempRoleCode(CASHIER);
				storeUpdateUserDto
						.setUpdateTempStartTime(CalendarUtils.addTimeToCurrentTime(null, 5, null, null, null, null));
				storeUpdateUserDto
						.setUpdateTempExpiryTime(CalendarUtils.addTimeToCurrentTime(null, null, 1, null, null, null));
				break;

			case "SM-Update":
				storeUpdateUserDto.setUpdateTempRoleCode("SM");
				storeUpdateUserDto
						.setUpdateTempStartTime(CalendarUtils.addTimeToCurrentTime(null, 2, null, null, null, null));
				storeUpdateUserDto
						.setUpdateTempExpiryTime(CalendarUtils.addTimeToCurrentTime(null, 3, null, null, null, null));
				break;

			case "CASHIER-Remove":
				storeUpdateUserDto.setRemoveTempRoleCodes(Set.of(CASHIER));
				break;

			default:
				if ("BAD_REQUEST".equals(status)) {
					Object obj = MapperUtil.getJsonFromString(
							"{\"line1\": \"\",\"line2\": \"RR Layout, RR Nagar\",\"city\": \"Bangalore\",\"state\": \"Karnataka\",\"pincode\": \"751024\",\"country\": \"India\"}");
					JsonData jsonData = new JsonData();
					jsonData.setType(ADDRESS);
					jsonData.setData(obj);

					storeUpdateUserDto.setAddress(jsonData);
				} else {
					Object obj = MapperUtil.getJsonFromString(ADDRESS_DETAILS);
					JsonData jsonData = new JsonData();
					jsonData.setType(ADDRESS);
					jsonData.setData(obj);

					storeUpdateUserDto.setAddress(jsonData);
					storeUpdateUserDto.setJoiningDate(CalendarUtils.getCurrentDate());
					storeUpdateUserDto.setBirthDate(CalendarUtils.addTimeToCurrentTime(-59, -9, -4, -2, -10, null));
					storeUpdateUserDto.setMobileNo("8" + RandomStringUtils.random(9, mobileNumString));
					storeUpdateUserDto.setEmailId(RandomStringUtils.random(4, characters) + "@mindtree.com");
					employeeCode = empCode;
				}
			}

		}

		HttpEntity<StoreUpdateUserDto> entity = new HttpEntity<>(storeUpdateUserDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + employeeCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testGenerateOtp() {

		HttpStatus httpStatus = HttpStatus.OK;

		OtpRequestDetails otpRequestDetails = new OtpRequestDetails();
		otpRequestDetails.setEmpCode("yen");
		otpRequestDetails.setOtpType(OtpTypeEnum.FORGOT_PASSWORD.name());
		otpRequestDetails.setRequestedValue("forgot-password");

		HttpEntity<OtpRequestDetails> entity = new HttpEntity<>(otpRequestDetails, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/generate-otps"),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().equals(httpStatus));
	}

	@Test
	void testAddTempUser() {

		String empName = String.valueOf("StoreUT" + RandomStringUtils.random(2, characters));

		StoreAddTemporaryUserDto addTempUserDto = new StoreAddTemporaryUserDto();

		addTempUserDto.setEmpName(empName);
		addTempUserDto.setMobileNo(
				String.valueOf(RandomStringUtils.random(1, "9876") + RandomStringUtils.random(9, mobileNumString)));
		addTempUserDto.setPrimaryRoleCode(CASHIER);
		addTempUserDto.setBirthDate(CalendarUtils.getCurrentDate());
		addTempUserDto.setResignationDate(CalendarUtils.addTimeToCurrentTime(null, 2, null, null, null, null));
		addTempUserDto.setIsLoginActive(true);

		Object obj = MapperUtil.getJsonFromString(ADDRESS_DETAILS);
		JsonData jsonData = new JsonData();
		jsonData.setType(ADDRESS);
		jsonData.setData(obj);

		addTempUserDto.setAddress(jsonData);

		HttpEntity<StoreAddTemporaryUserDto> entity = new HttpEntity<>(addTempUserDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/temp-users"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

}
