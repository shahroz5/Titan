/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.payment.dao.CreditNoteMasterDao;
import com.titan.poss.payment.dto.request.CreditNoteUpdateDto;
import com.titan.poss.payment.dto.response.CreditNoteMasterDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("paymentCreditNoteService")
public interface CreditNoteService {

	/**
	 * @param creditNoteType
	 * @param isActive
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<CreditNoteMasterDto>> listCreditNotes(String creditNoteType, Boolean isActive,
			Pageable pageable);

	/**
	 * @param creditNoteType
	 * @return
	 */
	CreditNoteMasterDto getCreditNote(String creditNoteType);

	/**
	 * @param creditNoteType
	 * @param creditNoteUpdateDto
	 * @return
	 */
	CreditNoteMasterDto updateCreditNote(String creditNoteType, @Valid CreditNoteUpdateDto creditNoteUpdateDto);
	
	SyncStagingDto updateCreditNote(CreditNoteMasterDao creditNoteMasterDao,String operation);

}
