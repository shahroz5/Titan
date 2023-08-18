/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.acl.InventoryAccessControls;
import com.titan.poss.inventory.dto.constants.ActionTypeEnum;
import com.titan.poss.inventory.dto.constants.StockInvoiceHistoryTypeEnum;
import com.titan.poss.inventory.dto.constants.StockRequestHistoryTypeEnum;
import com.titan.poss.inventory.dto.constants.StockTransactionHistoryTypeEnum;
import com.titan.poss.inventory.dto.constants.StockTransferTypeEnum;
import com.titan.poss.inventory.dto.request.HistoryInvoiceItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryInvoiceRequestDto;
import com.titan.poss.inventory.dto.request.HistoryIssueItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryIssueRequestDto;
import com.titan.poss.inventory.dto.request.HistoryRequestBinDto;
import com.titan.poss.inventory.dto.request.HistoryTransactionItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransactionRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransferItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransferRequestDto;
import com.titan.poss.inventory.dto.response.HistoryBinRequestDto;
import com.titan.poss.inventory.dto.response.HistoryInvoiceDto;
import com.titan.poss.inventory.dto.response.HistoryInvoiceItemDto;
import com.titan.poss.inventory.dto.response.HistoryIssueDto;
import com.titan.poss.inventory.dto.response.HistoryOtherReceiveStockDto;
import com.titan.poss.inventory.dto.response.HistoryReceiveStockDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;
import com.titan.poss.inventory.facade.HistoryFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@RestController
@Validated
@RequestMapping(value = "inventory/v2/history")
public class HistoryController {

	@Autowired
	HistoryFacade historyFacade;

	private static final String STOCK_RECEIVE_HISTORY_PERMISSION_OR_STOCK_ISSUE_HISTORY_PERMISSION = "hasPermission(#transferType,'BTQ_BTQ')"
			+ AND + START + InventoryAccessControls.RECEIVE_FROM_OTHER_BOUTIQUE_HISTORY + END + OR
			+ "hasPermission(#transferType,'BTQ_CFA')"
			+ AND + START + InventoryAccessControls.STOCK_ISSUE_CFA_HISTORY + END + OR
			+ "hasPermission(#transferType,'BTQ_BTQ')"+ AND +"hasPermission(#isLegacy,false)" + AND + START
			+ InventoryAccessControls.STOCK_ISSUE_OTHER_BOUTIQUE_HISTORY + END + OR
			+ "hasPermission(#transferType,'BTQ_BTQ')"+ AND +"hasPermission(#isLegacy,true)" + AND + START
			+ InventoryAccessControls.DIRECT_TRANSFER_HISTORY + END + OR
			+ "hasPermission(#transferType,'FAC_BTQ')" + AND + START
			+ InventoryAccessControls.RECEIVE_FROM_FACTORY_HISTORY + END + OR + "hasPermission(#transferType,'BTQ_FAC')"
			+ AND + START + InventoryAccessControls.STOCK_ISSUE_FACTORY_HISTORY + END + OR
			+ "hasPermission(#transferType,'TEP_PLAIN')" + AND + START + InventoryAccessControls.TEP_PLAIN_HISTORY + END
			+ OR + "hasPermission(#transferType,'TEP_GOLD_COIN')" + AND + START
			+ InventoryAccessControls.TEP_GOLD_COIN_HISTORY + END + OR + "hasPermission(#transferType,'DEFECTIVE')"
			+ AND + START + InventoryAccessControls.DEFECTIVE_HISTORY + END + OR
			+ "hasPermission(#transferType,'TEP_STUDDED')" + AND + START + InventoryAccessControls.TEP_STUDDED_HISTORY
			+ END + OR + "hasPermission(#transferType,'GEP')" + AND + START + InventoryAccessControls.GEP_HISTORY + END
			+ OR + "hasPermission(#transferType,'MER_BTQ')" + AND + START
			+ InventoryAccessControls.RECEIVE_FROM_MERCHANDISE_HISTORY + END;
//			+ InventoryAccessControls.TEP_GOLD_COIN_HISTORY + END + OR + "hasPermission(#transferType,'TEP_STUDDED')"
//			+ AND + START + InventoryAccessControls.TEP_STUDDED_HISTORY + END + OR
//			+ "hasPermission(#transferType,'GEP')" + AND + START + InventoryAccessControls.GEP_HISTORY + END + OR
//			+ "hasPermission(#transferType,'MER_BTQ')" + AND + START
//			+ InventoryAccessControls.RECEIVE_FROM_MERCHANDISE_HISTORY + END + OR
//	        +"hasPermission(#transferType,'BTQ_CFA')" + AND + START
//			+ InventoryAccessControls.STOCK_ISSUE_CFA_HISTORY+ END;
	private static final String STOCK_REQUEST_HISTORY_PERMISSION = "hasPermission(#requestType,'CONV')" + AND + START
			+ InventoryAccessControls.CONVERSION_SENT_REQUEST_HISTORY + END + OR + "hasPermission(#requestType,'BTQ')"
			+ AND + START + InventoryAccessControls.IBT_REQUEST_HISTORY + END + OR + "hasPermission(#requestType,'ADJ')"
			+ AND + START + InventoryAccessControls.ADJ_SENT_REQUEST_HISTORY + END + OR
			+ "hasPermission(#requestType,'EXH')" + AND + START + InventoryAccessControls.EXH_SENT_REQUEST_HISTORY + END
			+ OR + "hasPermission(#requestType,'LOAN')" + AND + START
			+ InventoryAccessControls.LOAN_SENT_REQUEST_HISTORY + END + OR + "hasPermission(#requestType,'LOSS')" + AND
			+ START + InventoryAccessControls.LOSS_SENT_REQUEST_HISTORY + END + OR + "hasPermission(#requestType,'FOC')"
			+ AND + START + InventoryAccessControls.FOC_SENT_REQUEST_HISTORY + END + OR
			+ "hasPermission(#requestType,'PSV')" + AND + START + InventoryAccessControls.PSV_SENT_REQUEST_HISTORY + END
			+ OR + "hasPermission(#requestType,'BTQ')" + AND + START
			+ InventoryAccessControls.IBT_RECEIVE_REQUEST_HISTORY + END;
	private static final String OTHER_RECEIVE_HISTORY_PERMISSION_OR_OTHER_ISSUE_HISTORY_PERMISSION = "hasPermission(#transactionType,'BIN_TO_BIN')"
			+ AND + START + InventoryAccessControls.BIN_TO_BIN_HISTORY + END + OR
			+ "hasPermission(#transactionType,'EXH')" + AND + START
			+ InventoryAccessControls.OTHER_RECEIPT_EXHIBITION_HISTORY + END + OR
			+ "hasPermission(#transactionType,'EXH')" + AND + START
			+ InventoryAccessControls.OTHER_ISSUE_EXHIBITION_HISTORY + END + OR
			+ "hasPermission(#transactionType,'FOC')" + AND + START + InventoryAccessControls.OTHER_ISSUE_FOC_HISTORY
			+ END + OR + "hasPermission(#transactionType,'LOSS')" + AND + START
			+ InventoryAccessControls.OTHER_ISSUE_LOSS_HISTORY + END + OR + "hasPermission(#transactionType,'LOAN')"
			+ AND + START + InventoryAccessControls.OTHER_ISSUE_LOAN_HISTORY + END + OR
			+ "hasPermission(#transactionType,'LOAN')" + AND + START
			+ InventoryAccessControls.OTHER_RECEIPT_LOAN_HISTORY + END + OR + "hasPermission(#transactionType,'ADJ')"
			+ AND + START + InventoryAccessControls.OTHER_RECEIPT_ADJUSTMENTS_HISTORY + END + OR
			+ "hasPermission(#transactionType,'ADJ')" + AND + START
			+ InventoryAccessControls.OTHER_ISSUE_ADJUSTMENTS_HISTORY + END + OR
			+ "hasPermission(#transactionType,'PSV')" + AND + START + InventoryAccessControls.OTHER_RECEIPT_PSV_HISTORY
			+ END + OR + "hasPermission(#transactionType,'PSV')" + AND + START
			+ InventoryAccessControls.OTHER_ISSUE_PSV_HISTORY + END + OR + "hasPermission(#transactionType,'CONV')"
			+ AND + START + InventoryAccessControls.CONVERSION_HISTORY + END;

	private static final String STOCK_INVOICE_HISTORY = "hasPermission(#invoiceType,'BTQ_CFA')" + AND + START
			+ InventoryAccessControls.STOCK_ISSUE_CFA_HISTORY + END + OR + "hasPermission(#invoiceType,'CFA_BTQ')" + AND
			+ START + InventoryAccessControls.RECEIVE_FROM_CFA_HISTORY + END + OR
			+ "hasPermission(#invoiceType,'TEP_PLAIN')" + AND + START + InventoryAccessControls.TEP_PLAIN_HISTORY + END
			+ OR + "hasPermission(#invoiceType,'TEP_STUDDED')" + AND + START
			+ InventoryAccessControls.TEP_STUDDED_HISTORY + END + OR + "hasPermission(#invoiceType,'GEP')" + AND + START
			+ InventoryAccessControls.GEP_HISTORY + END + OR + "hasPermission(#invoiceType,'TEP_GOLD_COIN')" + AND + START
			+ InventoryAccessControls.TEP_GOLD_COIN_HISTORY + END;

	private static final String BIN_CREATION_REQUEST_PERMISSION = START
			+ InventoryAccessControls.BIN_CREATION_REQUEST_HISTORY + END;

	// @formatter:off
	@PreAuthorize(STOCK_RECEIVE_HISTORY_PERMISSION_OR_STOCK_ISSUE_HISTORY_PERMISSION)
	@ApiOperation(value = "Stock transfer history for particular transfer type", notes = "This API works for list of stock transfer for particular stock "
			+ " transfer type **i.e FAC_BTQ, BTQ_FAC, BTQ_BTQ, MER_BTQ, TEP_PLAIN, TEP_STUDDED, GEP, DEFECTIVE.**"
			+ " Based on status **ISSUED, RECEIVED, CANCELLED, PUBLISHED** data will be filtered. By default data will be available for **TODAY** only."
			+ " But **LAST_WEEK, LAST_MONTH, LAST_YEAR, CUSTOM** search is available too. For **CUSTOM** search, **startDate & endDate**"
			+ " are mandatory. Based on particular location code,"
			+ " srcDocNo,destDocNo,destFiscalYear & srcFiscalYear search is available also. **status** should be optional. By default **ISSUED(for IBT), RECEIVED, CANCELLED**"
			+ " data will come. Multiple status search is also available. Here actionType should be **ISSUE,RECEIVE**. By default actionType will be **ISSUE**."
			+ " If UI does not filter then provide **null** and if statuses is not provided then it should be **empty**.<br>"
			+ " Please pass only date component in <b>start date</b> & <b>end date</b>.")
	// @formatter:on
	@ApiPageable
	@PostMapping("transfer")
	public PagedRestResponse<List<HistoryReceiveStockDto>> listStockTransfer(
//			@RequestParam @ApiParam(value = "Stock Issue History Or Stock Receive History Type", required = true, allowableValues = "FAC_BTQ, BTQ_FAC, BTQ_BTQ, MER_BTQ, TEP_PLAIN, TEP_STUDDED, GEP ,TEP_GOLD_COIN, DEFECTIVE") @ValueOfEnum(enumClass = StockTransferTypeEnum.class) String transferType,
			@RequestParam @ApiParam(value = "Stock Issue History Or Stock Receive History Type", required = true, allowableValues = "BTQ_CFA,FAC_BTQ, BTQ_FAC, BTQ_BTQ, MER_BTQ, TEP_PLAIN, TEP_STUDDED, GEP ,TEP_GOLD_COIN") @ValueOfEnum(enumClass = StockTransferTypeEnum.class) String transferType,
			@RequestParam(name = "isLegacy", required = false) Boolean isLegacy,
			@RequestBody @Valid HistoryTransferRequestDto historyTransferRequestDto, @ApiIgnore Pageable pageable) {
		return historyFacade.listStockTransfer(transferType, historyTransferRequestDto, pageable,isLegacy);
	}

	@PreAuthorize(STOCK_RECEIVE_HISTORY_PERMISSION_OR_STOCK_ISSUE_HISTORY_PERMISSION)
	@ApiOperation(value = " Get the Stock Transfer by id", notes = "This API returns a Stock Transfer identified by id")
	@GetMapping(value = "transfer/{id}")
	public HistoryReceiveStockDto getStockTransfer(@PathVariable Integer id,
			@RequestParam @ApiParam(value = "Stock Issue History Or Stock Receive History Type", required = true, allowableValues = "FAC_BTQ, BTQ_FAC, BTQ_BTQ, MER_BTQ, TEP_PLAIN, TEP_STUDDED, GEP") @ValueOfEnum(enumClass = StockTransferTypeEnum.class) String transferType,
			@RequestParam @ApiParam(value = "Action Type", allowableValues = "ISSUE, RECEIVE", required = true) @ValueOfEnum(enumClass = ActionTypeEnum.class) String actionType) {
		return historyFacade.getStockTransfer(id, transferType, actionType);

	}

	@PreAuthorize(STOCK_RECEIVE_HISTORY_PERMISSION_OR_STOCK_ISSUE_HISTORY_PERMISSION)
	@ApiOperation(value = "List Stock transfer Items in the stockTransfer", notes = "API works for stock transfer types i.e **FAC_BTQ, BTQ_FAC, BTQ_BTQ, MER_BTQ, TEP_PLAIN, TEP_STUDDED, GEP**"
			+ "</br>This API also allows to filter the searched result on respective of available params. Based on **itemCode**, list of **productGroup**, list of **productCategory**,"
			+ " **lotNumber**,list of **binCode**,**binGroupCode**,list of **status**. Here **id,historyType & transferType** is manadatory."
			+ " Here sorting parameters are **issued_quantity,issued_weight,received_quantity,received_weight**. ")
	@ApiPageable
	@PostMapping(value = "transfer/{id}/items")
	public PagedRestResponse<List<ReceiveStockItemDto>> listStockTransferItems(@PathVariable Integer id,
			@RequestParam @ApiParam(value = "Action Type", allowableValues = "ISSUE, RECEIVE", required = true) @ValueOfEnum(enumClass = ActionTypeEnum.class) String actionType,
			@RequestParam @ApiParam(value = "Stock Issue History Or Stock Receive History Type", required = true, allowableValues = "FAC_BTQ, BTQ_FAC, BTQ_BTQ, MER_BTQ, TEP_PLAIN, TEP_STUDDED, GEP") @ValueOfEnum(enumClass = StockTransferTypeEnum.class) String transferType,
			@RequestBody @Valid HistoryTransferItemRequestDto historyTransferItemRequestDto,
			@ApiIgnore Pageable pageable) {
		return historyFacade.listStockTransferItems(id, historyTransferItemRequestDto, pageable, actionType,
				transferType);
	}

	// @formatter:off
	@PreAuthorize(STOCK_REQUEST_HISTORY_PERMISSION)
	@ApiOperation(value = "Stock Request history for particular request type", notes = "This API works for list of stock request for particular stock "
			+ " request type **i.e ADJ, BTQ, CONV, EXH, FAC, FOC, LOAN, LOSS, MER, PSV.**"
			+ " By default data will be available for **TODAY** only."
			+ " But **LAST_WEEK, LAST_MONTH, LAST_YEAR, CUSTOM** search is available too. For **CUSTOM** search, **startDate & endDate**"
			+ " are mandatory. Based on particular location code,"
			+ " srcDocNo & reqFiscalYear search is available also. **status** should be optional. By default **ISSUED, ACPT_REJECTED, APVL_REJECTED, ISSUE_REJECTED, CANCELLED**"
			+ " data will come.Multiple status search is also available.If UI does not filter then provide **null** and if statuses is not provided then it should be **empty**.<br>"
			+ " Please pass only date component in <b>start date</b> & <b>end date</b>.")
	// @formatter:on
	@ApiPageable
	@PostMapping("request")
	public PagedRestResponse<List<HistoryIssueDto>> listStockRequest(
			@RequestParam @ApiParam(value = "Stock Request History Type", required = true, allowableValues = "ADJ, BTQ, CONV, EXH, FAC, FOC, LOAN, LOSS, MER, PSV") @ValueOfEnum(enumClass = StockRequestHistoryTypeEnum.class) String requestType,
			@RequestBody @Valid HistoryIssueRequestDto historyIssueRequestDto, @ApiIgnore Pageable pageable) {
		return historyFacade.listStockRequest(requestType, historyIssueRequestDto, pageable);
	}

	@PreAuthorize(STOCK_REQUEST_HISTORY_PERMISSION)
	@ApiOperation(value = " Get the Stock Request by id", notes = "This API returns a Stock Issue identified by id")
	@GetMapping(value = "request/{id}")
	public HistoryIssueDto getStockRequest(@PathVariable Integer id,
			@RequestParam @ApiParam(value = "Stock Request History Type", required = true, allowableValues = "ADJ, BTQ, CONV, EXH, FAC, FOC, LOAN, LOSS, MER, PSV") @ValueOfEnum(enumClass = StockRequestHistoryTypeEnum.class) String requestType,
			@RequestParam @ApiParam(value = "Action Type", allowableValues = "ISSUE, RECEIVE", required = true) @ValueOfEnum(enumClass = ActionTypeEnum.class) String actionType) {
		return historyFacade.getStockRequest(id, requestType, actionType);

	}

	@PreAuthorize(STOCK_REQUEST_HISTORY_PERMISSION)
	@ApiOperation(value = "List Stock Issue Items in the stockIssue", notes = "API works for stock issue types i.e **ADJ, BTQ, CONV, EXH, FAC, FOC, LOAN, LOSS, MER, PSV**"
			+ "</br>This API also allows to filter the searched result on respective of available params. Based on **itemCode**, list of **productGroup**, list of **productCategory**,"
			+ " **lotNumber**,list of **binCode**,**binGroupCode**. Here **id,requestType & status** is manadatory.")
	@ApiPageable
	@PostMapping(value = "request/{id}/items")
	public PagedRestResponse<List<RequestStockItemResponseDto>> listStockIssueItems(@PathVariable Integer id,
			@RequestParam @ApiParam(value = "Stock Request History Type", required = true, allowableValues = "ADJ, BTQ, CONV, EXH, FAC, FOC, LOAN, LOSS, MER, PSV") @ValueOfEnum(enumClass = StockRequestHistoryTypeEnum.class) String requestType,
			@RequestBody @Valid HistoryIssueItemRequestDto historyIssueItemRequestDto,
			@RequestParam @ApiParam(value = "Action Type", allowableValues = "ISSUE, RECEIVE", required = true) @ValueOfEnum(enumClass = ActionTypeEnum.class) String actionType,
			@ApiIgnore Pageable pageable) {
		return historyFacade.listStockIssueItems(id, requestType, historyIssueItemRequestDto, actionType, pageable);
	}

	// @formatter:off
	@PreAuthorize(STOCK_INVOICE_HISTORY)
	@ApiOperation(value = "Return Invoice/Purchase Invoice history for particular invoice type", notes = "This API works for list of stock invoice for particular stock "
			+ " invoice type **i.e BTQ_CFA, CFA_BTQ, GEP, TEP_PLAIN, TEP_STUDDED,TEP_GOLD_COIN.**"
			+ " By default data will be available for **TODAY** only."
			+ " But **LAST_WEEK, LAST_MONTH, LAST_YEAR, CUSTOM** search is available too. For **CUSTOM** search, **startDate & endDate**"
			+ " are mandatory. Based on particular location code,"
			+ " srcDocNo, destDocNo, srcFiscalYear & destFiscalYear search is available also. **status** should be optional. By default **ISSUED, RECEIVED**"
			+ " data will come.Here actionType should be **ISSUE,RECEIVE**. By default actionType will be **ISSUE**.If UI does not filter then provide **null** and "
			+ "	if statuses is not provided then it should be **empty**.<br>"
			+ " Please pass only date component in <b>start date</b> & <b>end date</b>.")
	// @formatter:on
	@ApiPageable
	@PostMapping("invoice")
	public PagedRestResponse<List<HistoryInvoiceDto>> listStockInvoice(
			@RequestParam @ApiParam(value = "Stock Invoice History Type", required = true, allowableValues = "BTQ_CFA, CFA_BTQ, GEP, TEP_PLAIN, TEP_STUDDED,TEP_GOLD_COIN") @ValueOfEnum(enumClass = StockInvoiceHistoryTypeEnum.class) String invoiceType,
			@RequestBody @Valid HistoryInvoiceRequestDto historyInvoiceRequestDto, @ApiIgnore Pageable pageable) {
		return historyFacade.listStockInvoice(invoiceType, historyInvoiceRequestDto, pageable);
	}

	@PreAuthorize(STOCK_INVOICE_HISTORY)
	@ApiOperation(value = " Get the Stock Invoice by id", notes = "This API returns a Stock Invoice identified by id")
	@GetMapping(value = "invoice/{id}")
	public HistoryInvoiceDto getStockInvoice(@PathVariable Integer id,
			@RequestParam @ApiParam(value = "Stock Invoice History Type", required = true, allowableValues = "BTQ_CFA, CFA_BTQ, GEP, TEP_PLAIN, TEP_STUDDED,TEP_GOLD_COIN,DEFECTIVE") @ValueOfEnum(enumClass = StockInvoiceHistoryTypeEnum.class) String invoiceType,
			@RequestParam @ApiParam(value = "Action Type", allowableValues = "ISSUE, RECEIVE", required = true) @ValueOfEnum(enumClass = ActionTypeEnum.class) String actionType) {
		return historyFacade.getStockInvoice(id, invoiceType, actionType);

	}

	@PreAuthorize(STOCK_INVOICE_HISTORY)
	@ApiOperation(value = "List of Stock Invoice(Purchase Invoice/Return Invoice) items", notes = "API works for stock invoice types i.e **BTQ_CFA, CFA_BTQ, GEP, TEP_PLAIN, TEP_STUDDED,TEP_GOLD_COIN**"
			+ "</br>This API also allows to filter the searched result on respective of available params. Based on **itemCode**, list of **productGroup**, list of **productCategory**,"
			+ " **lotNumber**,list of **binCode**,**binGroupCode**. Here **id & status** is manadatory.")
	@ApiPageable
	@PostMapping(value = "invoice/{id}/items")
	public PagedRestResponse<List<HistoryInvoiceItemDto>> listStockInvoiceItems(@PathVariable Integer id,
			@RequestParam @ApiParam(value = "Stock Invoice History Type", required = true, allowableValues = "BTQ_CFA, CFA_BTQ, GEP, TEP_PLAIN, TEP_STUDDED, TEP_GOLD_COIN") @ValueOfEnum(enumClass = StockInvoiceHistoryTypeEnum.class) String invoiceType,
			@RequestBody @Valid HistoryInvoiceItemRequestDto historyInvoiceItemRequestDto,
			@RequestParam @ApiParam(value = "Action Type", allowableValues = "ISSUE, RECEIVE", required = true) @ValueOfEnum(enumClass = ActionTypeEnum.class) String actionType,
			@ApiIgnore Pageable pageable) {
		return historyFacade.listStockInvoiceItems(id, invoiceType, historyInvoiceItemRequestDto, actionType, pageable);
	}

	// @formatter:off
	@PreAuthorize(OTHER_RECEIVE_HISTORY_PERMISSION_OR_OTHER_ISSUE_HISTORY_PERMISSION)
	@ApiOperation(value = "Stock Transaction history for particular transaction type", notes = "This API works for list of stock transaction for particular stock "
			+ " transaction type **i.e ADJ, FOC, EXH, LOAN, BIN_TO_BIN, PSV, LOSS, CONV.**"
			+ " By default data will be available for **TODAY** only."
			+ " But **LAST_WEEK, LAST_MONTH, LAST_YEAR, CUSTOM** search is available too. For **CUSTOM** search, **startDate & endDate**"
			+ " are mandatory. Based on particular location code & "
			+ " srcDocNo,issueDocNo,issueFiscalYear,receiveDocNo & receiveFiscalYear search is available also. **status** should be optional. By default **RECEIVED, ISSUED, COMPLETED**"
			+ " data will come.Multiple status search is also available.Here actionType should be **ISSUE,RECEIVE**. By default actionType will be **ISSUE**."
			+ " If UI does not filter then provide **null** and if statuses is not provided then it should be **empty**. For **conversion** "
			+ " status should be **RECEIVE**.<br>"
			+ " Please pass only date component in <b>start date</b> & <b>end date</b>.")
	// @formatter:on
	@ApiPageable
	@PostMapping("transaction")
	public PagedRestResponse<List<HistoryOtherReceiveStockDto>> listStockTransaction(
			@RequestParam @ApiParam(value = "Stock Transaction History Type", required = true, allowableValues = "ADJ, FOC, EXH, LOAN, BIN_TO_BIN, PSV, LOSS, CONV") @ValueOfEnum(enumClass = StockTransactionHistoryTypeEnum.class) String transactionType,
			@RequestBody @Valid HistoryTransactionRequestDto historyTransactionRequestDto,
			@ApiIgnore Pageable pageable) {
		return historyFacade.listStockTransaction(transactionType, historyTransactionRequestDto, pageable);
	}

	@PreAuthorize(OTHER_RECEIVE_HISTORY_PERMISSION_OR_OTHER_ISSUE_HISTORY_PERMISSION)
	@ApiOperation(value = " Get the Stock Transaction by id", notes = "This API returns a Stock Transaction identified by id")
	@GetMapping(value = "transaction/{id}")
	public HistoryOtherReceiveStockDto getStockTransaction(@PathVariable Integer id,
			@RequestParam @ApiParam(value = "Stock Transaction History Type", required = true, allowableValues = "ADJ, FOC, EXH, LOAN, BIN_TO_BIN, PSV, LOSS, CONV") @ValueOfEnum(enumClass = StockTransactionHistoryTypeEnum.class) String transactionType) {
		return historyFacade.getStockTransaction(id, transactionType);

	}

	@PreAuthorize(OTHER_RECEIVE_HISTORY_PERMISSION_OR_OTHER_ISSUE_HISTORY_PERMISSION)
	@ApiOperation(value = "List of Stock Transaction Items", notes = "API works for stock transaction types i.e **ADJ, FOC, EXH, LOAN, BIN_TO_BIN, PSV, LOSS, CONV**"
			+ "</br>This API also allows to filter the searched result on respective of available params. Based on **itemCode**, list of **productGroup**, list of **productCategory**,"
			+ " **lotNumber**,list of **binCode**,**binGroupCode**. Here **id,transactionType & status** is manadatory."
			+ " Here sorting parameters are **issued_quantity,issued_weight,received_quantity,received_weight**.")
	@ApiPageable
	@PostMapping(value = "transaction/{id}/items")
	public PagedRestResponse<List<OtherReceiveStockItemDto>> listStockTransactionItems(@PathVariable Integer id,
			@RequestParam @ApiParam(value = "Stock Transaction History Type", required = true, allowableValues = "ADJ, FOC, EXH, LOAN, BIN_TO_BIN, PSV, LOSS, CONV") @ValueOfEnum(enumClass = StockTransactionHistoryTypeEnum.class) String transactionType,
			@RequestBody @Valid HistoryTransactionItemRequestDto historyTransactionItemRequestDto,
			@ApiIgnore Pageable pageable) {
		return historyFacade.listStockTransactionItems(id, transactionType, historyTransactionItemRequestDto, pageable);
	}

	// @formatter:off
	@PreAuthorize(BIN_CREATION_REQUEST_PERMISSION)
	@ApiOperation(value = "List of bin request.", notes = "This API works for listing bin request. By default **TODAY** data will be available. "
			+ " But **LAST_WEEK, LAST_MONTH, LAST_YEAR, CUSTOM** search is available too. For **CUSTOM** search, **start date** and **end date** "
			+ " will be mandatory.</br> Based on **bin name,bin group code,fiscal year,doc no**,list of **status**, filter is available.<br>"
			+ " Please pass only date component in <b>start date</b> & <b>end date</b>.")
	// @formatter:on
	@ApiPageable
	@PostMapping(value = "bin-request")
	public PagedRestResponse<List<HistoryBinRequestDto>> listBinRequest(
			@RequestBody @Valid HistoryRequestBinDto historyRequestBinDto, @ApiIgnore Pageable pageable) {
		return historyFacade.listBinRequest(historyRequestBinDto, pageable);
	}

}
