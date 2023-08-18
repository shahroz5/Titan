
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.inventory.acl.InventoryAccessControls.COIN;
import static com.titan.poss.inventory.acl.InventoryAccessControls.GEP;
import static com.titan.poss.inventory.acl.InventoryAccessControls.ISSUE_TO_CFA;
import static com.titan.poss.inventory.acl.InventoryAccessControls.TEP_FOR_PLAIN;
import static com.titan.poss.inventory.acl.InventoryAccessControls.TEP_FOR_STUDDED;
import static com.titan.poss.inventory.acl.InventoryAccessControls.TEP_FOR_GOLD_COIN;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceStatus;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceType;
import com.titan.poss.inventory.dto.request.RemoveStockItemsDto;
import com.titan.poss.inventory.dto.request.ReturnInvoiceConFirmDto;
import com.titan.poss.inventory.dto.request.ReturnInvoiceCreateItemsDto;
import com.titan.poss.inventory.dto.response.ReturnInvoiceDto;
import com.titan.poss.inventory.dto.response.ReturnInvoiceItemDto;
import com.titan.poss.inventory.facade.ReturnInvoiceFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "inventory/v2/return-invoices")
public class ReturnInvoiceController {

	@Autowired
	ReturnInvoiceFacade returnInvoiceFacade;

	// @formatter:off
	private static final String RETURN_INVOICE_PERMISSION = "hasPermission(#invoiceType,'BTQ_CFA') " + AND + START
			+ ISSUE_TO_CFA + END + OR + "hasPermission(#invoiceType,'TEP_PLAIN') " + AND + START + TEP_FOR_PLAIN + END
			+ OR + "hasPermission(#invoiceType,'TEP_STUDDED') " + AND + START + TEP_FOR_STUDDED + END + OR
			+ "hasPermission(#invoiceType,'GEP') " + AND + START + GEP + END + OR
			+ "hasPermission(#invoiceType,'COINS') " + AND + START + COIN + END + OR
			+ "hasPermission(#invoiceType,'TEP_GOLD_COIN') " + AND + START + TEP_FOR_GOLD_COIN + END;
	// @formatter:on

	/**
	 * Returns get of Invoice with id(id) values, where document status is OPEN
	 * 
	 * @param id - invoiceId of Invoice params
	 * @return - List of Invoice
	 */
	@ApiOperation(value = "Fetch invoice document where status is OPEN", notes = "This api is to fetch the invoice where document status is **OPEN**."
			+ "<br> invoice type can be **BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COINS**")
	@GetMapping(value = "/{id}")
	@PreAuthorize(RETURN_INVOICE_PERMISSION)
	public ReturnInvoiceDto getReturnInvoice(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Return invoice type", allowableValues = "BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COIN, TEP_GOLD_COIN") @ValueOfEnum(enumClass = ReturnInvoiceType.class) String invoiceType) {
		return returnInvoiceFacade.getReturnInvoiceById(id, invoiceType, ReturnInvoiceStatus.OPEN.toString());
	}
	
	/**
	 * Returns of stock invoice header level with id
	 * 
	 * @param id - invoiceId of Invoice params
	 * @return - List of Invoice
	 */
	@ApiOperation(value = "Fetch invoice document header", notes = "This api is to fetch the invoice header level"
			+ "<br> invoice type can be **BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COINS**")
	@GetMapping(value = "/{id}/detail")
	@PreAuthorize(RETURN_INVOICE_PERMISSION)
	public ReturnInvoiceDto getReturnInvoiceDetail(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Return invoice type", allowableValues = "BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COIN, TEP_GOLD_COIN") @ValueOfEnum(enumClass = ReturnInvoiceType.class) String invoiceType) {
		return returnInvoiceFacade.getReturnInvoiceDetail(id, invoiceType,ReturnInvoiceStatus.SELECTED.toString());
	}

	/**
	 * Returns the items in a given id of Invoice
	 * 
	 * @param id       - invoiceId of Invoice
	 * @param pageable - Pageable support with page, size, sort values as request
	 *                 params
	 * @return - List of InvoiceDetail
	 */
	@PreAuthorize(RETURN_INVOICE_PERMISSION)
	@ApiOperation(value = "Fetch all items based on invoice id.", notes = "This api is to fetch all the pageable item details based on **invoice id**. "
			+ "</br>Status Can be SELECTED(It is selected for returns) and OPEN(Default, to unselect change to OPEN)"
			+ "</br> invoice type can be **BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COINS**"
			+ "<pre> SortParameters: </pre> "

			+ "<pre> </br> </br>\"ReturnInvoice (Invoice) (TEP,GEP,COINS,BTQ_CFA) \":</br>"
			+ "\t\"availableQuantity,ASC\",</br>" + "\t\"availableQuantity,DESC\",</br>"
			+ "\t\"availableWeight,ASC\",</br>" + "\t\"availableWeight,DESC\",</br>"
			+ "\t\"inwardDate,ASC\",</br>" + "\t\"inwardDate,DESC\",</br></pre>")
	@ApiPageable
	@GetMapping(value = "/{id}/items")
	public PagedRestResponse<List<ReturnInvoiceItemDto>> listReturnInvoiceItems(@PathVariable Integer id,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @ApiParam(required = false, value = "Return invoice status", allowableValues = "OPEN, SELECTED, ISSUED") @ValueOfEnum(enumClass = ReturnInvoiceStatus.class) String status,
			@RequestParam(required = true) @ApiParam(required = true, value = "Return invoice type", allowableValues = "BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COIN, TEP_GOLD_COIN") @ValueOfEnum(enumClass = ReturnInvoiceType.class) String invoiceType,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@ApiIgnore Pageable pageable) {
		return returnInvoiceFacade.listReturnInvoiceItems(id, itemCode, lotNumber, binCode, binGroupCode,
				status != null ? status : null, invoiceType, productGroup, productCategory, pageable);
	}

	/**
	 * Create the header level for Invoice Return
	 * 
	 * @return - Created Response
	 */
	@PreAuthorize(RETURN_INVOICE_PERMISSION)
	@ApiOperation(value = "Creates the header of return invoice", notes = "This api is to create the header of return invoice. or returns existing invoice which has **OPEN** status"
			+ "</br> Status is set to **OPEN** for created invoice"
			+ "</br> invoice type can be **BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COINS,TEP_GOLD_COIN**")
	@PostMapping(value = "")
	public ReturnInvoiceDto addReturnInvoice(@RequestParam(required = true) ReturnInvoiceType invoiceType) {
		return returnInvoiceFacade.addReturnInvoice(invoiceType.toString());
	}

	@PreAuthorize(RETURN_INVOICE_PERMISSION)
	@ApiOperation(value = "Updates return invoice for multiple items", notes = "This api is to create return invoice items for particular **invoice id** in **OPEN** status"
			+ "</br> invoice type can be **BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COINS**")
	@PostMapping(value = "/{id}/items")
	public void addReturnInvoiceItems(@PathVariable Integer id,
			@RequestBody @Valid ReturnInvoiceCreateItemsDto returnInvoiceItemDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Return invoice type", allowableValues = "BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COIN, TEP_GOLD_COIN") @ValueOfEnum(enumClass = ReturnInvoiceType.class) String invoiceType) {

		returnInvoiceFacade.addReturnInvoiceItems(id, invoiceType, returnInvoiceItemDto);
	}

	/**
	 * Delete a Invoice Item
	 * 
	 * @param id     - invoiceId of Invoice
	 * @param itemid - id of InvoiceDetail
	 * @return - remove InvoiceDetail item
	 */
	@PreAuthorize(RETURN_INVOICE_PERMISSION)
	@ApiOperation(value = "Delete items against invoice id", notes = "This api is to delete items against **invoice id**. "
			+ "</br> invoice type can be **BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COINS**"
			+ "</br>**Bulk Delete:**<ol><li>**All:**In case of All, itemIds will be [] empty</li><li>**Multi:**For multi update give all itemIds in list(Max **50** is allowed)</li></ol>")
	@PutMapping(value = "/{id}/items")
	public void removeReturnInvoiceItems(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Return invoice type", allowableValues = "BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COIN, TEP_GOLD_COIN") @ValueOfEnum(enumClass = ReturnInvoiceType.class) String invoiceType,
			@RequestBody @Valid RemoveStockItemsDto removeStockItemsDto) {

		returnInvoiceFacade.removeReturnInvoiceItems(id, removeStockItemsDto, invoiceType);
	}

	/**
	 * Confirms the status of Invoice Return
	 * 
	 * @param id                - invoiceid of Invoice
	 * @param InvoiceConfirmDto - Details to confirm Invoice
	 * @return - Updated Invoice values
	 */
	@PreAuthorize(RETURN_INVOICE_PERMISSION)
	@ApiOperation(value = "Confirms the status of return invoice", notes = "This api is to confirm the status against invoice id and the status will be **ISSUED**"
			+ "</br> invoice type can be **BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COINS**")
	@PatchMapping(value = "/{id}")
	public ReturnInvoiceDto updateReturnInvoice(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Return invoice type", allowableValues = "BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COIN, TEP_GOLD_COIN") @ValueOfEnum(enumClass = ReturnInvoiceType.class) String invoiceType,
			@RequestBody @Valid ReturnInvoiceConFirmDto invoiceConfirmDto) {

		return returnInvoiceFacade.updateReturnInvoice(id, invoiceConfirmDto, invoiceType);

	}
	
	/**
	 * Makes file_publish to 0
	 * 
	 * @param id                - invoiceid of Invoice
	 * @param InvoiceConfirmDto - Details to confirm Invoice
	 * @return - Updated Invoice values
	 */
	@PreAuthorize(RETURN_INVOICE_PERMISSION)
	@ApiOperation(value = "updates file publish", notes = "This api is to update the file publish against invoice id and the status will be **ISSUED**"
			)
	@PatchMapping(value = "filePublish/{id}")
	public ReturnInvoiceDto updateReturnInvoiceFilePublish(@PathVariable Integer id, @RequestParam(required = true) @ApiParam(required = true, value = "Return invoice type", allowableValues = "BTQ_CFA, TEP_PLAIN, TEP_STUDDED, GEP, COIN, TEP_GOLD_COIN") @ValueOfEnum(enumClass = ReturnInvoiceType.class) String invoiceType) {

		return returnInvoiceFacade.updateReturnInvoiceFilePublish(id);

	}

	@GetMapping("request/{id}/prints")
	public ResponseEntity<Resource> getRequestPDFImp(@PathVariable Integer id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Return invoice type", allowableValues = "BTQ_CFA, BTQ_CFA_GRN, TEP_PLAIN, TEP_STUDDED, GEP, COIN, TEP_GOLD_COIN") @ValueOfEnum(enumClass = ReturnInvoiceType.class) String invoiceType) {
		return returnInvoiceFacade.getStockReturnInvoicePDF(id, invoiceType);

	}

}
