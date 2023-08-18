/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.dto.request.CreditNoteUpdateDto;
import com.titan.poss.payment.dto.response.CreditNoteMasterDto;
import com.titan.poss.payment.service.CreditNoteService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController("paymentCreditNoteController")
@RequestMapping("payment/v2/credit-notes")
public class CreditNoteController {

	@Autowired
	private CreditNoteService creditNoteService;

	private static final String CREDIT_NOTE_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.CREDIT_NOTE_VIEW + PreAuthorizeDetails.END;

	private static final String CREDIT_NOTE_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ PaymentAccessControls.CREDIT_NOTE_ADD_EDIT + PreAuthorizeDetails.END;

	/**
	 * This method will return the list of creditnotes based on the isActive
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CreditNoteDto>>
	 */
	@ApiOperation(value = "View the list of CreditNote details", notes = "This API returns the list of CreditNote details based on **isActive**")
	@GetMapping
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<CreditNoteMasterDto>> listCreditNotes(
			@RequestParam(required = false) String creditNoteType, @RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return creditNoteService.listCreditNotes(creditNoteType, isActive, pageable);
	}

	/**
	 * This method will return the CreditNoteDetails details based on the
	 * creditNoteType.
	 * 
	 * @param creditNoteType
	 * @return CreditNoteMasterDto
	 */
	@ApiOperation(value = "View the CreditNote details based on the creditNoteType", notes = "This API returns the CreditNote details based on the **creditNoteType**")
	@GetMapping(value = "/{creditNoteType}")
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	public CreditNoteMasterDto getCreditNote(@PathVariable("creditNoteType") String creditNoteType) {
		return creditNoteService.getCreditNote(creditNoteType);
	}

	/**
	 * This method will update the CreditNote details.
	 * 
	 * @param creditNoteType
	 * @param creditNoteUpdateDto
	 * @param bindingResult
	 * @return CreditNoteMasterDto
	 */
	@ApiOperation(value = "Update the CreditNote details", notes = "This API updates the CreditNote details <br/> if **isActive** is false, then it will be soft deleted based on the **creditNoteType**")
	@PatchMapping(value = "/{creditNoteType}")
	@PreAuthorize(CREDIT_NOTE_ADD_EDIT_PERMISSION)
	public CreditNoteMasterDto updateCreditNote(@PathVariable("creditNoteType") String creditNoteType,
			@RequestBody @Valid CreditNoteUpdateDto creditNoteUpdateDto) {

		return creditNoteService.updateCreditNote(creditNoteType, creditNoteUpdateDto);
	}

}
