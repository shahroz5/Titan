/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.EventTransactionEnum;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnCancelDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.core.dto.EinvoiceRetryCancelDto;
import com.titan.poss.core.dto.EinvoiceRetryCancellationDto;
import com.titan.poss.core.dto.EinvoiceRetryDto;
import com.titan.poss.core.dto.EpossApiReqDto;
import com.titan.poss.core.dto.EventCashMemoCancellationAuditDto;
import com.titan.poss.core.dto.EventCashMemoMileStoneAuditDto;
import com.titan.poss.core.dto.EventGRNAuditDto;
import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.service.clients.SalesServiceClient;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dto.EventTridentAuditDto;
import com.titan.poss.integration.intg.dao.DialAuditDao;
import com.titan.poss.integration.intg.dao.EinvoiceAuditDao;
import com.titan.poss.integration.intg.repository.DialAuditRepository;
import com.titan.poss.integration.intg.repository.EinvoiceAuditRepository;
import com.titan.poss.integration.service.EinvoiceService;
import com.titan.poss.integration.service.IntegrationJobService;
import com.titan.poss.integration.service.RestClientService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service
public class IntegrationJobServiceImpl implements IntegrationJobService {

	@Autowired
	private DialAuditRepository dialAuditRepository;

	@Autowired
	private EventServiceImpl eventServiceImpl;

	@Autowired
	private EinvoiceAuditRepository einvoiceAuditRepository;

	@Autowired
	private EinvoiceService einvoiceService;

	@Autowired
	private SalesServiceClient salesServiceClient;
	
	@Autowired
	RestClientService restClientService;

	@Override
	public SchedulerResponseDto retryFailedEventTransactions() {
		try {
			List<DialAuditDao> eventAuditList = dialAuditRepository.getAuditDetails();
			if (!CollectionUtil.isEmpty(eventAuditList)) {
				eventAuditList.forEach(eventAudit -> {

					if (eventAudit.getTransactionType().equalsIgnoreCase(EventTransactionEnum.CM_MILESTONE.name())) {
						EventCashMemoMileStoneAuditDto eventCashMemoMileStoneAuditDto = MapperUtil
								.getObjectMapperInstance()
								.convertValue(MapperUtil.getJsonFromString(eventAudit.getRequest()),
										EventCashMemoMileStoneAuditDto.class);
						eventServiceImpl.cashMemoDetails(eventCashMemoMileStoneAuditDto.getVendorCode(),
								eventCashMemoMileStoneAuditDto.getTxnId(),
								eventCashMemoMileStoneAuditDto.getSuTxnType(),
								eventCashMemoMileStoneAuditDto.getStatus(), Boolean.TRUE,
								eventCashMemoMileStoneAuditDto.getEventCashMemoDto());
					} else if (eventAudit.getTransactionType()
							.equalsIgnoreCase(EventTransactionEnum.BC_MILESTONE.name())) {
						EventCashMemoCancellationAuditDto eventCashMemoCancellationAuditDto = MapperUtil
								.getObjectMapperInstance()
								.convertValue(MapperUtil.getJsonFromString(eventAudit.getRequest()),
										EventCashMemoCancellationAuditDto.class);
						eventServiceImpl.cancellationDetails(eventCashMemoCancellationAuditDto.getVendorCode(),
								eventCashMemoCancellationAuditDto.getTxnId(),
								eventCashMemoCancellationAuditDto.getCancelType(),
								eventCashMemoCancellationAuditDto.getStatus(), Boolean.TRUE,
								eventCashMemoCancellationAuditDto.getEventCancellationDto());
					} else if (eventAudit.getTransactionType()
							.equalsIgnoreCase(EventTransactionEnum.GRN_MILESTONE.name())) {
						EventGRNAuditDto eventGRNAuditDto = MapperUtil.getObjectMapperInstance().convertValue(
								MapperUtil.getJsonFromString(eventAudit.getRequest()), EventGRNAuditDto.class);
						eventServiceImpl.goodsReturnDetails(eventGRNAuditDto.getVendorCode(),
								eventGRNAuditDto.getTxnId(), Boolean.TRUE, eventGRNAuditDto.getEventGRNDto());
					} else {
						EventTridentAuditDto eventTridentAuditDto = MapperUtil.getObjectMapperInstance().convertValue(
								MapperUtil.getJsonFromString(eventAudit.getRequest()), EventTridentAuditDto.class);
						eventServiceImpl.orderDetailsToDialSave(eventTridentAuditDto.getVendorCode(),
								eventTridentAuditDto.getTxnId(), eventTridentAuditDto.getEventOrderDetailsDto(),
								eventTridentAuditDto.getTransactionType(), eventTridentAuditDto.getEventResponseDto(),
								Boolean.TRUE, eventTridentAuditDto.getStatus());
					}
				});
			}
		} catch (Exception e) {
			log.info(e.getMessage());
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.INTEGRATION_EVENT_RETRY_PUBLISH_JOB.name());
		response.setStatus(JobProcessStatusEnum.COMPLETED.name());
		return response;
	}

	@Override
	@Transactional
	public EinvoiceJobResponseDto eInvoiceRetry(String authorizationToken, String authorizationCookie) {
		if (authorizationToken == null)
			authorizationToken = getBearerToken(CommonConstants.AUTH_HEADER);
		if (authorizationCookie == null)
			authorizationCookie = getBearerToken(CommonConstants.COOKIE_HEADER);
		EinvoiceJobResponseDto einvoiceJobResponseDto = new EinvoiceJobResponseDto();
		List<String> eInvoiceJobResponse = new ArrayList<>();
		List<EinvoiceAuditDao> eInvoiceAuditList = einvoiceAuditRepository
				.getAuditDetails(CommonUtil.getLocationCode());
		List<EinvoiceIrnDetailsResponseDto> invoiceListToUpdate = new ArrayList<>();
		List<EinvoiceRetryCancelDto> cancelListToUpdate = new ArrayList<>();
		if (!CollectionUtil.isEmpty(eInvoiceAuditList)) {
			eInvoiceAuditList.forEach(einvoice -> {
				if (BooleanUtils.isTrue(einvoice.getInvoiceTransactionStatus()))
					eInvoiceGeneration(einvoice, eInvoiceJobResponse, invoiceListToUpdate);
				else
					eInvoiceCancellation(einvoice, eInvoiceJobResponse, cancelListToUpdate);
				einvoice.setInvoiceTransactionId(null);
			});
			einvoiceAuditRepository.saveAll(eInvoiceAuditList);
		}
		InvoiceDocumentsUpdateDto invoiceDocuments = new InvoiceDocumentsUpdateDto();
		invoiceDocuments.setInvoiceDocuments(invoiceListToUpdate);
		invoiceDocuments.setCancelResponse(cancelListToUpdate);
		EinvoiceJobResponseDto einvoiceJobResponseDtoEposs = salesServiceClient
				.updateInvoiceDocuments(authorizationToken, authorizationCookie, invoiceDocuments);
		if (einvoiceJobResponseDtoEposs != null
				&& !CollectionUtil.isEmpty(einvoiceJobResponseDtoEposs.getEInvoiceJobResponse())) {
			eInvoiceJobResponse.addAll(einvoiceJobResponseDtoEposs.getEInvoiceJobResponse());
		}
		einvoiceJobResponseDto.setEInvoiceJobResponse(eInvoiceJobResponse);
		return einvoiceJobResponseDto;
	}
	
	private String getBearerToken(String headerName) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		HttpServletRequest request = null;
		if (authentication != null) {
			request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		}
		if (request != null) {
			return request.getHeader(headerName);
		} else {
			return null;
		}
	}

	private void eInvoiceCancellation(EinvoiceAuditDao einvoice, List<String> eInvoiceJobResponse,
			List<EinvoiceRetryCancelDto> cancelListToUpdate) {
		EinvoiceRetryCancellationDto einvoiceRetryCancellationDto = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(einvoice.getRequest()), EinvoiceRetryCancellationDto.class);
		EinvoiceIrnCancelDetailsResponseDto einvoiceIrnCancelDetailsResponseDto = einvoiceService.cancelIrn(
				einvoiceRetryCancellationDto.getTransactionId(), einvoiceRetryCancellationDto.getCancelTxnId(),
				VendorCodeEnum.IRN_ASPTAX.name(), einvoiceRetryCancellationDto.getInvoiceRefNumber(),
				einvoiceRetryCancellationDto.getDocNo(), einvoiceRetryCancellationDto.getReason(),
				einvoiceRetryCancellationDto.getRemarks());
		if (BooleanUtils.isFalse(einvoiceIrnCancelDetailsResponseDto.getStatus())) {
			eInvoiceJobResponse.add(einvoice.getInvoiceTransactionId());
		} else {
			EinvoiceRetryCancelDto einvoiceRetryCancelDto = new EinvoiceRetryCancelDto();
			einvoiceRetryCancelDto.setCancelTxnId(einvoiceRetryCancellationDto.getCancelTxnId());
			einvoiceRetryCancelDto.setSalesTxnId(einvoiceRetryCancelDto.getSalesTxnId());
			cancelListToUpdate.add(einvoiceRetryCancelDto);
		}
	}

	private void eInvoiceGeneration(EinvoiceAuditDao einvoice, List<String> eInvoiceJobResponse,
			List<EinvoiceIrnDetailsResponseDto> invoiceListToUpdate) {
		EinvoiceRetryDto einvoiceRetryDto = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(einvoice.getRequest()), EinvoiceRetryDto.class);
		EinvoiceIrnDetailsResponseDto invoiceDetails = einvoiceService.generateIrn(VendorCodeEnum.IRN_ASPTAX.name(),
				einvoiceRetryDto.getTransactionType(), einvoiceRetryDto.getEinvoiceIrnDetailsDto());
		if (BooleanUtils.isFalse(invoiceDetails.getStatus())) {
			eInvoiceJobResponse.add(einvoice.getInvoiceTransactionId());
		} else {
			invoiceListToUpdate.add(invoiceDetails);
		}

	}
	
	@Override
	public List<String> getFailedInvoiceList() {
		List<EinvoiceAuditDao> eInvoiceAuditList = einvoiceAuditRepository
				.getAuditDetails(CommonUtil.getLocationCode());		
		return eInvoiceAuditList.stream().map(entry ->entry.getInvoiceTransactionId()).collect(Collectors.toList());
	}

	
	@Override
	public List<String> getFailedEpossInvoiceList(HttpServletRequest request) {
		EpossApiReqDto epossApiReqDto = new EpossApiReqDto();
		epossApiReqDto.setHttpMethod(HttpMethod.GET);
		epossApiReqDto.setRelativeUrl("api/integration/v2/jobs/eposs/failed-einvoice-irn/list");
		ApiResponseDto apiResponseDto = restClientService.runEPOSSAPIRequest(epossApiReqDto, null, request);
		EinvoiceJobResponseDto einvoiceJobResponseDto = MapperUtil.getObjectMapperInstance()
				.convertValue(apiResponseDto.getResponse(), EinvoiceJobResponseDto.class);
		return einvoiceJobResponseDto.getEInvoiceJobResponse();
	}
}
