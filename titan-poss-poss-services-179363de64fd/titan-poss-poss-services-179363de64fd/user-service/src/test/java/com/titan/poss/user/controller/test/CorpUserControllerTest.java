package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
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
import com.titan.poss.user.dto.request.CorporateAddUserDto;
import com.titan.poss.user.dto.request.CorporateUpdateUserDto;
import com.titan.poss.user.dto.request.OtpRequestDetails;
import com.titan.poss.user.dto.response.EmployeeListDto;

@ExtendWith(SpringExtension.class)
class CorpUserControllerTest extends UserBase {

	public static final String URI = "corp/users";

	public static final String ADDRESS = "{\"line1\": \"DS Max Silicon\",\"line2\": \"RR Layout, RR Nagar\",\"city\": \"Bangalore\",\"state\": \"Karnataka\",\"pincode\": \"751024\",\"country\": \"India\"}";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("admin", "Welcome@123"));
	}

	private Map<String, EmployeeListDto> getEmpCodeAndData() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI + "?size=250"), HttpMethod.GET,
				entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Map<String, EmployeeListDto> empCodes = new HashMap<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			EmployeeListDto employeeListDto = new EmployeeListDto();
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

	private JsonData setAddress(String otherCheck) {
		Object obj;

		if ("addressWrong".equals(otherCheck)) {
			obj = MapperUtil.getJsonFromString(
					"{\"line1\": \"DS Max Silicon\",\"line2\": \"RR Layout, RR Nagar\",\"city\": \"Bangalore\",\"state\": \"Karnataka\",\"pincode\": \"751024\"}");

		} else {
			obj = MapperUtil.getJsonFromString(ADDRESS);

		}

		JsonData jsonData = new JsonData();
		if ("addressType".equals(otherCheck)) {
			jsonData.setType("zzzz");
		} else {
			jsonData.setType("address");
		}
		jsonData.setData(obj);

		return jsonData;
	}

	private CorporateAddUserDto addDetails(String empName, String roleCode, String locOrRegCodeOrMailorEmpCode,
			String otherCheck) {

		String domain = "@titan.co.in";

		if ("@mindtree.com".equals(otherCheck)) {
			domain = otherCheck;
		}

		CorporateAddUserDto corporateAddUserDto = new CorporateAddUserDto();
		corporateAddUserDto.setEmployeeCode(empName);
		corporateAddUserDto.setEmpName(empName);
		corporateAddUserDto.setEmailId(empName + domain);
		corporateAddUserDto.setIsLoginActive(true);
		corporateAddUserDto.setMobileNo("9" + RandomStringUtils.random(9, mobileNumString));
		corporateAddUserDto.setPrimaryRoleCode(roleCode);
		corporateAddUserDto.setBirthDate(CalendarUtils.getCurrentDate());
		corporateAddUserDto.setStartDate(CalendarUtils.getCurrentDate());

		corporateAddUserDto.setAddress(setAddress(otherCheck));

		if ("sameTempRole".equals(otherCheck)) {
			corporateAddUserDto.setTempRoleCodes(Set.of(roleCode));
			corporateAddUserDto.setStartDate(CalendarUtils.addTimeToCurrentTime(null, null, 1, null, null, null));
			corporateAddUserDto.setExpiryDate(CalendarUtils.addTimeToCurrentTime(null, null, null, 1, null, null));
		}

		return corporateAddUserDto;
	}

	@ParameterizedTest
	@ValueSource(strings = { "?isActive=true&locationCodes=URB", "?regionCodes=EAST1", "?roleCodes=SM",
			"?corpAccess=true&isPageable=true&locationCode=KHN", "?searchField=admin&userType=ORG", "",
			"?locationCode=" })
	void testListUsers(String filters) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + filters), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "admin,OK", "zxzx,BAD_REQUEST", "commercial1,OK" })
	void testGetUserDetails(String employeeCode, String status) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + employeeCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testAddUserDetails")
	@ParameterizedTest
	@CsvSource({ "SM,KHN,,,OK", "REG_TEST_ROLE,EAST1,,,OK", "COMMERCIAL,,,,OK", "UNITTEST,KHN,,,BAD_REQUEST",
			"COMMERCIAL,check@gmail.com,,,UNPROCESSABLE_ENTITY", "REG_TEST_ROLE,ZZZZ,,,BAD_REQUEST",
			"COMMERCIAL,admin@mindtree.com,8608455840,,BAD_REQUEST", "SM,ZZZ,,,BAD_REQUEST",
			"ADMIN,admin,,,BAD_REQUEST", "ADMIN,admin@mindtree.com,,,BAD_REQUEST", "ADMIN,,8608455840,,BAD_REQUEST",
			"SM,44,,,BAD_REQUEST", "SM,,000,,UNPROCESSABLE_ENTITY", "SM,,1680923786098907,,UNPROCESSABLE_ENTITY",
			"COMMERCIAL,,,addressType,BAD_REQUEST", "COMMERCIAL,,,addressWrong,BAD_REQUEST",
			"SM,,,loc&reg,UNPROCESSABLE_ENTITY", "SM,,,sameTempRole,UNPROCESSABLE_ENTITY", "SM,XYX,,,BAD_REQUEST",
			"SM,BGL,,,BAD_REQUEST", "SM,ABH,,,BAD_REQUEST", "REG_TEST_ROLE,YXY,,,BAD_REQUEST",
			"REG_TEST_ROLE,EAST1,,@mindtree.com,BAD_REQUEST", "COMMERCIAL,,,@mindtree.com,BAD_REQUEST",
			"SM,BOR,,@mindtree.com,BAD_REQUEST", "SM,KHN,,@mindtree.com,OK", "SM,BOR,,mgrbor@titan.co.in,BAD_REQUEST",
			"SM,BOR,,mgrkkk@titan.co.in,OK", "SM,URB,,,BAD_REQUEST", "SM,KHN,,noLogin,OK", "BOS,BOR,,,BAD_REQUEST" })
	void testAddUserDetails(String roleCode, String locOrRegCodeOrMailorEmpCode, String mobile, String otherCheck,
			String status) {

		String empName = String.valueOf("UT" + RandomStringUtils.random(6, characters));

		CorporateAddUserDto corporateAddUserDto = addDetails(empName, roleCode, locOrRegCodeOrMailorEmpCode,
				otherCheck);

		if ("KHN".equals(locOrRegCodeOrMailorEmpCode) || "XYX".equals(locOrRegCodeOrMailorEmpCode)
				|| "BGL".equals(locOrRegCodeOrMailorEmpCode) || "ABO".equals(locOrRegCodeOrMailorEmpCode)
				|| "BOR".equals(locOrRegCodeOrMailorEmpCode) || "URB".equals(locOrRegCodeOrMailorEmpCode)) {
			corporateAddUserDto.setLocationCode(locOrRegCodeOrMailorEmpCode);
			if (!"@mindtree.com".equals(otherCheck)) {
				corporateAddUserDto.setEmailId(null);
			}
		} else if ("EAST1".equals(locOrRegCodeOrMailorEmpCode) || "YXY".equals(locOrRegCodeOrMailorEmpCode)) {
			corporateAddUserDto.setRegionCode(locOrRegCodeOrMailorEmpCode);
		} else if ("COMMERCIAL".equals(roleCode) && !StringUtils.isEmpty(locOrRegCodeOrMailorEmpCode)) {
			corporateAddUserDto.setEmailId(locOrRegCodeOrMailorEmpCode);
			if (!StringUtils.isEmpty(mobile))
				corporateAddUserDto.setMobileNo(mobile);
		} else if ("loc&reg".equals(otherCheck)) {
			corporateAddUserDto.setLocationCode("KHN");
			corporateAddUserDto.setRegionCode("EAST1");
		}

		if ("ADMIN".equals(roleCode)) {
			if ("admin".equals(locOrRegCodeOrMailorEmpCode))
				corporateAddUserDto.setEmployeeCode(locOrRegCodeOrMailorEmpCode);
			else if (StringUtils.isEmpty(mobile))
				corporateAddUserDto.setEmailId(locOrRegCodeOrMailorEmpCode);
			else
				corporateAddUserDto.setMobileNo(mobile);
		}

		if ("000".equals(mobile))
			corporateAddUserDto.setMobileNo("");

		if ("1680923786098907".equals(mobile))
			corporateAddUserDto.setMobileNo(mobile);

		if ("mgrbor@titan.co.in".equals(otherCheck) || "mgrkkk@titan.co.in".equals(otherCheck)) {
			corporateAddUserDto.setEmailId(otherCheck);
			corporateAddUserDto.setJoiningDate(null);
		}

		if ("noLogin".equals(otherCheck)) {
			corporateAddUserDto.setIsLoginActive(false);
		}

		HttpEntity<CorporateAddUserDto> entity = new HttpEntity<>(corporateAddUserDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "admin,,,,,OK", "bos.abo,,,,address,OK", "xxx,,,,,BAD_REQUEST", "Gita,,,,,BAD_REQUEST",
			"len,BOS,,,,BAD_REQUEST", "commercial,PRICING,,,,OK", "arnab02,,,,,OK", "arnab02,COMMERCIAL,,,,BAD_REQUEST",
			"arnab02,PRICING,,,noExpTime,UNPROCESSABLE_ENTITY", "arnab02,PRICING,,,startAfterExp,UNPROCESSABLE_ENTITY",
			"arnab02,PRICING,PRICING,,sameTempRole,UNPROCESSABLE_ENTITY", "commercial,,PRICING,,sameTempRole,OK",
			"commercial,,,,addressType,BAD_REQUEST", "commercial,,,,addressWrong,BAD_REQUEST", "sm.khn,,SM,,,OK",
			"sm.khn,,SM,,removePrimaryRoleCode,BAD_REQUEST", "commercial,,MERCHANDISE,,,BAD_REQUEST",
			"arnab02,PRICING,,,,BAD_REQUEST", "arnab02,FINANCE,,,,BAD_REQUEST", "arnab02,,,PRICING,,BAD_REQUEST",
			"arnab02,PRICING,,,updateTempRole,BAD_REQUEST", "arnab02,FINANCE,,,updateTempRole,BAD_REQUEST",
			"UTcb99,FINANCE,,,updateTempRole,OK", "UTcb99,FINANCE,,,updateTempRole,UNPROCESSABLE_ENTITY" })
	void testUpdateUserDetails(String empCode, String tempCode, String primaryRoleCode, String removeTempCode,
			String otherCheck, String status) {
		Map<String, EmployeeListDto> empCodeAndData = getEmpCodeAndData();

		CorporateUpdateUserDto corporateUpdateUserDto = new CorporateUpdateUserDto();

		if ("addressType".equals(otherCheck) || "addressWrong".equals(otherCheck) || "address".equals(otherCheck)) {
			corporateUpdateUserDto.setAddress(setAddress(otherCheck));
		}

		String employeeCode = empCode;

		if (!"xxx".equals(empCode))
			corporateUpdateUserDto.setEmpName(empCodeAndData.get(employeeCode).getEmpName());
		else
			corporateUpdateUserDto.setEmpName("JTest");

		if (tempCode != null) {
			if ("updateTempRole".equals(otherCheck)) {
				corporateUpdateUserDto.setUpdateTempRoleCode(tempCode);
				corporateUpdateUserDto
						.setUpdateTempStartTime(CalendarUtils.addTimeToCurrentTime(null, null, 1, null, null, null));
				if ("UNPROCESSABLE_ENTITY".equals(status)) {
					corporateUpdateUserDto.setUpdateTempExpiryTime(
							CalendarUtils.addTimeToCurrentTime(null, 1, null, null, null, null));
				} else {
					corporateUpdateUserDto.setUpdateTempExpiryTime(
							CalendarUtils.addTimeToCurrentTime(null, null, null, null, 3, null));
				}
			} else {
				corporateUpdateUserDto.setAddTempRoleCodes(Set.of(tempCode));
				corporateUpdateUserDto
						.setStartDate(CalendarUtils.addTimeToCurrentTime(null, null, 1, null, null, null));
			}

			if ("startAfterExp".equals(otherCheck)) {
				corporateUpdateUserDto
						.setStartDate(CalendarUtils.addTimeToCurrentTime(null, null, null, null, 3, null));
			}

			if (!"noExpTime".equals(otherCheck) && !"updateTempRole".equals(otherCheck)) {
				corporateUpdateUserDto
						.setExpiryDate(CalendarUtils.addTimeToCurrentTime(null, null, null, null, 2, null));
			}
		}

		if (empCode.equals("arnab02")) {
			if (tempCode == null)
				corporateUpdateUserDto.setRemoveTempRoleCodes(Set.of("FINANCE"));
			else if (status.equals("BAD_REQUEST") && "COMMERCIAL".equals(tempCode)) {
				corporateUpdateUserDto.setAddTempRoleCodes(null);
				corporateUpdateUserDto.setRemoveTempRoleCodes(Set.of(tempCode));
			}
		}

		if ("sameTempRole".equals(otherCheck)) {
			corporateUpdateUserDto.setPrimaryRoleCode(primaryRoleCode);
		}

		if ("SM".equals(primaryRoleCode) || "MERCHANDISE".equals(primaryRoleCode)) {
			corporateUpdateUserDto.setPrimaryRoleCode(primaryRoleCode);
			if ("removePrimaryRoleCode".equals(otherCheck)) {
				corporateUpdateUserDto.setPrimaryRoleCode(null);
				corporateUpdateUserDto.setRemoveTempRoleCodes(Set.of(primaryRoleCode));
			}
		}

		if (!StringUtils.isEmpty(removeTempCode)) {
			corporateUpdateUserDto.setRemoveTempRoleCodes(Set.of(removeTempCode));
		}

		HttpEntity<CorporateUpdateUserDto> entity = new HttpEntity<>(corporateUpdateUserDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + employeeCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@DisplayName("testGenerateOtp")
	@ParameterizedTest
	@CsvSource({ "ptif,OK,INVITED,", "gwen,UNPROCESSABLE_ENTITY,test,test", "gwen,OK,FORGOT_PASSWORD,forgot Password",
			"zzz,BAD_REQUEST,INVITED,invited", "ptif,BAD_REQUEST,LOGIN_ACTIVATED,activated",
			"ten,OK,MOBILENO_CHANGE,9097990979", "ten,BAD_REQUEST,MOBILENO_CHANGE,9900554421",
			"gwen,BAD_REQUEST,INVITED,invited", "Gita,BAD_REQUEST,MOBILENO_CHANGE,9097990971",
			"gewn,UNPROCESSABLE_ENTITY,MOBILENO_CHANGE,20979", "gewn,UNPROCESSABLE_ENTITY,MOBILENO_CHANGE,",
			"Barry,OK,LOGIN_ACTIVATED," })
	void testGenerateOtp(String empCode, String status, String otpType, String reqValue) {

		OtpRequestDetails otpRequestDetails = new OtpRequestDetails();
		otpRequestDetails.setEmpCode(empCode);
		otpRequestDetails.setRequestedValue(reqValue);

		if (OtpTypeEnum.INVITED.name().equalsIgnoreCase(otpType))
			otpRequestDetails.setOtpType(OtpTypeEnum.INVITED.name());
		else if (OtpTypeEnum.FORGOT_PASSWORD.name().equalsIgnoreCase(otpType))
			otpRequestDetails.setOtpType(OtpTypeEnum.FORGOT_PASSWORD.name());
		else if (OtpTypeEnum.LOGIN_ACTIVATED.name().equalsIgnoreCase(otpType))
			otpRequestDetails.setOtpType(OtpTypeEnum.LOGIN_ACTIVATED.name());
		else if (OtpTypeEnum.MOBILENO_CHANGE.name().equalsIgnoreCase(otpType))
			otpRequestDetails.setOtpType(OtpTypeEnum.MOBILENO_CHANGE.name());
		else
			otpRequestDetails.setOtpType(null);

		HttpEntity<OtpRequestDetails> entity = new HttpEntity<>(otpRequestDetails, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/generate-otps"),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
