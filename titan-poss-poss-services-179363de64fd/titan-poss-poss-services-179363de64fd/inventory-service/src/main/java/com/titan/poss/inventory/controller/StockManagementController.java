/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.inventory.acl.InventoryAccessControls.BIN_TO_BIN_TRANSFER;
import static com.titan.poss.inventory.acl.InventoryAccessControls.CONFIRM_CONVERSION;
import static com.titan.poss.inventory.acl.InventoryAccessControls.CONVERSION_REQUESTS_SENT;
import static com.titan.poss.inventory.acl.InventoryAccessControls.CONVERSION_SEARCH_BY_VARIANT;
import static com.titan.poss.inventory.acl.InventoryAccessControls.REQUEST_FOR_BIN_CREATION;
import static com.titan.poss.inventory.acl.InventoryAccessControls.REQUEST_IBT_REQUESTS_SENT;
import static com.titan.poss.inventory.acl.InventoryAccessControls.VIEW_BIN;

import java.io.IOException;
import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.SqlInjectionCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dto.constants.BinListEnum;
import com.titan.poss.inventory.dto.constants.IBTRegionTypeEnum;
import com.titan.poss.inventory.dto.request.BinRequestCreateDto;
import com.titan.poss.inventory.dto.request.ConversionApprovalRequestDto;
import com.titan.poss.inventory.dto.request.ConversionRequestDto;
import com.titan.poss.inventory.dto.request.RequestSearchDto;
import com.titan.poss.inventory.dto.response.AvailableBinCode;
import com.titan.poss.inventory.dto.response.BinRequestDto;
import com.titan.poss.inventory.dto.response.ConversionDto;
import com.titan.poss.inventory.dto.response.ConversionRequestItemListDto;
import com.titan.poss.inventory.dto.response.ConversionRequestListDto;
import com.titan.poss.inventory.dto.response.ConversionResponseDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.ItemLocationDto;
import com.titan.poss.inventory.facade.StockManagementFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController
@Validated
@RequestMapping(value = "inventory/v2/stock-managements")
public class StockManagementController {
	@Autowired
	private StockManagementFacade stockManagementFacade;

	private static final String BIN_TO_BIN_TRANSFER_PERMISSION = START + BIN_TO_BIN_TRANSFER + END;
	private static final String BIN_CREATION_REQUEST_PERMISSION = START + REQUEST_FOR_BIN_CREATION + END;
	private static final String CONVERSION_REQUEST_SENT_PERMISSION = START + CONVERSION_REQUESTS_SENT + END;
	private static final String CONVERSION_SEARCH_BY_VARIANT_PERMISSION = START + CONVERSION_SEARCH_BY_VARIANT + END;
	private static final String STOCK_REQUEST_SENT_PERMISSION = START + REQUEST_IBT_REQUESTS_SENT + END;
	private static final String CONFIRM_CONVERSION_PERMISSION = START + CONFIRM_CONVERSION + END;
	private static final String BIN_VIEW_PERMISSION = START + VIEW_BIN + END;

	/**
	 * To check the availability of an item in other locations for Inter Boutique
	 * Transfer
	 * 
	 * @param reqSearch - required item details - itemcode,quantity
	 * @return - list of location with available items
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	@ApiOperation(value = "Check the availability of the items in other locations and returns the list of available locations", notes = "Check the availability of an item in other locations and returns the list of available locations"
			+ "</br>**ownerTypeCodes** i.e **L1** or **L2** , **regionType** i.e **TOWN,STATE,REGION,COUNTRY** and **locationType** i.e **BTQ** are optional parameters"
			+ "</br>**itemCode** and **quantity** are mandatory parameters")
	@ApiPageable
	@PostMapping(value = "/items/locations")
	@PreAuthorize(STOCK_REQUEST_SENT_PERMISSION)
	public PagedRestResponse<List<ItemLocationDto>> listLocationsWithItems(
			@RequestParam(name = "ownerTypeCode", required = false) List<String> ownerTypeCodes,
			@RequestParam(name = "regionType", required = false) @ApiParam(required = false, value = "IBT Region", allowableValues = "TOWN,STATE,REGION,COUNTRY") @ValueOfEnum(enumClass = IBTRegionTypeEnum.class) String regionType,
			@RequestParam(name = "locationType", required = false) List<String> locationTypes,
			@RequestBody @Valid RequestSearchDto reqSearch, @ApiIgnore Pageable pageable) throws IOException {
		return stockManagementFacade.listLocationsWithItems(reqSearch.getReqItems(), ownerTypeCodes,
				regionType != null ? regionType : null, locationTypes, pageable);
	}

	/**
	 * Returns BinRequestDto which contains Doc no generated
	 * 
	 * @param binRequestDto - contains bin name and remarks
	 * @return - BinRequestDto containing request status and doc no
	 */
	@ApiOperation(value = "Creating a bin request", notes = "This API will take the requested bin name and description and send for approval"
			+ "<br>A doc no will generated ")
	@PreAuthorize(BIN_CREATION_REQUEST_PERMISSION)
	@PostMapping(value = "/bins/requests")
	public BinRequestDto createBinRequest(@RequestBody @Valid BinRequestCreateDto binRequestDto) {
		return stockManagementFacade.createBinRequest(binRequestDto);

	}

	/**
	 * Returns list of binRequestDto containing bin requests
	 * 
	 * @return - BinRequestDto list
	 */
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	@ApiOperation(value = "Listing bin creation requests", notes = "This API will return pending requests for bin creation<br>Doc no can also be entered to search")
	@ApiPageable
	@GetMapping(value = "/bins/requests")
	public PagedRestResponse<List<BinRequestDto>> listBinCreationRequest(
			@RequestParam(required = false) Integer reqDocNo, @ApiIgnore Pageable pageable) {
		return stockManagementFacade.listBinCreationRequest(reqDocNo, pageable);

	}

//	@PreAuthorize(CONVERSION_SEARCH_BY_VARIANT_PERMISSION)
	@ApiOperation(value = "API to search for conversion items", notes = "This API will give the list of parent item and respective "
			+ " child split items if parent item is available for conversion")
	@GetMapping("/conversion/items")
	public ListResponse<ConversionResponseDto> listConversionItems(
			@RequestParam(name = "itemCode", required = true) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(name = "lotNumber", required = true) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(name = "itemWeight", required = true) BigDecimal itemWeight,
			@RequestParam(name = "binCode", required = true) @PatternCheck(regexp = RegExConstants.BIN_REGEX) String binCode) {
		return stockManagementFacade.listConversionItems(itemCode, lotNumber, itemWeight, binCode);
	}

//	@PreAuthorize(CONFIRM_CONVERSION_PERMISSION)
	@ApiOperation(value = "API to convert the conversion items", notes = "This API is used to convert the parent item to child items. "
			+ " The parent item will be removed from inventory and child items will be inwarded in inventory"
			+ "</br>**issueItems**,**receiveItems**,**rsoName** are mandatory input fields")
	@PostMapping("/conversion/items")
	public ConversionDto createConversionItems(@RequestBody @Valid ConversionRequestDto conversionRequestDto) {
		return stockManagementFacade.createConversionItems(conversionRequestDto);
	}

	@PreAuthorize(BIN_VIEW_PERMISSION)
	@GetMapping("/bincodes")
	public ListResponse<AvailableBinCode> getAvailableBinCodesByLocation() {
		return stockManagementFacade.getAvailableBinCodesByLocation();
	}

	@ApiOperation(value = "API to show the list conversion's request", notes = "If any conversion item goes for approval request "
			+ " then all the requests will be shown."
			+ " </br>Here **srcDocNo** is optional request param fields. If **srcDocNo** provides then result will give only against"
			+ " the particular **srcDocNo**")
	@ApiPageable
//	@PreAuthorize(CONVERSION_REQUEST_SENT_PERMISSION)
	@GetMapping("/conversion/requests")
	public PagedRestResponse<List<ConversionRequestListDto>> listConversionRequest(
			@RequestParam(required = false) Integer srcDocNo, @ApiIgnore Pageable pageable) {
		return stockManagementFacade.listConversionRequest(srcDocNo, pageable);
	}

	@ApiOperation(value = "API to get the conversion's request", notes = "This API returns particular conversion details based on id. ")
//	@PreAuthorize(CONVERSION_REQUEST_SENT_PERMISSION)
	@GetMapping("/conversion/requests/{id}")
	public ConversionRequestListDto getConversionRequest(@PathVariable Integer id) {
		return stockManagementFacade.getConversionRequest(id);
	}

	@ApiOperation(value = "API to show the list of conversion's request items", notes = "This API is used to see the items against the header."
			+ "</br> Here **id** is mandatory PathVariable fields and response will be pageable list of items")
	@ApiPageable
//	@PreAuthorize(CONVERSION_REQUEST_SENT_PERMISSION)
	@GetMapping("/conversion/requests/{id}/items")
	public PagedRestResponse<List<ConversionRequestItemListDto>> listConversionRequestItems(@PathVariable Integer id,
			@ApiIgnore Pageable pageable) {
		return stockManagementFacade.listConversionRequestItem(id, pageable);
	}

//	@PreAuthorize(CONFIRM_CONVERSION_PERMISSION)
	@PatchMapping("/conversion/requests/{id}")
	public ConversionDto updateConversionRequest(@PathVariable Integer id,
			@RequestBody @Valid ConversionApprovalRequestDto conversionApprovalRequestDto) {
		return stockManagementFacade.updateConversionRequest(id, conversionApprovalRequestDto);
	}

	@ApiOperation(value = "To get Doc Number", notes = "This API will make a entry in stock transaction table for BIN to BIN transafer and returns the same with Doc number")
	@GetMapping(value = "/docnumber")
	@PreAuthorize(BIN_TO_BIN_TRANSFER_PERMISSION)
	public StockTransactionDao generateDocNumber() {
		return stockManagementFacade.addBinStockTransaction();
	}
	
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
	 * This method will update the isHallmarking flag for the provided combinations based on
	 * item code and lot number.
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
