package com.titan.poss.location.controller.test;

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
import com.titan.poss.location.dto.request.PincodeCreateDto;
import com.titan.poss.location.test.LocationBase;

class PincodeControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListPincode() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("pincodes?countryCode=ind&isActive=true&isPageable=true"), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "00000,BAD_REQUEST" })
	void testGetPincode(Integer pincode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("pincodes/" + pincode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "IND,OK", ",BAD_REQUEST", "IND,BAD_REQUEST" })
	void testAddPincode(String countryCode, String status) {
		PincodeCreateDto pincodeCreateDto = new PincodeCreateDto();
		pincodeCreateDto.setCachementArea(generateString(6));
		pincodeCreateDto.setCountryCode(countryCode);
		pincodeCreateDto.setIsActive(false);
		if (status.equals("BAD_REQUEST") && !StringUtils.isBlank(countryCode))
			pincodeCreateDto.setPinCode("110001");
		else
			pincodeCreateDto.setPinCode(generateString(4));
		pincodeCreateDto.setStateName(generateString(3));
		pincodeCreateDto.setTownName(generateString(3));
		HttpEntity<PincodeCreateDto> entity = new HttpEntity<>(pincodeCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("pincodes"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "000,BAD_REQUEST" })
	void testUpdatePincode(Integer id, String status) {
		PincodeCreateDto pincodeCreateDto = new PincodeCreateDto();
		pincodeCreateDto.setCachementArea(generateString(6));
		pincodeCreateDto.setCountryCode("IND");
		pincodeCreateDto.setIsActive(false);
		pincodeCreateDto.setPinCode(generateString(4));
		pincodeCreateDto.setStateName(generateString(3));
		pincodeCreateDto.setTownName(generateString(3));
		HttpEntity<PincodeCreateDto> entity = new HttpEntity<>(pincodeCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("pincodes/" + id), HttpMethod.PUT,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
