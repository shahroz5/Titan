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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

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

@DisplayName("StoreRoleLimitControllerTest")
@ExtendWith(SpringExtension.class)
class StoreRoleLimitControllerTest extends UserBase {

	public static final String URI = "store/role-limits";
	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("sm.khn", "welcome123"));
	}

	private Map<Integer, RoleLimitResponseDto> getRequestIdAndData() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI + "?size=200"), HttpMethod.GET,
				entity, JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Map<Integer, RoleLimitResponseDto> roleCodes = new HashMap<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();

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

//	if fails, check role_limit_request & req_details table and if no data is present then hardcode  roleLimitBOS & roleLimitSM values w.r.t loc_role_config run once, and then revert back
	@ParameterizedTest
	@CsvSource({ "1,BAD_REQUEST", "2,BAD_REQUEST", "inactiveRole,BAD_REQUEST", "roleNotAssigned,BAD_REQUEST",
			"COMMERCIAL,BAD_REQUEST", ",OK" })
	void testCreateRoleLimitRequest(String reqValOrRole, String status) {

		Map<Integer, RoleLimitResponseDto> roleLimitRequests = getRequestIdAndData();
		Set<RequestedRoleDetails> requestedRoleDetails;
		Short roleLimitBOS = 2;
		Short roleLimitSM = 2;
		Short roleLimitCashier = 2;
		Short assignedUsers = 0;
		Short userLimit = 0;

		for (Entry<Integer, RoleLimitResponseDto> request : roleLimitRequests.entrySet()) {
			if (!(request.getValue().getStatus().equalsIgnoreCase(RoleLimitRequestStatus.REJECTED.name())
					|| request.getValue().getStatus().equalsIgnoreCase(RoleLimitRequestStatus.CANCELLED.name()))) {
				requestedRoleDetails = getRoleLimitRequestDetails(request.getKey());
				for (RequestedRoleDetails reqDetails : requestedRoleDetails) {
					if ("BOS".equals(reqDetails.getRoleCode()) && roleLimitBOS < reqDetails.getReqValue()) {
						roleLimitBOS = reqDetails.getReqValue();
						assignedUsers = reqDetails.getAssignedUsers();
						userLimit = reqDetails.getUserLimit();
					}
					if ("SM".equalsIgnoreCase(reqDetails.getRoleCode()) && roleLimitSM < reqDetails.getReqValue()) {
						roleLimitSM = reqDetails.getReqValue();
					}
					if ("CASHIER".equals(reqDetails.getRoleCode()) && roleLimitSM < reqDetails.getReqValue()) {
						roleLimitCashier = reqDetails.getReqValue();
					}
				}
			}
		}

		if ("1".equals(reqValOrRole))
			roleLimitBOS = (short) (userLimit - 3);
		else if ("2".equals(reqValOrRole)) {
			roleLimitBOS = (short) (assignedUsers - 4);
		}

		RoleLimitRequestDto roleLimitRequestDto = new RoleLimitRequestDto();

		roleLimitRequestDto.setRequestRemarks("Test");

		if ("COMMERCIAL".equals(reqValOrRole)) {
			roleLimitRequestDto.setRoleLimitReqDto(List.of(setRoleLimit(reqValOrRole, (short) 10, (short) 1)));
		} else {

			if ("inactiveRole".equals(reqValOrRole)) {

				roleLimitRequestDto.setRoleLimitReqDto(List.of(setRoleLimit("BOS", roleLimitBOS, (short) 3),
						setRoleLimit("SM", roleLimitSM, (short) 1),
						setRoleLimit("CASHIER", roleLimitCashier, (short) 3),
						setRoleLimit("UNITTEST2", userLimit, (short) 1)));
			} else if ("roleNotAssigned".equals(reqValOrRole)) {

				roleLimitRequestDto.setRoleLimitReqDto(List.of(setRoleLimit("BOS", roleLimitBOS, (short) 3),
						setRoleLimit("SM", roleLimitSM, (short) 1),
						setRoleLimit("CASHIER", roleLimitCashier, (short) 3),
						setRoleLimit("HOUSEKEEPING", userLimit, (short) 1)));
			} else {
				roleLimitRequestDto.setRoleLimitReqDto(List.of(setRoleLimit("BOS", roleLimitBOS, (short) 3),
						setRoleLimit("SM", roleLimitSM, (short) 1),
						setRoleLimit("CASHIER", roleLimitCashier, (short) 3)));
			}
		}

		HttpEntity<RoleLimitRequestDto> entity = new HttpEntity<>(roleLimitRequestDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/requests"), HttpMethod.POST,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@ValueSource(strings = { "?status=PENDING", "", "?status=CANCELLED" })
	void testListAllRequests(String filter) {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + filter), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "101,BAD_REQUEST", "4,BAD_REQUEST", ",OK", "99,BAD_REQUEST" })
	void testGetRoleRequestDetails(Integer reqId, String status) {

		Integer[] roleCodesList = getRequestIdAndData().keySet().toArray(new Integer[0]);

		if (reqId == null) {
			if (roleCodesList.length == 0)
				reqId = 0;
			else
				reqId = roleCodesList[0];
		}

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + reqId + "/requests"),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

}
