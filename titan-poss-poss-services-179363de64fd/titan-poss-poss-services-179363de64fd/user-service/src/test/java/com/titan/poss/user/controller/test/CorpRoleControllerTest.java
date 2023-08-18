/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.RandomStringUtils;
import org.junit.jupiter.api.BeforeAll;
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
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.user.UserBase;
import com.titan.poss.user.dto.constants.LocationFormatEnum;
import com.titan.poss.user.dto.constants.RoleTypeEnum;
import com.titan.poss.user.dto.request.AddRoleDetailsDto;
import com.titan.poss.user.dto.request.LocationFormatRoleLimitDto;
import com.titan.poss.user.dto.request.UpdateRolesDetailDto;

/**
 * CorpRoleController test class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class CorpRoleControllerTest extends UserBase {

	public static final String URI = "corp/roles";

	protected static HttpHeaders headers = new HttpHeaders();

	@BeforeAll
	protected static void initAuthUser() {
		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("admin", "Welcome@123"));
	}

	private Map<String, String> getRoleCodes() {

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<JsonNode> jsonNode = restTemplate.exchange(createURLWithPort(URI), HttpMethod.GET, entity,
				JsonNode.class);

		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		Map<String, String> roleCodes = new HashMap<>();

		Iterator<JsonNode> resultsIterator = jsonNode.getBody().get("results").iterator();

		while (resultsIterator.hasNext()) {
			JsonNode data = resultsIterator.next();
			roleCodes.put(data.get("roleCode").asText(), data.get("description").asText());
		}

		return roleCodes;
	}

	@ParameterizedTest
	@ValueSource(strings = { "?corpAccess=true&isActive=true&isPageable=false", "?isPageable=true&roleCode=ADMIN",
			"?isActive=true&locationCode=URB&locationFormat=LF&roleType=L1", "?isPageable=true&roleType=REG",
			"?isPageable=true&roleType=L1", "?isActive=true&locationCode=URB&roleType=L1",
			"?isActive=true&locationFormat=LF&roleType=L1",
			"?corpAccess=true&isActive=true&isPageable=true&locationFormat=LF&roleType=L1",
			"?corpAccess=false&isActive=true&isPageable=false" })
	void testListRoles(String filter) {
		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + filter), HttpMethod.GET, entity,
				String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "ADMIN,OK", "ZXXZ,BAD_REQUEST", ",OK", "SM,OK", "HOUSEKEEPING,BAD_REQUEST" })
	void testGetRoleDetails(String role, String status) {

		String roleCode;

		if (!StringUtils.isEmpty(role))
			roleCode = role;
		else
			roleCode = getRoleCodes().keySet().toArray(new String[0])[0];

		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + roleCode), HttpMethod.GET,
				entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ ",L1,false,,OK", ",L1,false,1,UNPROCESSABLE_ENTITY", ",L1,false,2,UNPROCESSABLE_ENTITY",
			",REG,true,,OK", ",CORP,true,,OK", "ADMIN,CORP,true,,BAD_REQUEST", ",L1,true,,BAD_REQUEST" })
	void testAddRoleDetails(String roleCode, String roleType, Boolean corpAccess, String number, String status) {
		String role = String
				.valueOf("UT" + RandomStringUtils.random(2, characters) + RandomStringUtils.random(2, mobileNumString))
				.toUpperCase();

		AddRoleDetailsDto addRoleDetailsDto = new AddRoleDetailsDto();

		addRoleDetailsDto.setCorpAccess(corpAccess);
		addRoleDetailsDto.setDescription("Unit Test RoleCode" + role);

		if (!StringUtils.isEmpty(roleCode)) {
			addRoleDetailsDto.setRoleCode(roleCode);
			addRoleDetailsDto.setRoleName(roleCode);
		} else {
			addRoleDetailsDto.setRoleCode(role);
			addRoleDetailsDto.setRoleName(role);
		}

		if (RoleTypeEnum.L1.name().equalsIgnoreCase(roleType))
			addRoleDetailsDto.setAccessType("00111");
		else if (RoleTypeEnum.REG.name().equalsIgnoreCase(roleType))
			addRoleDetailsDto.setAccessType("01000");
		else {
			addRoleDetailsDto.setAddAclCodes(Set.of("U8"));
			addRoleDetailsDto.setAccessType("10000");
		}

		if (RoleTypeEnum.L1.name().equalsIgnoreCase(roleType)) {
			LocationFormatEnum[] locationFormats = LocationFormatEnum.values();
			Set<LocationFormatRoleLimitDto> addRoleToLocationFormats = new HashSet<>();
			for (int i = 0; i < locationFormats.length; i++) {
				LocationFormatRoleLimitDto locationFormatRoleLimitDto = new LocationFormatRoleLimitDto();
				locationFormatRoleLimitDto.setLocationFormat(locationFormats[i].name());
				locationFormatRoleLimitDto.setUserLimit((short) 0);

				addRoleToLocationFormats.add(locationFormatRoleLimitDto);
			}
			addRoleDetailsDto.setAddRoleToLocationFormats(addRoleToLocationFormats);

			if ("UNPROCESSABLE_ENTITY".equalsIgnoreCase(status)) {
				if ("1".equals(number)) {
					addRoleDetailsDto.setAddRoleToLocationFormats(null);
				} else {
					LocationFormatRoleLimitDto locationFormatRoleLimitDto = new LocationFormatRoleLimitDto();
					locationFormatRoleLimitDto.setLocationFormat(LocationFormatEnum.LF.name());
					locationFormatRoleLimitDto.setUserLimit((short) 0);

					addRoleToLocationFormats.remove(locationFormatRoleLimitDto);
				}
			}
		}

		HttpEntity<AddRoleDetailsDto> entity = new HttpEntity<>(addRoleDetailsDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ ",,OK", "ZXXZ,,BAD_REQUEST", "REG_TEST_ROLE,,BAD_REQUEST", "CASHIER,U1,OK", "BOS,U1,OK",
			"CASHIER,,UNPROCESSABLE_ENTITY", "ADMIN,U0,BAD_REQUEST", "BOS,U0,BAD_REQUEST", "RSO,,OK", "FINANCE2,,OK",
			"KARIGAR,,OK", "UNITTEST2,,OK", "CASHIER2,,OK", "CASHIER,M66,BAD_REQUEST", "CASHIER,M65,BAD_REQUEST",
			"ADMIN,M65,OK", "SM,,OK" })
	void testUpdateRoleDetails1(String roleCode, String aclCode, String status) {

		Map<String, String> roleCodes = getRoleCodes();
		String[] roleCodesList = roleCodes.keySet().toArray(new String[0]);

		UpdateRolesDetailDto updateRolesDetailDto = new UpdateRolesDetailDto();

		if ("CASHIER".equals(roleCode) || "ADMIN".equals(roleCode)) {

			if ("U1".equals(aclCode) || "U0".equals(aclCode) || "M66".equals(aclCode) || "M65".equals(aclCode))
				updateRolesDetailDto.setAddAclCodes(Set.of(aclCode));
			else if (roleCode.equals("CASHIER") && status.equals("UNPROCESSABLE_ENTITY")) {
				updateRolesDetailDto.setAddAclCodes(Set.of("U1"));
				updateRolesDetailDto.setRemoveAclCodes(Set.of("U1"));
			}

		} else if ("BOS".equals(roleCode)) {
			updateRolesDetailDto.setRemoveAclCodes(Set.of(aclCode));
		} else if ("SM".equals(roleCode)) {
			LocationFormatRoleLimitDto locationFormatRoleLimitDto1 = new LocationFormatRoleLimitDto();
			locationFormatRoleLimitDto1.setLocationFormat(LocationFormatEnum.LF.name());
			locationFormatRoleLimitDto1.setUserLimit((short) 3);

			LocationFormatRoleLimitDto locationFormatRoleLimitDto2 = new LocationFormatRoleLimitDto();
			locationFormatRoleLimitDto2.setLocationFormat(LocationFormatEnum.SF.name());
			locationFormatRoleLimitDto2.setUserLimit((short) 2);

			updateRolesDetailDto
					.setAddRoleToLocationFormats(Set.of(locationFormatRoleLimitDto1, locationFormatRoleLimitDto2));
		} else if (!StringUtils.isEmpty(roleCode)) {
			updateRolesDetailDto.setDescription("Test");
			if ("REG_TEST_ROLE".equals(roleCode) || "RSO".equals(roleCode) || "FINANCE2".equals(roleCode)
					|| "UNITTEST2".equals(roleCode))
				updateRolesDetailDto.setIsActive(false);
			else if ("KARIGAR".equals(roleCode) || "CASHIER2".equals(roleCode)) {
				if ("CASHIER2".equals(roleCode)) {
					roleCode = "CASHIER";
				}
				updateRolesDetailDto.setIsActive(true);
			}
		} else {
			roleCode = roleCodesList[0];
			updateRolesDetailDto.setDescription(roleCodes.get(roleCodesList[0]));
		}

		HttpEntity<UpdateRolesDetailDto> entity = new HttpEntity<>(updateRolesDetailDto, headers);

		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + roleCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));

	}

}
