package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.user.UserBase;
import com.titan.poss.user.dto.constants.RoleLimitRequestStatus;
import com.titan.poss.user.dto.request.RoleLimitReqDto;
import com.titan.poss.user.dto.request.RoleLimitRequestDto;
import com.titan.poss.user.dto.response.RequestedRoleDetails;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;

public class BtqCreateRoleLimitTest extends UserBase {

	public static final String URI = "store/role-limits";

	private static final String RESULTS = "results";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	private Map<Integer, RoleLimitResponseDto> getRequestIdAndData() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI + "?size=400"), HttpMethod.GET,
				entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Map<Integer, RoleLimitResponseDto> roleCodes = new HashMap<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get(RESULTS).iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			RoleLimitResponseDto roleLimitResponse = new RoleLimitResponseDto();
			roleLimitResponse.setId(data.get("id").asInt());
			roleLimitResponse.setReqLocationCode(data.get("reqLocationCode").asText());
			roleLimitResponse.setOwnerType(data.get("ownerType").asText());
			roleLimitResponse.setReqDocNo(data.get("reqDocNo").asInt());
			roleLimitResponse.setRequesterName(data.get("requesterName").asText());
			roleLimitResponse.setRequesterContactNo(data.get("requesterContactNo").asText());
			roleLimitResponse.setRequestRemarks(data.get("requestRemarks").asText());
			roleLimitResponse.setStatus(data.get("status").asText());

			roleCodes.put(data.get("id").asInt(), roleLimitResponse);
		}

		return roleCodes;
	}

	private Set<RequestedRoleDetails> getRoleLimitRequestDetails(Integer id) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI + "/" + id + "/requests"),
				HttpMethod.GET, entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Set<RequestedRoleDetails> requestedRoleDetailsList = new HashSet<>();
		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("requestedRoleDetails").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();

			RequestedRoleDetails requestedRoleDetails = new RequestedRoleDetails();
			requestedRoleDetails.setRoleCode(data.get("roleCode").asText());
			requestedRoleDetails.setReqValue((short) data.get("reqValue").asInt());
			requestedRoleDetails.setAssignedUsers((short) data.get("assignedUsers").asInt());
			requestedRoleDetails.setUserLimit((short) data.get("userLimit").asInt());

			requestedRoleDetailsList.add(requestedRoleDetails);
		}

		return requestedRoleDetailsList;
	}

	private RoleLimitReqDto setRoleLimit(String role, Short reqValue, Short incrementVal) {
		RoleLimitReqDto roleLimitReqDto = new RoleLimitReqDto();
		roleLimitReqDto.setRoleCode(role);
		roleLimitReqDto.setReqValue((short) (reqValue + incrementVal));

		return roleLimitReqDto;
	}

	@Test
	void createRoleLimitRequest() {

		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));

		Map<Integer, RoleLimitResponseDto> roleLimitRequests = getRequestIdAndData();
		Set<RequestedRoleDetails> requestedRoleDetails;
		Short roleLimitBOS = 15;
		Short roleLimitSM = 15;

		for (Entry<Integer, RoleLimitResponseDto> request : roleLimitRequests.entrySet()) {
			if (!request.getValue().getStatus().equalsIgnoreCase(RoleLimitRequestStatus.REJECTED.name())) {
				requestedRoleDetails = getRoleLimitRequestDetails(request.getKey());
				for (RequestedRoleDetails reqDetails : requestedRoleDetails) {
					if ("BOS".equals(reqDetails.getRoleCode()) && roleLimitBOS < reqDetails.getReqValue()) {
						roleLimitBOS = reqDetails.getReqValue();
					}
					if ("SM".equalsIgnoreCase(reqDetails.getRoleCode()) && roleLimitSM < reqDetails.getReqValue()) {
						roleLimitSM = reqDetails.getReqValue();
					}
				}
			}
		}

		RoleLimitRequestDto roleLimitRequestDto = new RoleLimitRequestDto();

		roleLimitRequestDto.setRequestRemarks("Test");

		roleLimitRequestDto.setRoleLimitReqDto(
				List.of(setRoleLimit("BOS", roleLimitBOS, (short) 3), setRoleLimit("SM", roleLimitSM, (short) 1)));

		HttpEntity<RoleLimitRequestDto> entity = new HttpEntity<>(roleLimitRequestDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("store/role-limit/request"),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));

	}

}
