package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.user.UserBase;
import com.titan.poss.user.dto.request.OtpDetailsWoType;
import com.titan.poss.user.dto.request.OtpDto;
import com.titan.poss.user.dto.request.OtpPasswordDto;
import com.titan.poss.user.dto.request.ResetPasswordDto;

@ExtendWith(SpringExtension.class)
class UserControllerTest extends UserBase {

	public static final String URI = "users";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "EMAIL,mind@mindtree.com,OK", "MOBILE,9012901237,OK", "EMAIL,admin@mindtree.com,OK",
			",9080971234,UNPROCESSABLE_ENTITY" })
	void testIsUniqueEmailOrMobile(String uniqueType, String value, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort(URI + "/unique-checks?uniqueType=" + uniqueType + "&value=" + value), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "d2VsY29tZTEyMw,d2VsY29tZTEyMw,UNPROCESSABLE_ENTITY", "d2VsY29tZTEy123,d2VsY29tZTEyMw,BAD_REQUEST",
			"d2VsY29tZTEyMw,d2VsY29tZTEyMw,BAD_REQUEST", "d2VsY29tZTEyMw,V2VsY29tZUAxMjM,OK" })
	void testResetUserPassword(String oldPassword, String newPasword, String status) {

		ResetPasswordDto resetPasswordDto = new ResetPasswordDto();
		resetPasswordDto.setOldPassword(oldPassword);
		resetPasswordDto.setNewPassword(newPasword);

		HttpEntity<ResetPasswordDto> entity = new HttpEntity<>(resetPasswordDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/change-password"),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "gwen,oAFAmD,OK,", "gwen,xZg1aE,BAD_REQUEST,", "zxxz,xZg1aE,BAD_REQUEST,",
			"UTcb99,xZg1aE,BAD_REQUEST,INVITED", "arnab,AtRpfe,BAD_REQUEST,", "gwen,K2S7Qf,BAD_REQUEST,FORGOT_PASSWORD",
			"Harry,K2S7Qf,BAD_REQUEST,LOGIN_ACTIVATED", "Harry,YvTQSb,OK,LOGIN_ACTIVATED" })
	void testOtpUserPasswordVerify(String empCode, String otp, String status, String otpType) {

		String newPassword = RandomStringUtils.random(8, (characters + mobileNumString));

		OtpPasswordDto otpPasswordDto = new OtpPasswordDto();
		otpPasswordDto.setEmpCode(empCode);

		otpPasswordDto.setOtp(otp);

		if (!StringUtils.isEmpty(otpType))
			otpPasswordDto.setOtpType(otpType);
		else
			otpPasswordDto.setOtpType(OtpTypeEnum.FORGOT_PASSWORD.name());

		if (OtpTypeEnum.FORGOT_PASSWORD.name().equals(otpPasswordDto.getOtpType())
				|| OtpTypeEnum.INVITED.name().equals(otpPasswordDto.getOtpType())) {
			otpPasswordDto.setNewPassword(Base64.encodeBase64String(newPassword.getBytes()));
		}

		HttpEntity<OtpPasswordDto> entity = new HttpEntity<>(otpPasswordDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/verify-otp"),
				HttpMethod.PATCH, entity, String.class);

		if (!status.equalsIgnoreCase(response.getStatusCode().name()))
			status = response.getStatusCode().name();

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "sm.kdh,OK", "zxxz,BAD_REQUEST" })
	void testGenerateOtp(String empCode, String status) {
		OtpDetailsWoType otpDetailsWoType = new OtpDetailsWoType();
		otpDetailsWoType.setEmpCode(empCode);

		HttpEntity<OtpDetailsWoType> entity = new HttpEntity<>(otpDetailsWoType, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/forgot-password"),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testValidateOtpForMobileNo() {
		OtpDto otpDto = new OtpDto();
		otpDto.setOtp("p9qVyE");

		HttpEntity<OtpDto> entity = new HttpEntity<>(otpDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/validate-mobile-number"),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
