/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Iterator;
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

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.inventory.InventoryBase;
import com.titan.poss.inventory.dto.constants.ApprovalRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.request.ApprovalRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.ApprovalRequestUpdateDto;
import com.titan.poss.inventory.dto.request.BinRequestUpdateDto;
import com.titan.poss.inventory.dto.request.StockTransferApprovalRequestUpdateDto;
import com.titan.poss.inventory.dto.response.ApprovalRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@DisplayName("ApprovalControllerTest")

public class ApprovalControllerTest extends InventoryBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("approvaluser", "titan12"));
	}

	@Test
	@DisplayName("getApprovalRequestCountTest")
	public void a() {

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("approvals/counts"), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "BTQ", "LOAN", "FOC", "LOSS", "ADJ", "PSV", "EXH" })
	@DisplayName("listApprovalRequestsTest")
	public void b(String type) {

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("approvals?requestType=" + type),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

	@ParameterizedTest
	@CsvSource({ "BTQ", "LOAN", "FOC", "LOSS", "ADJ", "PSV", "EXH" })
	@DisplayName("getApprovalRequest")
	public void c(String type) {
		String id = getApprovalId(type);
		if (id == null) {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("approvals/765765?requestType=" + type), HttpMethod.GET, entity, String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
		} else {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("approvals/" + id + "?requestType=" + type), HttpMethod.GET, entity,
					String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}
	}

	private String getApprovalId(String type) {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
				createURLWithPort("approvals?requestType=" + type + "&status=APVL_PENDING"), HttpMethod.GET, entity1,
				JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		String id = null;
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			id = data.get("id").asText();
			break;
		}
		return id;
	}

	@ParameterizedTest
	@CsvSource({ "BTQ", "LOAN", "FOC", "LOSS", "ADJ", "PSV", "EXH" })
	@DisplayName("listApprovalRequestItemsTest")
	public void d(String type) {
		String id = getApprovalId(type);
		if (id == null) {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("approvals/" + 654646 + "/items?requestType=" + type + "&status=APVL_PENDING"),
					HttpMethod.GET, entity, String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
		} else {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("approvals/" + id + "/items?requestType=" + type + "&status=APVL_PENDING"),
					HttpMethod.GET, entity, String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}

	}

	@Test
	@DisplayName("listBinApprovalRequestTest")
	public void g() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("approvals/bins/requests"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "APVL_REJECTED", "APPROVED" })
	@DisplayName("updateBinApprovalRequests")
	public void h(ApprovalRequestStatusEnum approvalRequestStatusEnum) {
		String id = getBinRequestId();
		BinRequestUpdateDto binRequestUpdateDto = new BinRequestUpdateDto();
		binRequestUpdateDto.setRemarks("testing j unit cases");
		binRequestUpdateDto.setStatus(approvalRequestStatusEnum.toString());
		HttpEntity<BinRequestUpdateDto> entity = new HttpEntity<>(binRequestUpdateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("approvals/bins/requests/" + id),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	private String getBinRequestId() {
		HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);
		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort("approvals/bins/requests"),
				HttpMethod.GET, entity1, JsonNode.class);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		String id = null;
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			id = data.get("id").asText();
			break;
		}
		return id;
	}

	@ParameterizedTest
	@CsvSource({ "BTQ", "LOAN", "FOC", "LOSS", "ADJ", "PSV", "EXH" })
	@DisplayName("updateApprovalRequestItemTest")
	public void e(String type) {
		String id = getApprovalId(type);
		if (id == null) {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("approvals/34535434/items/6565da6a665?requestType=" + type), HttpMethod.GET,
					entity, String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
		}

		else {
			HttpEntity<String> entity1 = new HttpEntity<>("ALL", headers1);
			ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(
					createURLWithPort("approvals/" + id + "/items?requestType=" + type), HttpMethod.GET, entity1,
					JsonNode.class);
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			ApprovalRequestDto approvalRequestDto = new ApprovalRequestDto();
			Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();
			String itemId = null;
			while (resultsIterator.hasNext()) {
				JsonNode data = resultsIterator.next();
				itemId = data.get("id").asText();
				approvalRequestDto.setTotalRequestedQuantity((short) data.get("requestedQuantity").asInt());
				break;
			}
			ApprovalRequestItemUpdateDto itemUpdateDto = new ApprovalRequestItemUpdateDto();
			itemUpdateDto.setQuantity(approvalRequestDto.getTotalRequestedQuantity());
			if (type.equals("BTQ") || type.equals("FOC")) {
				itemUpdateDto.setStatus(ApprovalRequestStatusEnum.APVL_REJECTED.toString());
			} else {
				itemUpdateDto.setStatus(ApprovalRequestStatusEnum.APPROVED.toString());
			}
			HttpEntity<ApprovalRequestItemUpdateDto> entity = new HttpEntity<>(itemUpdateDto, headers1);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("approvals/" + id + "/items/" + itemId + "?requestType=" + type),
					HttpMethod.PATCH, entity, String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}
	}

	@ParameterizedTest
	@CsvSource({ "BTQ", "LOAN", "FOC", "LOSS", "ADJ", "PSV", "EXH" })
	@DisplayName("updateApprovalRequest")
	public void f(String type) {
		String id = getApprovalId(type);
		if (id == null) {
			HttpEntity<String> entity = new HttpEntity<>(null, headers1);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("approvals/6546546465?requestType=" + type), HttpMethod.GET, entity,
					String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.BAD_REQUEST));
		} else {
			ApprovalRequestUpdateDto requestUpdateDto = new ApprovalRequestUpdateDto();
			List<String> itemIds = new ArrayList<>();
			requestUpdateDto.setItemIds(itemIds);
			requestUpdateDto.setRemarks("Approving for the requested items");
			requestUpdateDto.setStatus(ApprovalRequestStatusEnum.APPROVED.toString());
			HttpEntity<ApprovalRequestUpdateDto> entity = new HttpEntity<>(requestUpdateDto, headers1);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RestTemplate restTemplate = new RestTemplate(requestFactory);
			ResponseEntity<String> response = restTemplate.exchange(
					createURLWithPort("approvals/" + id + "?requestType=" + type), HttpMethod.PATCH, entity,
					String.class);
			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		}
	}

	@Test
	@DisplayName("listTransferApprovalRequests")
	public void i() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("approvals/transfer?status=CNCL_APVL_PENDING&transferType=BTQ_BTQ"), HttpMethod.GET,
				entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "8,BTQ_BTQ", "9,MER_BTQ" })
	@DisplayName("getTransferApprovalRequest")
	public void j(Integer id, String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("approvals/transfer/" + id + "?transferType=" + type), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "8,BTQ_BTQ", "9,MER_BTQ" })
	@DisplayName("listTransferApprovalRequestItems")
	public void k(String id, String type) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("approvals/transfer/" + id + "/items?status=CNCL_APVL_PENDING&transferType=" + type),
				HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "8,BTQ_BTQ", "9,MER_BTQ" })
	@DisplayName("updateTransferApprovalRequest")
	public void l(Integer id, String type) {
		StockTransferApprovalRequestUpdateDto stUpdateDto = new StockTransferApprovalRequestUpdateDto();
		stUpdateDto.setRemarks("Testing");
		stUpdateDto.setStatus(StockTransferStatusEnum.CANCELLED.toString());
		HttpEntity<StockTransferApprovalRequestUpdateDto> entity = new HttpEntity<>(stUpdateDto, headers1);
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("approvals/transfer/" + id + "?transferType=" + type), HttpMethod.GET, entity,
				String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}
}
