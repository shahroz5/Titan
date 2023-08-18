/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.acl.InventoryAccessControls;
import com.titan.poss.inventory.dto.ReceivedWeightDto;
import com.titan.poss.inventory.dto.constants.PurchaseInvoiceStatus;
import com.titan.poss.inventory.dto.constants.PurchaseInvoiceType;
import com.titan.poss.inventory.dto.constants.StockReceiveStatusEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveTypeEnum;
import com.titan.poss.inventory.dto.request.PurchaseInvoiceConfirmDto;
import com.titan.poss.inventory.dto.request.PurchaseInvoiceItemUpdateDto;
import com.titan.poss.inventory.dto.request.PurchaseStockItemBulkDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.PurchaseInvoiceDto;
import com.titan.poss.inventory.dto.response.PurchaseInvoiceItemDto;
import com.titan.poss.inventory.facade.PurchaseInvoiceFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController
@RequestMapping(value = "inventory/v2/purchase-invoices")
public class PurchaseInvoiceController {

	private static final String PURCHASE_INVOICE_PERMISSION = "hasPermission(#invoiceType,'CFA_BTQ') AND hasPermission(true,'"
			+ InventoryAccessControls.RECEIVE_INVOICE_FROM_CFA + "' )";

	@Autowired
	PurchaseInvoiceFacade purchaseInvoiceFacade;

	/**
	 * Return list of values with count of InvoiceType where document status is
	 * ISSUED
	 * 
	 * @return - List of Invoice Purchase Count
	 */
	@ApiOperation(value = "Lists count of purchase invoice", notes = "This api returns list of purchase invoice count where "
			+ " document status is **ISSUED** and invoice type is **CFA_BTQ**")
	@GetMapping(value = "/counts")
	@PreAuthorize("hasPermission(true,'" + InventoryAccessControls.RECEIVE_INVOICE_FROM_CFA + "' )")
	public ListResponse<InventoryCountDto> getPurchaseInvoiceCount() {
		return purchaseInvoiceFacade.getPurchaseInvoiceCount(PurchaseInvoiceType.CFA_BTQ.toString(),
				PurchaseInvoiceStatus.ISSUED.toString());
	}

	/**
	 * Returns list of Invoice with matching request param (srcDocNo, invoicetype)
	 * values, where document status is ISSUED
	 * 
	 * @param srcdocno    - srcDocNo of Invoice
	 * @param invoicetype - invoiceReturnType of Invoice
	 * @param pageable    - Pageable support with page, size, sort values as request
	 *                    params
	 * @return - List of Invoice
	 */
	@ApiOperation(value = "Lists purchase invoices", notes = "This api is to get the pageable list of invoice where document status is **ISSUED**. "
			+ "<br>**invoiceType** value can be **CFA_BTQ**" + "<br>Multiple search parameters are allowed")
	@ApiPageable
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	@GetMapping(value = "")
	public PagedRestResponse<List<PurchaseInvoiceDto>> listPurchaseInvoices(
			@RequestParam(required = false) Integer srcDocNo,
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType,
			@ApiIgnore Pageable pageable) {
		return purchaseInvoiceFacade.listPurchaseInvoices(srcDocNo, invoiceType, pageable,
				PurchaseInvoiceStatus.ISSUED.toString());
	}

	/**
	 * Returns get of Invoice with id(id) values, where document status is ISSUED
	 * 
	 * @param id - invoiceId of Invoice params
	 * @return - List of Invoice
	 */
	@ApiOperation(value = "Fetch the invoice where document status is ISSUED", notes = "This api is to fetchs the invoice where document status is **ISSUED**."
			+ "<br>**invoiceType** value can be **CFA_BTQ**")
	@ApiPageable
	@GetMapping(value = "/{id}")
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	public PurchaseInvoiceDto getPurchaseInvoice(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType) {
		return purchaseInvoiceFacade.getPurchaseInvoiceById(id, invoiceType, PurchaseInvoiceStatus.ISSUED.toString());
	}

	/**
	 * Returns get of Invoice Item with id(id) values, where document
	 * 
	 * @param id - invoiceId of Invoice params
	 * @return - particular invoice item
	 */
	@ApiOperation(value = "Fetches item detail based on invoice id.", notes = "This api is to fetch the item detail based on **invoice id** where document status is **ISSUED**"
			+ "<br>**invoiceType** value can be **CFA_BTQ**")
	@ApiPageable
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	@GetMapping(value = "/{id}/items/{itemId}")
	public PurchaseInvoiceItemDto getPurchaseInvoiceItem(@PathVariable Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemId,
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType) {
		return purchaseInvoiceFacade.getPurchaseInvoiceItemById(id, itemId, invoiceType);
	}

	/**
	 * Returns the items in a given id of Invoice
	 * 
	 * @param id       - invoiceId of Invoice
	 * @param pageable - Pageable support with page, size, sort values as request
	 *                 params
	 * @return - List of InvoiceDetail
	 */
	@ApiOperation(value = "Fetches all items based on invoice id.", notes = "This api is to fetch all the pageable item details based on **invoice id**."
			+ "<br>Status can be **ISSUED, VERIFIED, RECEIVED** " + "<br>**invoiceType** value can be **CFA_BTQ**"
			+ "<br>Multiple search parameters are allowed" + "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"PurchaseInvoice (Invoice) (CFA_BTQ)  \":</br>" + "\t\"issuedQuantity,DESC\",</br>"
			+ "\t\"issuedQuantity,ASC\",</br>" + "\t\"issuedWeight,ASC\",</br>" + "\t\"issuedWeight,DESC\",</br></pre>")
	@ApiPageable
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	@GetMapping(value = "/{id}/items")
	public PagedRestResponse<List<PurchaseInvoiceItemDto>> listPurchaseInvoiceItems(@PathVariable Integer id,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @ApiParam(required = false, value = "Purchase invoice status", allowableValues = "ISSUED, VERIFIED, RECEIVED") @ValueOfEnum(enumClass = PurchaseInvoiceStatus.class) String status,
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@ApiIgnore Pageable pageable) {
		return purchaseInvoiceFacade.listPurchaseInvoiceItems(id, itemCode, lotNumber, binGroupCode,
				status != null ? status : null, invoiceType, binCode, productGroup, productCategory, pageable);
	}
	
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	@GetMapping(value = "/{id}/weight")
	public ReceivedWeightDto getTotalReceivedWeight(@PathVariable Integer id,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @ApiParam(required = false, value = "Purchase invoice status", allowableValues = "ISSUED, VERIFIED, RECEIVED") @ValueOfEnum(enumClass = PurchaseInvoiceStatus.class) String status,
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@ApiIgnore Pageable pageable) {
		
		return purchaseInvoiceFacade.getTotalReceivedWeight(id, itemCode, lotNumber, binGroupCode,
				status != null ? status : null, invoiceType, binCode, productGroup, productCategory);
		
	}

	/**
	 * Verifies the Invoice Item
	 * 
	 * @param id                   - invoiceId of Invoice
	 * @param itemid               - id of InvoiceDetail
	 * @param InvoiceItemVerifyDto - Details of the Item to verify
	 * @return - Updated InvoiceDetail item
	 */
	@ApiOperation(value = "Verifies single item details", notes = "This api is to verify single item. Once item is verified then status is changed from **ISSUED** to **VERIFIED**. "
			+ "<br>**invoiceType** value can be **CFA_BTQ**")
	@PatchMapping(value = "/{id}/items/{itemId}")
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	public PurchaseInvoiceItemDto updatePurchaseInvoiceItem(@PathVariable Integer id,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType,
			@RequestBody @Valid PurchaseInvoiceItemUpdateDto invoiceItemVerifyDto) {

		return purchaseInvoiceFacade.updatePurchaseInvoiceItem(id, itemId, invoiceType, invoiceItemVerifyDto);
	}

	@ApiOperation(value = "Updates item details against invoice id.", notes = "This api is to update all the items against invoice id."
			+ "<br>status can be **ISSUED**() & **VERIFIED**." + "<br>**invoiceType** value can be **CFA_BTQ**")
	@PatchMapping(value = "/{id}/items")
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	public void updateAllPurchaseInvoiceItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType,
			@RequestBody @Valid PurchaseStockItemBulkDto receiveStockItemBulkDto) {
		purchaseInvoiceFacade.updateAllPurchaseInvoiceItems(id, invoiceType, receiveStockItemBulkDto);
	}

	/**
	 * Confirms the status of Invoice
	 * 
	 * @param id                - invoiceid of Invoice
	 * @param InvoiceConfirmDto - Details to confirm Invoice
	 * @return - Updated Invoice values
	 */
	@ApiOperation(value = "Confirms invoice status", notes = "This api is for confirming invoice status and the status will be **RECEIVED**"
			+ "<br>**invoiceType** value can be **CFA_BTQ**")
	@PatchMapping(value = "/{id}")
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	public PurchaseInvoiceDto updatePurchaseInvoice(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType,
			@RequestBody @Valid PurchaseInvoiceConfirmDto invoiceConfirmDto, BindingResult bindingResult) {

		return purchaseInvoiceFacade.updatePurchaseInvoice(id, invoiceType, invoiceConfirmDto);

	}

	@ApiOperation(value = "This method will get invoice details from Erp", notes = "This method will get invoice details from Erp for the invoice number"
			+ "<br>**Invoice number** has to be 5 capital alphabets followed by minimum 5 digits. Eg: ABCSI20211")
	@GetMapping(value = "/inv")
	@ApiPageable
	@PreAuthorize(PURCHASE_INVOICE_PERMISSION)
	public PagedRestResponse<List<PurchaseInvoiceDto>> listPurchaseInvoiceItems(
			@RequestParam(required = true) @ApiParam(required = true, value = "Purchase invoice type", allowableValues = "CFA_BTQ") @ValueOfEnum(enumClass = PurchaseInvoiceType.class) String invoiceType,
			@RequestParam(name = "invNo", required = true) @Pattern(regexp = RegExConstants.ERP_INVOICE_NUMBER_REGEX, message = "Invalid Invoice Number") String invNo) {
		return purchaseInvoiceFacade.getInvoiceFromErp(invNo, invoiceType);
	}
}
