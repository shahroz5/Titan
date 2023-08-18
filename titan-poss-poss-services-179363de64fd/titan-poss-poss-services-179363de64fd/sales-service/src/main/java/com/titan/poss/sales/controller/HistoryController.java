/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionActionTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.core.dto.CustomerDocumentsRequestDto;
import com.titan.poss.core.dto.InvoiceDocumentsDetailsDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.HistorySearchTypeEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.constants.SearchDocumentTypeEnum;
import com.titan.poss.sales.constants.SubTxnTypeEum;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.constants.CNTransferStatus;
import com.titan.poss.sales.dto.constants.SubTxnTypeCancelEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.request.CashMemoHistoryReqDto;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.AdvanceBookingHistoryDto;
import com.titan.poss.sales.dto.response.AdvanceHistoryDto;
import com.titan.poss.sales.dto.response.BillCancellationHistoryDto;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CashMemoHistoryResponse;
import com.titan.poss.sales.dto.response.GoodsExchangeDto;
import com.titan.poss.sales.dto.response.GrnHistoryResponse;
import com.titan.poss.sales.service.SalesHistoryService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@RestController("salesHistoryController")
@RequestMapping(value = "sales/v2/history")
public class HistoryController {

	@Autowired
	private SalesHistoryService saleHistoryService;

	@ApiPageable
	@PostMapping("/cash-memo")
	@ApiOperation(value = "API to get cash memo and gift sales history", notes = "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type(Related to CM):</span>"
			+ "<ul>" + "	<li>NEW_CM</li>" + "	<li>MANUAL_CM</li>" + "	<li>FOC_CM</li>" + "	<li>GIFT_SALE</li>"
			+ "</ul><br>")
	public PagedRestResponse<List<CashMemoHistoryResponse>> getCashMemoHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID,CUSTOMER_NAME") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "Sub transaction type", allowableValues = "NEW_CM,MANUAL_CM,FOC_CM,GIFT_SALE", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SubTxnTypeEum.class) String subTxnType,
			@ApiParam(value = "Transaction type", allowableValues = "CM", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestBody(required = false) @Validated CashMemoHistoryReqDto cashMemoHistoryDto,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.getCashMemoHistoryService(searchField, searchType, subTxnType, txnType,
				cashMemoHistoryDto, pageable);

	}

	@ApiPageable
	@PostMapping("/accept-advance")
	@ApiOperation(value = "API to get accept advance and GRF history", notes = "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type(Related to ADV):</span>"
			+ "<ul>" + "	<li>FROZEN_RATES</li>" + "	<li>NON_FROZEN_RATES</li>" + "</ul><br>")
	public PagedRestResponse<List<AdvanceHistoryDto>> getAdvanceHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "Accept advance status", allowableValues = "OPEN,CONFIRMED,DELETED") @RequestParam(required = false) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(value = "Sub transaction type", allowableValues = "FROZEN_RATES,NON_FROZEN_RATES,MANUAL_FROZEN_RATES", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(value = "Transaction type", allowableValues = "ADV", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt advanceHistoryDto,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.getAdvanceHistoryService(searchField, searchType, status, subTxnType, txnType,
				advanceHistoryDto, pageable);
	}

	@ApiPageable
	@PostMapping("/cancel")
	@ApiOperation(value = "API to get bill cancellation history", notes = "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type(Related to CM):</span>"
			+ "<ul>" + "	<li>GIFT_SALE</li>" + "	<li>CASH_MEMO</li>" + "</ul><br>")
	public PagedRestResponse<List<BillCancellationHistoryDto>> getCancelHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "Sub transaction type", allowableValues = "GIFT_SALE, CASH_MEMO", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType,
			@ApiParam(value = "Transaction type", allowableValues = "CMCAN", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt cancelHistoryDto,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.getCancelHistoryService(searchField, searchType, subTxnType, txnType,
				cancelHistoryDto, pageable);
	}

	@ApiPageable
	@PostMapping("/order")
	@ApiOperation(value = "API to get advance booking history", notes = "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type:</span>"
			+ "<ul>" + "	<li>NEW_AB</li>" + "	<li>MANUAL_AB</li>" + "</ul><br>")
	public PagedRestResponse<List<AdvanceBookingHistoryDto>> getOrderHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(name = "status", value = "transaction action to be performed", allowableValues = "CANCEL,ACTIVATE,RATE_FREEZE", required = false) @RequestParam(name = "status", required = false) @ValueOfEnum(enumClass = TransactionActionTypeEnum.class) String actionType,
			@ApiParam(value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(value = "RSO Employee Code") @RequestParam(required = false) @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = false) String employeeCode,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt orderHistoryDto,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.getOrderHistoryService(searchField, searchType, actionType, txnType, subTxnType,
				employeeCode, orderHistoryDto, pageable);
	}

	@ApiPageable
	@PostMapping("/credit-note")
	@ApiOperation(value = "API to get creditNote history", notes = "<span style=\"font-weight: bold;font-size:14px;\"> Credit Note Status: </span>"
			+ "<ul>" + "	<li>OPEN</li>" + "	<li>CANCELLED</li>" + "	<li>REDEEMED</li>" + "	<li>SUSPENDED</li>"
			+ "	<li>TRANSFER_IBT</li>" + "	<li>TRANSFER_GHS</li>" + "	<li>REDEMPTION_PENDING</li>" + "</ul><br>")
	public PagedRestResponse<List<CNResponseDto>> getCreditNoteHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "CreditNote status", allowableValues = "OPEN, CANCELLED, REDEEMED, SUSPENDED, TRANSFER_IBT, TRANSFER_GHS, REDEMPTION_PENDING") @RequestParam(required = false) @ValueOfEnum(enumClass = CNStatus.class) String status,
			@ApiParam(value = "CreditNote Type", allowableValues = "ADV, BILL_CANCELLATION, CN_IBT, GEP, GHS, GRN, TEP, EVOUCHER") @RequestParam(required = false) @ValueOfEnum(enumClass = CNType.class) String cnType,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt creditNoteHistoryDto,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.getCreditNoteHistoryService(searchField, searchType, status, cnType,
				creditNoteHistoryDto, pageable);
	}

	@ApiPageable
	@PostMapping("/credit-note-transfer")
	@ApiOperation(value = "API to get creditNote transfer history in srource Btq.", notes = "<span style=\"font-weight: bold;font-size:14px;\"> Credit Note Transfer Status </span>"
			+ "<ul>" + "	<li>ISSUED</li>" + "	<li>RECEIVED</li>" + "	<li>PENDING</li>" + "	<li>REJECTED</li>"
			+ "</ul><br>")
	public PagedRestResponse<List<CreditNoteTransferDto>> getCreditNoteTransferHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "CreditNote status", allowableValues = "ISSUED, RECEIVED, PENDING, REJECTED") @RequestParam(required = false) @ValueOfEnum(enumClass = CNTransferStatus.class) String status,
			@ApiParam(value = "CreditNote Type", allowableValues = "ADV, BILL_CANCELLATION, CN_IBT, GEP, GHS, GRN, TEP, EVOUCHER") @RequestParam(required = false) @ValueOfEnum(enumClass = CNType.class) String cnType,
			@ApiParam(value = "Destination Location") @RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = false) String destLocation,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt creditNoteHistoryDto,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.getCreditNoteTransferHistoryService(searchField, searchType, status, cnType,
				destLocation, creditNoteHistoryDto, pageable);
	}

	@ApiPageable
	@PostMapping("/goods-return")
	@ApiOperation(value = "API to get goods return history", notes = "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type:</span>"
			+ "<ul>" + "	<li>GRN</li>" + "</ul><br>")
	public PagedRestResponse<List<GrnHistoryResponse>> getGoodsReturnHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "Sub transaction type", allowableValues = "CASH_MEMO", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType,
			@ApiParam(value = "Transaction type", allowableValues = "GRN", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(value = "cash memo Location") @RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = false) String cmLocation,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt goodReturnHistoryDto,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.getGoodsReturnService(searchField, searchType, subTxnType, txnType, cmLocation,
				goodReturnHistoryDto, pageable);

	}

	@ApiPageable
	@PostMapping("/goods-exchange")
	@ApiOperation(value = "API to get TEP and GEP history", notes = "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type:</span>"
			+ "<ul>" + "    <li>NEW_TEP</li>" + "    <li>MANUAL_TEP</li>" + "    <li>INTER_BRAND_TEP</li>"
			+ "    <li>FULL_VALUE_TEP</li>" + "    <li>CUT_PIECE_TEP</li>" + "    <li>NEW_GEP</li>"
			+ "    <li>MANUAL_GEP</li>" + "</ul><br>")
	public PagedRestResponse<List<GoodsExchangeDto>> getTepHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "GoodsReturn status", allowableValues = "APPROVAL_PENDING,CANCELLED,CLOSED,CONFIRMED,OPEN,HOLD,ALL") @RequestParam(required = false) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(value = "Sub transaction type", allowableValues = "NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP, NEW_GEP, MANUAL_GEP", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(value = "Transaction type", allowableValues = "TEP, GEP", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt goodReturnHistoryDto,
			@ApiIgnore Pageable pageable) {

		return saleHistoryService.getTepHistory(searchField, searchType, subTxnType, txnType, goodReturnHistoryDto,
				status, pageable);

	}

	@ApiPageable
	@PostMapping("/goods-exchange/cancel")
	@ApiOperation(value = "API to get GEP/TEP cancellation history", notes = "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type(Related to TEP/GEP):</span>"
			+ "<ul>" + "	<li>GEP</li>" + "	<li>TEP</li>" + "</ul><br>")
	public PagedRestResponse<List<BillCancellationHistoryDto>> getGoodsExchangeCancelHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "Sub transaction type", allowableValues = "GEP, TEP", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType,
			@ApiParam(value = "Transaction type", allowableValues = "GEPCAN, TEPCAN", required = true) @RequestParam(required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt cancelHistoryDto,
			@ApiParam(value = "reference TEP no.") @RequestParam(required = false) Integer refTepNo,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.getCancelGoodsExchangeHistoryService(searchField, searchType, subTxnType, txnType,
				cancelHistoryDto, refTepNo, pageable);
	}

	@ApiPageable
	@PostMapping("/invoice-list")
	@ApiOperation(value = "API to list orders", notes = "<span style=\"font-weight: bold;font-size:14px;\">API to list invoice list based on Transaction Type:</span>"
			+ "<ul>" + "	<li>CM</li>" + "	<li>AB</li>" + "	<li>ADV</li>" + "	<li>GC</li>"
			+ "	<li>GEP</li>" + "	<li>GRN</li>" + "	<li>TEP</li>" + "	<li>DEPOSIT</li>" + "	<li>GRF</li>"
			+ "</ul><br>")
	public PagedRestResponse<List<InvoiceDocumentsDetailsDto>> listOrders(
			@RequestParam @ApiParam(value = "provide Document Type", allowableValues = "CM, AB, ADV, GC, GEP, GRN, TEP, GRF", required = true) @ValueOfEnum(enumClass = SearchDocumentTypeEnum.class) String txnType,
			@RequestBody(required = false) @Validated CustomerDocumentsRequestDto customerDocuments,
			@ApiIgnore Pageable pageable) {
		return saleHistoryService.listInvoiceDocuments(txnType, customerDocuments, pageable);
	}
}
