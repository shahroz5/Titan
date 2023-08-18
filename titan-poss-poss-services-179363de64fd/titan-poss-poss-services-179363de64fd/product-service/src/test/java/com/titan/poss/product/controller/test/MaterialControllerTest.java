package com.titan.poss.product.controller.test;

import static org.junit.Assert.assertTrue;

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
import com.titan.poss.product.dto.MaterialTypeDto;
import com.titan.poss.product.dto.request.MaterialTypeUpdateDto;

public class MaterialControllerTest extends ProductBase {

	private static final String URI = "materials";

	private static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListMaterial() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("materials?isActive=true&isPageable=true"), HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "J,OK", "$1,BAD_REQUEST" })
	void testGetMaterial(String materialTypeCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + materialTypeCode),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ ",UNPROCESSABLE_ENTITY", ",OK" })
	void testAddMaterial(String materialTypeCode, String status) {

		MaterialTypeDto materialDto = new MaterialTypeDto();

		materialDto.setDescription("Add Material Unit Testing");

		if (status.equals("OK"))
			materialDto.setMaterialTypeCode(generateString(4));
		else
			materialDto.setMaterialTypeCode(materialTypeCode);

		materialDto.setIsActive(false);

		HttpEntity<MaterialTypeDto> entity = new HttpEntity<>(materialDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "Z,UNPROCESSABLE_ENTITY", "J,OK", "$1,BAD_REQUEST" })
	void testUpdateMaterial(String materialTypeCode, String status) {
		MaterialTypeUpdateDto materialUpdateDto = new MaterialTypeUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY"))
			materialUpdateDto.setDescription("  ");

		HttpEntity<MaterialTypeUpdateDto> entity = new HttpEntity<>(materialUpdateDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + materialTypeCode),
				HttpMethod.PUT, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

}
