package com.titan.poss.location.controller.test;

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
import com.titan.poss.location.dto.RegionDto;
import com.titan.poss.location.dto.request.RegionUpdateDto;
import com.titan.poss.location.test.LocationBase;

class RegionControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@Test
	void testListRegion() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("regions?isActive=true&isPageable=true&parentRegionCode=north&regionType=SUBREGION"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "South,OK", "$$,BAD_REQUEST" })
	void testGetRegion(String regionCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("regions/" + regionCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY", "BAD_REQUEST" })
	void testAddRegion(String status) {
		RegionDto regionDto = new RegionDto();
		if (status.equals("UNPROCESSABLE_ENTITY")) {
			regionDto.setDescription(generateString(1));
		} else {
			regionDto.setDescription(generateString(4));
			if (status.equals("BAD_REQUEST")) {
				regionDto.setRegionCode("South");
			}
			else {
				regionDto.setRegionCode(generateString(4));
			}
		}
		regionDto.setIsActive(false);
		regionDto.setParentRegionCode("");

		HttpEntity<RegionDto> entity = new HttpEntity<>(regionDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("regions"), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "South,OK", "South,UNPROCESSABLE_ENTITY", "$$,BAD_REQUEST" })
	void testUpdateRegion(String regionCode,String status) {
		RegionUpdateDto regionUpdateDto = new RegionUpdateDto();
		regionUpdateDto.setIsActive(true);
		if (status.equals("UNPROCESSABLE_ENTITY")) {
			regionUpdateDto.setDescription(generateString(1));
		}
		HttpEntity<RegionUpdateDto> entity = new HttpEntity<>(regionUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("regions/" + regionCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
