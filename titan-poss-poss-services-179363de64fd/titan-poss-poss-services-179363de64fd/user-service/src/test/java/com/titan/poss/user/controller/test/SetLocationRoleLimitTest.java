package com.titan.poss.user.controller.test;

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

import com.titan.poss.core.dto.ReqLocationRoleDto;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.user.UserBase;

/**
 * CorpRoleLimitController test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class SetLocationRoleLimitTest extends UserBase {

	public static final String URI = "corp/role-limits";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ ",LF,OK", ",,UNPROCESSABLE_ENTITY", ",SF,BAD_REQUEST", "KHN,MF,BAD_REQUEST" })
	void testSetLocationRoleLimit(String locationCode, String locationFormat, String status) {

		if (StringUtils.isEmpty(locationCode)) {
			locationCode = String.valueOf("JU" + RandomStringUtils.random(3, characters)).toUpperCase();

		}
		ReqLocationRoleDto reqLocationRoleDto = new ReqLocationRoleDto();

		if (!"UNPROCESSABLE_ENTITY".equals(status))
			reqLocationRoleDto.setLocationFormat(locationFormat);

		HttpEntity<ReqLocationRoleDto> entity = new HttpEntity<>(reqLocationRoleDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/locations/" + locationCode),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

}
