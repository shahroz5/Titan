package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;
import com.titan.poss.inventory.dto.request.BinCreateDto;
import com.titan.poss.inventory.dto.request.BinUpdateDto;

@DisplayName("BinControllerTest")
class BinControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("approvaluser", "titan12"));
	}

	@Test
	void testAddBin() {
		BinCreateDto binCreateDto = new BinCreateDto();
		List<String> binGroups = new ArrayList<>();
		binGroups.add("TestGroupCode");
		binCreateDto.setBinCode(generateString(4));
		binCreateDto.setDescription("Bin creation testing");
		binCreateDto.setBinGroups(binGroups);

		HttpEntity<BinCreateDto> entity = new HttpEntity<>(binCreateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("bins"), HttpMethod.POST, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "BEST DEAL,OK", "ewqeqwe,BAD_REQUEST" })
	void testGetBin(String code, String status) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers1);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("bins/" + code), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

	@ParameterizedTest
	@CsvSource({ "KALEERE,true,OK", "KALEERE,false,OK", "QEESQS,true,BAD_REQUEST" })
	void testUpdateBin(String bin, Boolean isActive, String status) {
		BinUpdateDto binUpdateDto = new BinUpdateDto();
		binUpdateDto.setBinGroupCode("TestGroupCode");
//		if (!status.equals("OK")) {
//			binUpdateDto.setBinGroupCode("uiued");
//		}
		binUpdateDto.setDescription("Bin creation testing");
		binUpdateDto.setIsActive(isActive);

		HttpEntity<BinUpdateDto> entity = new HttpEntity<>(binUpdateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("bins/" + bin), HttpMethod.PATCH,
				entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

}
