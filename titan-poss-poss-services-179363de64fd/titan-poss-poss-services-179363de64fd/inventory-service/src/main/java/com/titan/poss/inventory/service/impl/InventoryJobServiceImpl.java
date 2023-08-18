/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dto.request.json.IbtRuleDetails;
import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.dto.ComUpdateRequestDto;
import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.dto.VendorUpdateDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ComResponseDto;
import com.titan.poss.core.service.clients.AuthServiceClient;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.service.clients.LocationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.inventory.dao.InventoryInvoiceDocumentsDao;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.repository.InventoryInvoiceDocumentsRepository;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.repository.StockRequestDetailsRepository;
import com.titan.poss.inventory.repository.StockRequestRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryJobService;


import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service
public class InventoryJobServiceImpl implements InventoryJobService {

	@Autowired
	StockRequestRepository stockRequestRepository;

	@Autowired
	StockRequestDetailsRepository stockRequestDetailsRepository;

	@Autowired
	EngineService engineService;

	@Autowired
	LocationServiceClient locationServiceClient;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Autowired
	private InventoryInvoiceDocumentsRepository inventoryInvoiceDocumentsRepository;
	
	

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	private String authorizationToken;

	@Value("${country.code}")
	private String countryCode;

	private static final String ERR_CORE_044 = "ERR-CORE-044";

	private static final String ADMIN = "Scheduler";
	
	private static final String ERR_INV_055 = "ERR-INV-055";

	private static final String EXCEPTION_MSG = "While calling STN confirmation API getting  error";

	private static final String STOCK_REQUEST_NOT_AVAILABLE = "Stock request not available ";

	private static final String ERR_INV_056 = "ERR-INV-056";
	
	private static final String APPROVED = "APPROVED";

	@Override
	@Transactional
	public SchedulerResponseDto closeUnacceptedRequests(String locationCode) {

		String ruleType = RuleTypeEnum.IBT_CONFIGURATIONS.toString();
		Date docDate = engineService.getBusinessDayScheduler(locationCode);
		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(locationCode);
		Object response = engineService.getRuleFieldValues(ruleType, ruleRequestListDto);
		IbtRuleDetails ibtConfig = MapperUtil.getObjectMapperInstance().convertValue(response, IbtRuleDetails.class);
		Integer noOfHours = Integer.valueOf(ibtConfig.getValidRequestTime());
		Calendar cal = Calendar.getInstance();
		cal.setTime(docDate);
		cal.add(Calendar.HOUR, -noOfHours);

		stockRequestDetailsRepository.closeUnacceptedIBTRequestDetails(new Date(), ADMIN, cal.getTime(), locationCode);
		stockRequestRepository.closeUnacceptedIBTRequests(new Date(), ADMIN, cal.getTime(), locationCode);

		SchedulerResponseDto schedulerResponse = new SchedulerResponseDto();
		schedulerResponse.setCode(SchedulerCodeEnum.INVENTORY_IBT_CLOSE.name());
		schedulerResponse.setStatus(JobProcessStatusEnum.COMPLETED.name());
		return schedulerResponse;
	}

	@Override
	public SchedulerResponseDto publishToDataSync() {
		try {
			if (StringUtils.isEmpty(authorizationToken) || !TokenValidatorUtil.isValidExpVal(authorizationToken)
					|| !TokenValidatorUtil.isValidJWT(authorizationToken, jwtSecret)) {
				authorizationToken = getToken();
			}
			List<SyncStaging> syncStagingList = new ArrayList<>();
			int i = -1;
			do {
				Pageable pageable = PageRequest.of(++i, 100, Sort.by("createdDate").ascending());
				syncStagingList.clear();
				syncStagingList = inventorySyncStagingRepository.findSyncStagingDetails(pageable);
				if (!syncStagingList.isEmpty()) {
					List<String> syncIdList = new ArrayList<>();
					syncStagingList.forEach(syncStaging -> {
						Response response = dataSyncServiceClient.publishWithToken("Bearer " + authorizationToken,
								MapperUtil.getObjectMapperInstance().convertValue(
										MapperUtil.getJsonFromString(syncStaging.getMessage()), MessageRequest.class));
						if (response.status() == 200) {
							syncIdList.add(syncStaging.getId());
						}
					});
					if (!syncIdList.isEmpty())
						inventorySyncStagingRepository.updateSyncStatus(syncIdList);
				}
			} while (!syncStagingList.isEmpty());
			inventorySyncStagingRepository.deletePublishedMessage();
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), ERR_CORE_044);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.INVENTORY_DATA_SYNC.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	private String getToken() {
		VendorDto vendorDto = integrationServiceClient.getVendor(VendorCodeEnum.POSS_TITAN.toString());
		authorizationToken = getAuthHeaderToken(vendorDto);
		return authorizationToken;
	}

	private String getAuthHeaderToken(VendorDto vendorDto) {
		List<String> credentials = TokenValidatorUtil.verifyDetails(vendorDto.getVendorDetails().toString());
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);
		boolean isNewTokenReq = false;
		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			isNewTokenReq = true;
		}
		if (isNewTokenReq) {
			OAuthToken oauthToken = null;
			ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
			oauthToken = authServiceClient.generateToken(clientLogin);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();
			Map<String, String> vendorDetailsMap = TokenValidatorUtil
					.getMapFromJsonStr(vendorDto.getVendorDetails().toString());
			vendorDetailsMap.put("token", token);
			vendorDetailsMap.put("exp", exp);
			Map<String, Object> vendorMap = new LinkedHashMap<>();
			vendorMap.put("type", "TOKEN");
			vendorMap.put("data", vendorDetailsMap);
			VendorUpdateDto vendorUpdateDto = (VendorUpdateDto) MapperUtil.getObjectMapping(vendorDto,
					new VendorUpdateDto());
			vendorUpdateDto
					.setVendorDetails(MapperUtil.getObjectMapperInstance().convertValue(vendorMap, Object.class));
			integrationServiceClient.updateVendor(vendorDto.getVendorCode(), vendorUpdateDto);
		}
		return token;
	}

	@Override
	@Transactional
	public SchedulerResponseDto updateInvoiceDocuments(InvoiceDocumentsUpdateDto invoiceDocumentsUpdateDto) {
		List<InventoryInvoiceDocumentsDao> invoiceDocumentDaos = new ArrayList<>();
		invoiceDocumentsUpdateDto.getInvoiceDocuments().forEach(invoiceDocument -> {
			invoiceDocumentDaos.add(MapperUtil.mapObjToClass(invoiceDocument, InventoryInvoiceDocumentsDao.class));
		});
		inventoryInvoiceDocumentsRepository.saveAll(invoiceDocumentDaos);
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		schedulerResponseDto.setCode(SchedulerCodeEnum.GENERATE_INVOICE_DOCUMENTS.name());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.name());
		return schedulerResponseDto;
	}
	
	@Override
	public SchedulerResponseDto updateStatusStnConfirm(){
		List<StockRequestDao> stockRequestDaoList = stockRequestRepository.findAllByStatusAndComConfirm(APPROVED, false);
		stockRequestDaoList = stockRequestDaoList.stream().filter(ele -> ele.getComOrderNumber() != null)
				.collect(Collectors.toList());
		SchedulerResponseDto schedulerResponseDto = new SchedulerResponseDto();
		if (stockRequestDaoList.isEmpty()) {
			log.info("No STN Pending for confirm ");
			schedulerResponseDto.setStatus(JobProcessStatusEnum.NO_STN.name());
			return schedulerResponseDto;
		}
		try {
			   for (StockRequestDao stockRequest : stockRequestDaoList) {
					if (stockRequest.getComOrderNumber() != null) {
						ComUpdateRequestDto comUpdateRequestDto = new ComUpdateRequestDto();
						comUpdateRequestDto.setCOMLocationCode(stockRequest.getDestLocationCode());
						comUpdateRequestDto.setSTNLocationCode(stockRequest.getSrcLocationCode());
						comUpdateRequestDto.setCOMOrderNo(stockRequest.getComOrderNumber());
						comUpdateRequestDto.setSTNDocDate(stockRequest.getReqDocDate());
						comUpdateRequestDto.setSTNDocNo(stockRequest.getReqDocNo());
						comUpdateRequestDto.setStatus(stockRequest.getStatus());
						Object resObject = integrationServiceClient.updateStatus(comUpdateRequestDto);
						setSTNConfirmation(resObject, stockRequest);
					}
				}

		} catch (Exception e) {
			throw new ServiceException(EXCEPTION_MSG, ERR_INV_055);
		}
		
		schedulerResponseDto.setCode(SchedulerCodeEnum.EA_STN_CONFIRM.name());
		schedulerResponseDto.setStatus(JobProcessStatusEnum.COMPLETED.name());
		return schedulerResponseDto;
	}

	

	private void setSTNConfirmation(Object resObject, StockRequestDao stockRequest) {
		if (resObject != null) {
			ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
					false);
			ComResponseDto comSTNConfirmationDto = mapper.convertValue(resObject,
					new TypeReference<ComResponseDto>() {
					});
			stockRequest.setComUser(comSTNConfirmationDto.getUser());
			stockRequest.setComRequestId(comSTNConfirmationDto.getRequestId());
			stockRequest.setComStatus(comSTNConfirmationDto.getStatus());
			stockRequest.setComConfirm(true);
			stockRequestRepository.save(stockRequest);
		}

	}

}