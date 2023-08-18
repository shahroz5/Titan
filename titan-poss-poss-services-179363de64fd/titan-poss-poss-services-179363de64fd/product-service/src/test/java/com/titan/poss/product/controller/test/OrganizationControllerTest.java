package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.product.ProductBase;
import com.titan.poss.product.dto.OrgDto;

public class OrganizationControllerTest extends ProductBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("Commercial", "welcome123"));
	}

	@Test
	void testListOrganization() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("organizations"), HttpMethod.GET,
				entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "T,OK", "$,BAD_REQUEST" })
	void testGetOrganization(String code, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("organizations/" + code),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$,UNPROCESSABLE_ENTITY,T", ",OK,T", "T,BAD_REQUEST,T", ",OK," })
	void testaddOrganization(String orgCode, String status, String parentOrgCOde) {

		OrgDto orgDto = new OrgDto();

		if (StringUtils.isBlank(orgCode))
			orgDto.setOrgCode(generateString(3));
		else
			orgDto.setOrgCode(orgCode);
		orgDto.setDescription("unit test");
		orgDto.setIsActive(false);
		orgDto.setParentOrgCode(parentOrgCOde);

		HttpEntity<OrgDto> entity = new HttpEntity<>(orgDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("organizations"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "TEN,UNPROCESSABLE_ENTITY,T,T", "T,OK,unit testing,T", "$,BAD_REQUEST,fali case,T",
			"T,OK,Parent Null," })
	void testUpdateOrganization(String orgCode, String status, String description, String parentOrgCode) {

		OrgDto orgDto = new OrgDto();
		orgDto.setDescription(description);
		orgDto.setIsActive(false);
		orgDto.setParentOrgCode(parentOrgCode);

		HttpEntity<OrgDto> entity = new HttpEntity<>(orgDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("organizations/" + orgCode),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

}
