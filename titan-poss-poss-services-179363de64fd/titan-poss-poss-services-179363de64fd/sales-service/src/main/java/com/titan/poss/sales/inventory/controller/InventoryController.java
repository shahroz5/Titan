/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.inventory.acl.InventoryAccessControls.BIN_TO_BIN_TRANSFER;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.SqlInjectionCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.constants.BinListEnum;
import com.titan.poss.inventory.dto.constants.InventorySearchCategoryEnum;
import com.titan.poss.inventory.dto.request.BinUpdateBulkDto;
import com.titan.poss.inventory.dto.request.InventoryBinUpdateDto;
import com.titan.poss.inventory.dto.request.InventoryStageBinUpdateDto;
import com.titan.poss.inventory.dto.request.StockTransactionAddItemDto;
import com.titan.poss.inventory.dto.request.StockTransactionConfirmDto;
import com.titan.poss.inventory.dto.request.StockTransactionUpdateDto;
import com.titan.poss.inventory.dto.request.StockTransactionUpdateItemDto;
import com.titan.poss.inventory.dto.response.BinToBinFileStageDto;
import com.titan.poss.inventory.dto.response.FileItemStageDto;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryBinToBinItemsDtoList;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.StockTransactionDocNoDto;
import com.titan.poss.inventory.dto.response.StockTransactionDto;
import com.titan.poss.inventory.dto.response.StockTransactionItemDto;
import com.titan.poss.sales.dto.constants.StockManagementEnum;
import com.titan.poss.sales.dto.constants.StockManagementStatusEnum;
import com.titan.poss.sales.dto.response.BaseTransactionDetailsDto;
import com.titan.poss.sales.dto.response.StockTransactionStatusCountDto;
import com.titan.poss.sales.inventory.facade.StockManagementFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@Validated
@RequestMapping(value = "sales/v2/inventory")
public class InventoryController {
	@Autowired
	private StockManagementFacade stockManagementFacade;

	private static final String BIN_TO_BIN_TRANSFER_PERMISSION = START + BIN_TO_BIN_TRANSFER + END;

	/**
	 * Returns list of BinCodes
	 * 
	 * @param binCode                    - binCode of InventoryDetail
	 * @param inventoryEnum(ALL,BIN_BIN) - to fetch according to business rules
	 * @param pageable                   - Pageable support with page, size, sort
	 *                                   values as request params
	 * @return - List of binCodes group by binCode
	 */

	// moved to sales
	@ApiOperation(value = "Lists Group of BinCodes", notes = "Lists group of bincodes along with **Total weight, Total quantity and Total value**"
			+ "<br>Search by **binCode** is allowed")
	@ApiPageable
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	@GetMapping(value = "/bins")
	public PagedRestResponse<List<InventoryBinDto>> listBins(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_REGEX) String binCode,
			@RequestParam(required = false) @ApiParam(required = false, value = "Bin Enum ", allowableValues = "BIN_BIN,ISSUE_TO_CFA") @ValueOfEnum(enumClass = BinListEnum.class) String binType,
			@ApiIgnore Pageable pageable) {
		return stockManagementFacade.listBins(binCode, binType != null ? binType : "",
				InventorySearchCategoryEnum.BINCODE, pageable);
	}

	/**
	 * Returns list of Product category
	 * 
	 * @param productCategory            - productCategory of InventoryDetail
	 * @param inventoryEnum(ALL,BIN_BIN) - to fetch according to business rules
	 * @param pageable                   - Pageable support with page, size, sort
	 *                                   values as request params
	 * @return - List of binCodes group by binCode
	 */

	// moved to sales
	@ApiOperation(value = "Lists Group of Product Category", notes = "Lists group of product category along with **Total weight, Total quantity and Total value**"
			+ "<br>Search by **productCategory** is allowed")
	@ApiPageable
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	@GetMapping(value = "/product-category")
	public PagedRestResponse<List<InventoryBinDto>> listProductCategory(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategory,
			@RequestParam(required = false) @ApiParam(required = false, value = "Bin Enum ", allowableValues = "BIN_BIN,ISSUE_TO_CFA") @ValueOfEnum(enumClass = BinListEnum.class) String binType,
			@ApiIgnore Pageable pageable) {
		return stockManagementFacade.listProductCategory(productCategory, binType != null ? binType : "",
				InventorySearchCategoryEnum.PRODUCTCATEGORY, pageable);
	}

	/**
	 * Returns list of Product Group
	 * 
	 * @param productGroup               - productGroup of InventoryDetail
	 * @param inventoryEnum(ALL,BIN_BIN) - to fetch according to business rules
	 * @param pageable                   - Pageable support with page, size, sort
	 *                                   values as request params
	 * @return - List of binCodes group by binCode
	 */

	// moved to sales
	@ApiOperation(value = "Lists Group of Product Group", notes = "Lists group of product group along with  **Total weight, Total quantity and Total value**"
			+ "<br>Search by **productGroup** is allowed")
	@ApiPageable
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	@GetMapping(value = "/product-group")
	public PagedRestResponse<List<InventoryBinDto>> listProductGroup(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroup,
			@RequestParam(required = false) @ApiParam(required = false, value = "Bin Enum ", allowableValues = "BIN_BIN,ISSUE_TO_CFA") @ValueOfEnum(enumClass = BinListEnum.class) String binType,
			@ApiIgnore Pageable pageable) {
		return stockManagementFacade.listProductGroup(productGroup, binType != null ? binType : "",
				InventorySearchCategoryEnum.PRODUCTGROUP, pageable);
	}

	/**
	 * returns item with matching request param(binCode,
	 * itemCode,productCategory,productGroup)
	 * 
	 * @param binCode         - binCode of items
	 * @param itemCode        - itemCode/variantCode of an item
	 * @param productCategory - productCategory of items
	 * @param productGroup    - productGroup of items
	 * @return item details based on bin code and other parameters
	 */
	@ApiOperation(value = "Lists inventory items", notes = "Lists inventory items for a particular **binType**"
			+ "<br>**Multiple** Bincode, product category and product group can be enetered "
			+ "<br>Supports multiple search parameters")
	@ApiPageable
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	@GetMapping(value = "/items")
	public PagedRestResponse<InventoryItemDtoList> listInventoryItems(
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.BIN_REGEX) String> binCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String> productCategory,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String> productGroup,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String binGroupCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) @ApiParam(required = false, value = "Bin Enum ", allowableValues = "BIN_BIN,ISSUE_TO_CFA,ADJ,PSV") @ValueOfEnum(enumClass = BinListEnum.class) String binType,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		
		return stockManagementFacade.listInventoryItems(binCode, itemCode, productCategory, productGroup, binGroupCode,
				lotNumber, binType != null ? binType : "", isPageable, pageable);
	}

	/**
	 * Returns StockTransactionDocNoDto,
	 * 
	 * @param srcBincode         - current binCode of items
	 * @param destinationBincode - receiving bin code name
	 * @return StockTransactionDocNoDto - doc no generated for transaction done
	 */
	@ApiOperation(value = "Bulk transfer of inventory items by binCode", notes = "Transfers all inventory items form **source bin** to **destination bin**.<br>"
			+ "A doc no**(docNo in response)** is generated for the transaction made")
	@PatchMapping(value = "/bin/items")
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	public StockTransactionDocNoDto updateAllInventoryItemsByBinCode(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_REGEX) String srcBincode,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_REGEX) String destinationBincode,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String destinationBinGroup) {
		return stockManagementFacade.updateAllInventoryItemsByBinCode(srcBincode, destinationBincode,
				destinationBinGroup, InventorySearchCategoryEnum.BINCODE);
	}

	/**
	 * Returns StockTransactionDocNoDto,
	 * 
	 * @param productCategory    - productCategory of items
	 * @param destinationBincode - receiving bin code name
	 * @return StockTransactionDocNoDto - doc no generated for transaction done
	 */
	@ApiOperation(value = "Bulk transfer of inventory items by productCategory", notes = "Transfers all inventory items form **product category** to **destination bin**.<br>"
			+ "A doc no**(docNo in response)** is generated for the transaction made")
	@PatchMapping(value = "/product-category/items")
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	public StockTransactionDocNoDto updateAllInventoryItemsByProductCategory(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategory,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_REGEX) String destinationBincode,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String destinationBinGroup) {
		return stockManagementFacade.updateAllInventoryItemsByProductCategory(productCategory, destinationBincode,
				destinationBinGroup, InventorySearchCategoryEnum.PRODUCTCATEGORY);
	}

	/**
	 * Returns StockTransactionDocNoDto,
	 * 
	 * @param productGroup       - productGroup of items
	 * @param destinationBincode - receiving bin code name
	 * @return StockTransactionDocNoDto - doc no generated for transaction done
	 */
	@ApiOperation(value = "Bulk transfer inventory items by productGroup", notes = "Transfers all inventory items form one **product group** to **destination bin**.<br>"
			+ "A doc no**(docNo in response)** is generated for the transaction made")
	@PatchMapping(value = "/product-group/items")
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	public StockTransactionDocNoDto updateAllInventoryItemsByProductGroup(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroup,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_REGEX) String destinationBincode,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String destinationBinGroup) {
		return stockManagementFacade.updateAllInventoryItemsByProductGroup(productGroup, destinationBincode,
				destinationBinGroup, InventorySearchCategoryEnum.PRODUCTGROUP);
	}

	/**
	 * Returns StockTransactionDocNoDto,
	 * 
	 * @param InventoryBinUpdateDto - contains destination binCode name and id
	 * @return StockTransactionDocNoDto - doc no generated for transaction done
	 */
	@ApiOperation(value = "To update Item", notes = "This API will take list of **id's (Max 50)** and **binCode** of the items and move it to specified bin<br>"
			+ "A doc no**(docNo in response)** is generated for the transaction made")
	@PatchMapping(value = "/bins/items")
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	public StockTransactionDocNoDto updateInventoryItems(@RequestParam(required = false) Integer id,
			@RequestBody @Valid InventoryBinUpdateDto binTransferItems) {

		return stockManagementFacade.updateInventoryItems(id,binTransferItems);
	}

	@ApiOperation(value = "To update binCode", notes = "This API will take list of bin codes, product category, product group, item code and lot number and transfer the items to the specified bingroup and in code")
	@PatchMapping(value = "/items")
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	public StockTransactionDocNoDto updateAllItems(@RequestBody @Valid BinUpdateBulkDto binUpdateBulkDto) {
		return stockManagementFacade.updateAllItems(binUpdateBulkDto);
	}

	@GetMapping(value = "/remove-from-reservebin")
	@ResponseBody
	@ApiOperation(value = "Invoke Reserve Bin ", notes = "This API invocation will move Items older than numberOfDays entered , from RESERVEBIN to Previous Bin ")
	public SchedulerResponseDto moveItemsFromReserveBin(
			@ApiParam(name = "locationCode") @RequestParam(name = "locationCode", required = true) String locationCode,
			@ApiParam(name = "numberOfDays") @RequestParam(name = "numberOfDays", required = true) Integer numberOfDays) {
		return stockManagementFacade.moveItemsFromReserveBin(locationCode, numberOfDays);

	}

	// @formatter:off
	@ApiOperation(value = "To create stock management", notes = "This API will create stock management and stock"
			+ "transaction type will be **CUT_PIECE_TEP**")
	// @formatter:on
	@PostMapping(value = "/stock-managements")
	public StockTransactionDto createStockManagements(
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType) {
		return stockManagementFacade.createStockManagements(transactionType);
	}

	// @formatter:off
	@ApiOperation(value = "To get stock management by id", notes = "This API will get stock management by id and stock"
			+ "transaction type will be **CUT_PIECE_TEP**. Here **id** is mandatory.")
	// @formatter:on
	@GetMapping(value = "/stock-managements/{id}")
	public StockTransactionDto getStockManagements(
			@ApiParam(name = "id", value = "'id' to get stock managements", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType) {
		return stockManagementFacade.getStockManagements(id, transactionType);
	}

	// @formatter:off
	@ApiOperation(value = "To add item in stock management", notes = "This API will add item in stock management by id and stock"
			+ "transaction type will be **CUT_PIECE_TEP**. Here **id** is mandatory and only one item can be added.")
	// @formatter:on
	@PostMapping(value = "/stock-managements/{id}/items")
	public StockTransactionItemDto addItems(
			@ApiParam(name = "id", value = "'id' to get stock managements", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType,
			@ApiParam(name = "body", value = "stock management object needs to be updated", required = true) @RequestBody @Valid StockTransactionAddItemDto stockTransactionAddItemDto) {
		return stockManagementFacade.addItems(id, transactionType, stockTransactionAddItemDto);
	}

	// @formatter:off
	@ApiOperation(value = "To get item in stock management", notes = "This API will get item in stock management by id and item id."
			+ "stock transaction type will be **CUT_PIECE_TEP**. Here **id** and **itemId** are mandatory.")
	// @formatter:on
	@GetMapping(value = "/stock-managements/{id}/items/{itemId}")
	public StockTransactionItemDto getItems(
			@ApiParam(name = "id", value = "'id' to get stock managements", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to get stock managements items", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType) {
		return stockManagementFacade.getItems(id, transactionType, itemId);
	}

	// @formatter:off
	@ApiOperation(value = "To update item in stock management", notes = "This API will update item in stock management by id and item id."
			+ "stock transaction type will be **CUT_PIECE_TEP**. Here **id** and **itemId** are mandatory "
			+ "and only **measuredWeight** can be updated.")
	// @formatter:on
	@PatchMapping(value = "/stock-managements/{id}/items/{itemId}")
	public StockTransactionItemDto updateItems(
			@ApiParam(name = "id", value = "'id' to get stock managements", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to get stock managements items", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType,
			@ApiParam(name = "body", value = "stock management object needs to be updated", required = true) @RequestBody @Valid StockTransactionUpdateItemDto stockTransactionUpdateItemDto) {
		return stockManagementFacade.updateItems(id, transactionType, itemId, stockTransactionUpdateItemDto);
	}

	// @formatter:off
	@ApiOperation(value = "To confirm stock management", notes = "This API will confirm stock management by id."
			+ "stock transaction type will be **CUT_PIECE_TEP**. Here **id**  is mandatory. ")
	// @formatter:on
	@PutMapping(value = "/stock-managements/{id}")
	public StockTransactionDto confirmStockTransaction(
			@ApiParam(name = "id", value = "'id' to get stock managements", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType,
			@ApiParam(name = "body", value = "stock management object needs to be updated", required = true) @RequestBody @Valid StockTransactionConfirmDto stockTransactionConfirmDto) {
		return stockManagementFacade.confirmStockTransaction(id, transactionType, stockTransactionConfirmDto);
	}

	// @formatter:off
	@ApiOperation(value = "To update header in stock management", notes = "This API will update header in stock management by id and item id."
			+ "stock transaction type will be **CUT_PIECE_TEP**. Here **id**  is mandatory and only **employeeCode** "
			+ "can be updated.")
	// @formatter:on
	@PatchMapping(value = "/stock-managements/{id}")
	public StockTransactionDto updateStockTransaction(
			@ApiParam(name = "id", value = "'id' to get stock managements", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType,
			@ApiParam(name = "body", value = "stock management object needs to be updated", required = true) @RequestBody @Valid StockTransactionUpdateDto stockTransactionUpdateDto) {
		return stockManagementFacade.updateStockTransaction(id, transactionType, stockTransactionUpdateDto);
	}

	@DeleteMapping("/{id}/items/{itemId}")
	@ApiOperation(value = "API to delete stock transaction item", notes = "This API will delete stock transaction item w.r.t id and itemId.<br>")
	public StockTransactionDto deleteStockTransactionItem(
			@ApiParam(name = "id", value = "'id' to get stock managements", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType,
			@ApiParam(name = "itemId", value = "'itemId' to get stock managements items", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId) {
		return stockManagementFacade.deleteStockTransactionItem(id, transactionType, itemId);
	}

	@DeleteMapping("/{id}")
	@ApiOperation(value = "API to delete stock transaction", notes = "This API will delete stock transaction w.r.t id")
	public void deleteStockTransaction(
			@ApiParam(name = "id", value = "'id' to get stock managements", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType) {
		stockManagementFacade.deleteStockTransaction(id, transactionType);
	}

	// @formatter:off
	@ApiPageable
	@ApiOperation(value = "List stock management", notes = "This API will list stock management, transaction type will be **CUT_PIECE_TEP**.")
	// @formatter:on
	@GetMapping(value = "/stock-managements")
	public PagedRestResponse<List<BaseTransactionDetailsDto>> getStockManagements(
			@RequestParam(name = "transactionType", required = true) @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType,
			@ApiParam(name = "docNo", value = "Provide if you want to search by 'doc number'", required = false) @RequestParam(name = "docNo", required = false) @Min(1) Integer docNo,
			@ApiParam(name = "fiscalYear", value = "Provide if you want to search by 'fiscal Year'", required = false) @RequestParam(name = "fiscalYear", required = false) @Positive Short fiscalYear,
			@ApiParam(name = "status", value = "Provide to search by 'transaction status'", allowableValues = "OPEN, CONFIRMED, DELETED", required = false) @RequestParam(name = "status", required = false) @ValueOfEnum(enumClass = StockManagementStatusEnum.class) String status,
			@ApiIgnore Pageable pageable) {
		return stockManagementFacade.getTransactionDetails(transactionType, docNo, fiscalYear, status, pageable);
	}

	// @formatter:off
	@ApiOperation(value = "Get stock management count", notes = "This API will give stock management count and transaction type will be **CUT_PIECE_TEP**.")
	// @formatter:on
	@GetMapping(value = "/stock-managements/count")
	public ListResponse<StockTransactionStatusCountDto> getStockManagementsCount(
			@RequestParam(name = "transactionType", required = true) @ApiParam(value = "stock transaction Type", required = true, allowableValues = "CUT_PIECE_TEP") @ValueOfEnum(enumClass = StockManagementEnum.class) String transactionType,
			@ApiParam(name = "status", value = "Provide to search by 'transaction status'", allowableValues = "OPEN, CONFIRMED, DELETED", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = StockManagementStatusEnum.class) String status,
			@ApiIgnore Pageable pageable) {
		return stockManagementFacade.getStockManagementsCount(transactionType, status, pageable);
	}
	
	@ApiOperation(value = "API to upload .csv document", notes = "API to upload .csv file having itemCodes and LotNumber.<br/>")
	@PostMapping("/uploadItemsCSV")
	public InventoryItemDtoList uploadFile(
			//@RequestParam(required = false) @ApiParam(value = "provide Document Type", allowableValues = "", required = false) String docType,
			//@RequestParam(required = false) @ApiParam(value = "provide File Type", allowableValues = "OTHERS", required = false)  String fileType,
			@RequestParam(required = true) MultipartFile reqFile) {

		return stockManagementFacade.uploadFile(reqFile);
	}
	
	@ApiOperation(value = "API to upload .csv document for bin to bin transfer ", notes = "API to upload .csv document for bin to bin transfer.<br/>")
	@PostMapping("/uploadBinItemsCSV")
	public FileItemStageDto uploadFileBinToBinTransfer(
			//@RequestParam(required = false) @ApiParam(value = "provide Document Type", allowableValues = "", required = false) String docType,
			//@RequestParam(required = false) @ApiParam(value = "provide File Type", allowableValues = "OTHERS", required = false)  String fileType,
			@RequestParam(required = true) MultipartFile reqFile) {

		return stockManagementFacade.uploadFileBinToBinTransfer(reqFile);
	}
	
	@ApiOperation(value = "API to get list of data for uploaded files for bin to bin transfer", notes = "API to get list of data for uploaded files for bin to bin transfer.<br/>")
	@GetMapping("/bins/transfer/items/{id}")
	@ApiPageable
	public InventoryBinToBinItemsDtoList getBinsTransferItems(@PathVariable Integer id, @ApiIgnore Pageable pageable) {

		return stockManagementFacade.getBinsTransferItems(id,pageable);
	}
	
	/**
	 * Returns StockTransactionDocNoDto,
	 * 
	 * @param srcBincode         - current binCode of items
	 * @param destinationBincode - receiving bin code name
	 * @return StockTransactionDocNoDto - doc no generated for transaction done
	 */
	@ApiOperation(value = "API to bulk transfer of inventory items by binCode and bingroup for uploaded files", notes = "Uploaded .csv document of transfers all  inventory items form **source bin** to **destination bin**.<br>"
			+ "A doc no**(docNo in response)** is generated for the transaction made")
	@PatchMapping(value = "/bin/items/{id}")
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	public StockTransactionDocNoDto updateAllUploadedInventoryItemsByBinCode(
			@PathVariable Integer id,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_REGEX) String destinationBincode,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) String destinationBinGroup) {
		return stockManagementFacade.updateAllUploadedInventoryItemsByBinCode(id, destinationBincode,
				destinationBinGroup);
	}
	
	@ApiOperation(value = "API to get list of uploaded files", notes = "API to get list of uploaded files based on **isPageable**")
	@GetMapping("/file/items")
	@ApiPageable
	public PagedRestResponse<List<BinToBinFileStageDto>> listBinToBinStageData(
			@ApiIgnore Pageable pageable) {
		return stockManagementFacade.listBinToBinStageData(pageable);
	}
	
	@ApiOperation(value = "To update multiple bin item for uploaded files", notes = "This API will take list of **id's max(50)** and **binCode** of the items and move it to specified bin<br>"
			+ "A doc no**(docNo in response)** is generated for the transaction made")
	@PatchMapping(value = "/bin/transfer/items/{id}")
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	public StockTransactionDocNoDto updateInventoryStageItems(@PathVariable Integer id,
			@RequestBody @Valid InventoryStageBinUpdateDto stageBinTransferItems) {

		return stockManagementFacade.updateInventoryStageItems(id,stageBinTransferItems);
	}
	
	/**
	 * This method will update the isHallmarking flag for the provided combinations
	 * based on item code and lot number.
	 * 
	 * @param itemCode
	 * @param lotNumber
	 * @param isHallmarking
	 * @return ResponseEntity<Resource>
	 */
	@ApiPageable
	@ApiOperation(value = "API to get inventory details", notes = "This API will list inventory details for the given itemCode and lot number and update the isHallmark flag to true.")
	@PatchMapping("/items/{itemCode}/{lotNumber}/{isHallmarking}")
	public ResponseEntity<Resource> getInventoryItemLotDetails(
			@ApiParam(value = "'item code' to get inventory details", required = true) @PathVariable("itemCode") @SqlInjectionCheck @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true) String itemCode,
			@ApiParam(value = "'lot number' to get inventory details", required = true) @PathVariable("lotNumber") @SqlInjectionCheck @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX, nullCheck = true) String lotNumber,
			@ApiParam(value = "'isHallmarking' flag", required = true) @PathVariable("isHallmarking") Boolean isHallmarking) {

		return stockManagementFacade.getInventoryItemLotDetails(itemCode, lotNumber, isHallmarking);
	}
}
