/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.dto.DepositDateDto;
import com.titan.poss.sales.dto.DepositSummaryRequestDto;
import com.titan.poss.sales.dto.DepositSummaryResponseDto;
import com.titan.poss.sales.dto.FileUploadResponseDtoExt;
import com.titan.poss.sales.dto.GhsBankDepositDto;
import com.titan.poss.sales.dto.ServiceBankDepositDto;
import com.titan.poss.sales.dto.request.BankDepositUpdateRequestDto;
import com.titan.poss.sales.dto.request.BankingRequestDto;
import com.titan.poss.sales.dto.request.DepositAmountRequestDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.request.RevenueDateDto;
import com.titan.poss.sales.dto.response.BankDepositResponseDto;
import com.titan.poss.sales.dto.response.DepositAmountResponseDto;
import com.titan.poss.sales.dto.response.DepositResponseDto;
import com.titan.poss.sales.service.BankingService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController("BankDepositController")
@RequestMapping(value = "sales/v2/bankings")
@PreAuthorize(IS_STORE_USER)
public class BankingController {

	@Autowired
	private BankingService bankingService;

	private static final String BANK_DEPOSIT_VIEW_PERMISSION = START + SalesAccessControls.BANK_DEPOSITE_VIEW + END;
	private static final String BANK_DEPOSIT_ADD_EDIT_PERMISSION = START + SalesAccessControls.BANK_DEPOSITE_ADD_EDIT
			+ END;
	private static final String EOD_PERMISSION = START + SalesAccessControls.EOD + END;

	/**
	 * This method will return the list of bank deposit details.
	 * 
	 * @param paymentCode
	 * @return ListResponse<BankDepositResponseDto>
	 */
	@ApiOperation(value = "View the list of bank deposit details", notes = "This API returns the list of bank deposit details")
	@GetMapping
	@ApiPageable
	@PreAuthorize(BANK_DEPOSIT_VIEW_PERMISSION)
	public PagedRestResponse<List<BankDepositResponseDto>> listBankDeposit(
			@RequestParam(required = false) @ApiParam(value = "Payment Code", allowableValues = "CASH,CARD,CHEQUE,DD") List<@ValueOfEnum(enumClass = PaymentCodeEnum.class) String> paymentCode,
			@ApiIgnore Pageable pageable) {

		return bankingService.listBankDeposit(paymentCode, pageable);
	}

	/**
	 * This method will return the list of bank deposit details.
	 * 
	 * @param paymentCode
	 * @return ListResponse<BankDepositResponseDto>
	 */
	@ApiOperation(value = "This API is to check bank deposit is done or not in BTQ", notes = "This API is to check bank deposit is done or not in BTQ")
	@PostMapping
	@PreAuthorize(EOD_PERMISSION)
	public BooleanResponse getBankDeposit(
			@RequestBody @Valid @ApiParam(name = "body", value = "businessDate", required = true) BankingRequestDto bankingRequest) {

		return bankingService.getBankDeposit(bankingRequest);
	}

	/**
	 * This method will return the dates for which ghs file hasn't been uploaded.
	 * 
	 * @param paymentCode
	 * @return ListResponse<PaymentDto>
	 */
	@ApiOperation(value = "This API is to check GHS file uploded or not", notes = "This API will give the dates for which GHS file hasn't uploaded")
	@GetMapping(value = "ghs")
	@PreAuthorize(BANK_DEPOSIT_VIEW_PERMISSION)
	public GhsBankDepositDto getGHSBankDeposit() {

		return bankingService.getGHSBankDeposit();
	}

	/**
	 * This method will update the bank deposit details.
	 * 
	 * @param bankDepositUpdate
	 * @return BankDepositDto
	 */
	@ApiOperation(value = "This method will update the bank deposit details.", notes = "This method will update the bank deposit details.")
	@PatchMapping
	@PreAuthorize(BANK_DEPOSIT_ADD_EDIT_PERMISSION)
	public ListResponse<BankDepositResponseDto> updateBankDeposit(
			@RequestBody @Valid BankDepositUpdateRequestDto bankDepositUpdate) {

		return bankingService.updateBankDeposit(bankDepositUpdate);
	}

	/**
	 * This method will update the cash denomination for bank deposit details.
	 * 
	 * @param depositSummaryRequestDto
	 * @return DepositSummaryResponseDto
	 */
	@ApiOperation(value = "This method will add the cash denomination details", notes = "This method will update the cash denomination for bank deposit")
	@PostMapping(value = "denomination")
	@PreAuthorize(BANK_DEPOSIT_ADD_EDIT_PERMISSION)
	public DepositSummaryResponseDto addCashDenomination(
			@RequestBody DepositSummaryRequestDto depositSummaryRequestDto) {

		return bankingService.addCashDenomination(depositSummaryRequestDto);
	}

	/**
	 * This Api will return the bank deposit day wise.
	 * 
	 * @param revenueDateDto
	 * @param pageable
	 * @return PagedRestResponse<List<DepositResponseDto>>
	 */
	@ApiOperation(notes = "API to get list of day wise bank deposit in the given date interval", value = "API will return list of day wise bank deposit in the given date interval")
	@PostMapping(value = "/deposits")
	@PreAuthorize(BANK_DEPOSIT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<DepositResponseDto>> getBankDeposits(
			@RequestBody @Valid RevenueDateDto revenueDateDto, @ApiIgnore Pageable pageable) {

		return bankingService.getBankDeposits(revenueDateDto, pageable);
	}

	/**
	 * This Api will upload the ghs-bank-deposit file.
	 * 
	 * @param Multipartfile reqFile
	 * @return FileUploadResponseDto
	 */
	@ApiOperation(notes = "API to upload ghs bank deposit file", value = "This API will upload the ghs bank deposit file to the POSS")
	@PostMapping(value = "file-upload")
	@PreAuthorize(BANK_DEPOSIT_ADD_EDIT_PERMISSION)
	public FileUploadResponseDtoExt addGhsBankDeposit(@RequestParam(required = true) MultipartFile reqFile) {

		return bankingService.addGhsBankDeposit(reqFile);
	}
	
	@ApiOperation(value = "API to give list of transaction id's which are deposited for the given date")
	@PostMapping(value="/deposit-date")
	public Map<String,List<PrintRequestDto>> getTransactionIds(@RequestBody @Valid @ApiParam(name = "body", value = "depositDate", required = true) DepositDateDto depositDate){
		return bankingService.getTransactionIds(depositDate);
	}
	
	/**
	 * This Api will upload the service poss bank-deposit file.
	 * 	 * @param Multipartfile reqFile
	 * @return FileUploadResponseDto
	 */
	@ApiOperation(notes = "API to upload service-poss bank deposit file", value = "This API will upload the service poss bank deposit file to the POSS")
	@PostMapping(value = "service-file-upload")
	@PreAuthorize(BANK_DEPOSIT_ADD_EDIT_PERMISSION)
	public FileUploadResponseDtoExt addServicePossBankDeposit(@RequestParam(required = true) MultipartFile reqFile) {
		return bankingService.addServicePossBankDeposit(reqFile);
	}
	
	
	@ApiOperation(value = "API to give the list of transactionIds along with sum of deposit amount for the given PIF number")
	@PostMapping(value = "/pifNo")
	public DepositAmountResponseDto getDepositAmount(@RequestBody DepositAmountRequestDto depositAmountRequest) {
		
		return bankingService.getDepositAmount(depositAmountRequest);
	}
	
	/**
	 * This method will return the dates for which service file hasn't been uploaded.
	 * 
	 * @param paymentCode
	 * @return ListResponse<PaymentDto>
	 */
	@ApiOperation(value = "This API is to check Service file uploded or not", notes = "This API will give the dates for which Service file hasn't uploaded")
	@GetMapping(value = "service")
	@PreAuthorize(BANK_DEPOSIT_VIEW_PERMISSION)
	public ServiceBankDepositDto getServiceBankDeposit() {

		return bankingService.getServiceBankDeposit();
	}
	
}
