/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.EinvoiceIrnDetailsResponseDto;
import com.titan.poss.core.dto.EinvoiceJobResponseDto;
import com.titan.poss.core.dto.EinvoiceRetryDto;
import com.titan.poss.core.dto.InvoiceDocumentsUpdateDto;
import com.titan.poss.core.service.clients.InventoryServiceClient;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.intg.dao.EinvoiceAuditDao;
import com.titan.poss.integration.intg.repository.EinvoiceAuditRepository;
import com.titan.poss.integration.service.EinvoiceService;
import com.titan.poss.integration.service.IntegrationJobEpossService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service
public class IntegrationJobEpossServiceImpl implements IntegrationJobEpossService {

	@Autowired
	private EinvoiceAuditRepository einvoiceAuditRepository;

	@Autowired
	private EinvoiceService einvoiceService;

	@Autowired
	private InventoryServiceClient inventoryServiceClient;

	@Override
	@Transactional
	public EinvoiceJobResponseDto eInvoiceRetry() {
		EinvoiceJobResponseDto einvoiceJobResponseDto = new EinvoiceJobResponseDto();
		List<String> listResponse = new ArrayList<>();
		List<EinvoiceAuditDao> eInvoiceAuditList = einvoiceAuditRepository
				.getAuditDetails(CommonUtil.getLocationCode());
		List<EinvoiceIrnDetailsResponseDto> invoiceListToUpdate = new ArrayList<>();
		if (!CollectionUtil.isEmpty(eInvoiceAuditList)) {
			eInvoiceAuditList.forEach(einvoice -> {
				EinvoiceRetryDto einvoiceRetryDto = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(einvoice.getRequest()), EinvoiceRetryDto.class);
				EinvoiceIrnDetailsResponseDto invoiceDetails = einvoiceService.generateIrn(
						VendorCodeEnum.IRN_ASPTAX.name(), einvoiceRetryDto.getTransactionType(),
						einvoiceRetryDto.getEinvoiceIrnDetailsDto());
				if (BooleanUtils.isFalse(invoiceDetails.getStatus())) {
					listResponse.add(einvoice.getInvoiceTransactionId());
				} else {
					invoiceListToUpdate.add(invoiceDetails);
				}
				einvoice.setInvoiceTransactionId(null);
			});
			if (!CollectionUtil.isEmpty(invoiceListToUpdate)) {
				InvoiceDocumentsUpdateDto invoiceDocuments = new InvoiceDocumentsUpdateDto();
				invoiceDocuments.setInvoiceDocuments(invoiceListToUpdate);
				inventoryServiceClient.updateInvoiceDocuments(invoiceDocuments);
			}
			einvoiceAuditRepository.saveAll(eInvoiceAuditList);
		}
		einvoiceJobResponseDto.setEInvoiceJobResponse(listResponse);
		return einvoiceJobResponseDto;
	}

	@Override
	public EinvoiceJobResponseDto getFailedInvoiceList() {
		EinvoiceJobResponseDto einvoiceJobResponseDto = new EinvoiceJobResponseDto();
		List<EinvoiceAuditDao> eInvoiceAuditList = einvoiceAuditRepository
				.getAuditDetails(CommonUtil.getLocationCode());		
		log.info("EPOSS API TRIGGERED :" +eInvoiceAuditList.size() );
		einvoiceJobResponseDto.setEInvoiceJobResponse(eInvoiceAuditList.stream().map(entry ->entry.getInvoiceTransactionId()).collect(Collectors.toList()));
		return einvoiceJobResponseDto;

	}

}
