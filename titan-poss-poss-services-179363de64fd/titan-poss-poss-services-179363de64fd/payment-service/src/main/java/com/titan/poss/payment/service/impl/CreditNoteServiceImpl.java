/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.dao.CreditNoteMasterDao;
import com.titan.poss.payment.dao.SyncStaging;
import com.titan.poss.payment.dto.CreditNoteSyncDto;
import com.titan.poss.payment.dto.request.CreditNoteUpdateDto;
import com.titan.poss.payment.dto.response.CreditNoteMasterDto;
import com.titan.poss.payment.repository.CreditNoteMasterRepository;
import com.titan.poss.payment.repository.PaymentSyncStagingRepository;
import com.titan.poss.payment.service.CreditNoteService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("engineCreditNoteServiceImpl")
public class CreditNoteServiceImpl implements CreditNoteService {

	@Autowired
	CreditNoteMasterRepository crediNoteRepo;

	@Autowired
	private PaymentSyncStagingRepository paymentSyncStagingRepository;

	@Autowired
	private PaymentSyncDataServiceImpl syncDataService;

	@Override
	public PagedRestResponse<List<CreditNoteMasterDto>> listCreditNotes(String creditNoteType, Boolean isActive,
			Pageable pageable) {
		/*
		 * CreditNoteMasterDao creditNoteCriteria = new CreditNoteMasterDao();
		 * creditNoteCriteria.setCreditNoteType(creditNoteType);
		 * creditNoteCriteria.setIsActive(isActive);
		 * 
		 * ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		 * Example<CreditNoteMasterDao> criteria = Example.of(creditNoteCriteria,
		 * matcher);
		 */

		Page<CreditNoteMasterDao> creditNoteList = crediNoteRepo.findCnType(creditNoteType, isActive, pageable);

		List<CreditNoteMasterDto> creditNoteDtoList = new ArrayList<>();

		for (CreditNoteMasterDao creditNoteDao : creditNoteList) {
			CreditNoteMasterDto creditNoteDto = (CreditNoteMasterDto) MapperUtil.getObjectMapping(creditNoteDao,
					new CreditNoteMasterDto());
			creditNoteDto.setConfigDetails(MapperUtil.getJsonFromString(creditNoteDao.getConfigDetails()));
			creditNoteDtoList.add(creditNoteDto);
		}
		return (new PagedRestResponse<>(creditNoteDtoList, creditNoteList));
	}

	CreditNoteMasterDto mapToCreditNoteDto(CreditNoteMasterDao creditNote) {
		CreditNoteMasterDto creditNoteDto;

		creditNoteDto = (CreditNoteMasterDto) MapperUtil.getObjectMapping(creditNote, new CreditNoteMasterDto());
		creditNoteDto.setConfigDetails(MapperUtil.getJsonFromString(creditNote.getConfigDetails()));
		return creditNoteDto;
	}

	@Override
	public CreditNoteMasterDto getCreditNote(String creditNoteType) {
		CreditNoteMasterDao creditNote = crediNoteRepo.findOneByCreditNoteType(creditNoteType);

		if (creditNote == null) {
			throw new ServiceException("No credit notes found: ", "ERR-PAY-22");
		} else {
			return mapToCreditNoteDto(creditNote);
		}
	}

	@Override
	public CreditNoteMasterDto updateCreditNote(String creditNoteType, @Valid CreditNoteUpdateDto creditNoteUpdateDto) {
		CreditNoteMasterDao creditNote = crediNoteRepo.findOneByCreditNoteType(creditNoteType);

		if (creditNote == null) {
			throw new ServiceException("No credit notes found: ", "ERR-PAY-22");
		}

		creditNote = (CreditNoteMasterDao) MapperUtil.getObjectMapping(creditNoteUpdateDto, creditNote);

		creditNote.setConfigDetails(MapperUtil.getStringFromJson(creditNoteUpdateDto.getConfigDetails()));
		creditNote.setSrcSyncId(creditNote.getSrcSyncId() + 1);
		// creditNote = crediNoteRepo.save(creditNote);
		SyncStagingDto syncStagingDto = updateCreditNote(creditNote, PaymentOperationCodes.CREDIT_NOTE_UPDATE);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		return mapToCreditNoteDto(creditNote);
	}

	public SyncStagingDto updateCreditNote(CreditNoteMasterDao creditNoteMasterDao, String operation) {
		creditNoteMasterDao = crediNoteRepo.save(creditNoteMasterDao);
		CreditNoteSyncDto creditNoteSyncDto = new CreditNoteSyncDto(creditNoteMasterDao);
		SyncStagingDto creditNoteStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		syncDataList.add(DataSyncUtil.createSyncData(creditNoteSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest creditNoteMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		creditNoteStagingDto.setMessageRequest(creditNoteMsgRequest);
		String creditNoteMsg = MapperUtil.getJsonString(creditNoteMsgRequest);
		// saving to staging table
		SyncStaging creditNoteSyncStaging = new SyncStaging();
		creditNoteSyncStaging.setMessage(creditNoteMsg);
		creditNoteSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		creditNoteSyncStaging = paymentSyncStagingRepository.save(creditNoteSyncStaging);
		creditNoteStagingDto.setId(creditNoteSyncStaging.getId());
		return creditNoteStagingDto;

	}
}
