package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.location.dto.AddStateTaxMappingDto;
import com.titan.poss.location.dto.StateTaxDto;
import com.titan.poss.location.dto.request.StateCreateDto;
import com.titan.poss.location.dto.request.StateUpdateDto;
import com.titan.poss.location.test.LocationBase;

class StateControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "states?countryCode=ind&isActive=true&isPageable=true", "states?countryCode=ind&isActive=true" })
	void testListState(String url) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("states?countryCode=ind&isActive=true&isPageable=true"), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "$$,BAD_REQUEST" })
	void testGetState(String stateId, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("states/" + stateId), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "IND,OK", ",UNPROCESSABLE_ENTITY", "IND,BAD_REQUEST" })
	void testAddState(String countryCode, String status) {
		StateCreateDto stateCreateDto = new StateCreateDto();
		stateCreateDto.setCountryCode(countryCode);
		stateCreateDto.setDescription(generateString(3));
		if (status.equals("BAD_REQUEST")) {
			stateCreateDto.setDescription("ANDHRA PRADESH");
		}
		stateCreateDto.setIsActive(false);
		stateCreateDto.setStateCode(generateString(3));
		stateCreateDto.setIsUnionTerritory(false);
		// stateCreateDto.setStateTaxCode(0);
		HttpEntity<StateCreateDto> entity = new HttpEntity<>(stateCreateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("states"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "1,UNPROCESSABLE_ENTITY", "00,BAD_REQUEST" })
	void testUpdateState(String stateId, String status) {
		StateUpdateDto stateUpdateDto = new StateUpdateDto();
		if (status.equals("UNPROCESSABLE_ENTITY")) {
			stateUpdateDto.setCountryCode("1");
		} else {
			stateUpdateDto.setCountryCode("IND");
		}
		stateUpdateDto.setIsActive(true);
		HttpEntity<StateUpdateDto> entity = new HttpEntity<>(stateUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("states/" + stateId),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "1,OK", "$$,BAD_REQUEST" })
	void testStateTaxClassMapping(String stateCode, String status) {
		StateTaxDto stateTaxDto = new StateTaxDto();
		Set<AddStateTaxMappingDto> addStateTaxMappingDtoList = new HashSet<>();
		AddStateTaxMappingDto addStateTaxMappingDto = new AddStateTaxMappingDto();
		Set<String> removeTaxes = new HashSet<>();
		addStateTaxMappingDto.setTaxClassCode("TC2");
		addStateTaxMappingDto.setIsActive(true);
		addStateTaxMappingDtoList.add(addStateTaxMappingDto);
		stateTaxDto.setAddTaxes(addStateTaxMappingDtoList);
		removeTaxes.add("$$");
		stateTaxDto.setRemovetaxes(removeTaxes);

		HttpEntity<StateTaxDto> entity = new HttpEntity<>(stateTaxDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("states/" + stateCode + "/taxClasses"), HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
