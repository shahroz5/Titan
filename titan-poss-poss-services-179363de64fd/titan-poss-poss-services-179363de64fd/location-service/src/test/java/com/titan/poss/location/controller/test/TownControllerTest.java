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
import com.titan.poss.location.dto.request.TownCreateDto;
import com.titan.poss.location.dto.request.TownUpdateDto;
import com.titan.poss.location.test.LocationBase;

public class TownControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("Commercial", "welcome123"));
	}

	@Test
	void testListTown() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("towns?isPageable=true"),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "12,BAD_REQUEST" })
	void testGetTown(String code, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("towns/" + code), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "OK", "UNPROCESSABLE_ENTITY", "BAD_REQUEST" })
	void testAddTown(String status) {
		TownCreateDto townCreateDto = new TownCreateDto();
//		townCreateDto.setStateId("");
		townCreateDto.setIsActive(false);
		if (status.equals("UNPROCESSABLE_ENTITY"))
			townCreateDto.setDescription("");
		else if (status.equals("BAD_REQUEST"))
			townCreateDto.setDescription("KADAPA");
		else
			townCreateDto.setDescription(generateString(5));

		HttpEntity<TownCreateDto> entity = new HttpEntity<>(townCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("towns"), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "1,UNPROCESSABLE_ENTITY", "1,BAD_REQUEST", "00,BAD_REQUEST" })
	void testUpdateTown(Integer townCode, String status) {
		TownUpdateDto townUpdateDto = new TownUpdateDto();
		townUpdateDto.setIsActive(true);
//		townUpdateDto.setStateId("");
		if (status.equals("UNPROCESSABLE_ENTITY"))
			townUpdateDto.setDescription("");
		else if (status.equals("BAD_REQUEST"))
			townUpdateDto.setDescription("KADAPA");
		HttpEntity<TownUpdateDto> entity = new HttpEntity<>(townUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("towns/" + townCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

}
