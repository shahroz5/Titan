/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.json.JSONException;
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
import com.titan.poss.core.domain.acl.ProductMasterACLConstants;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CustomLotMasterDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.ProductCategoryLiteDto;
import com.titan.poss.core.dto.ProductGroupLiteDto;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.enums.ProductDocTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.engine.constant.ProductGroupTransactionTypeEnum;
import com.titan.poss.core.dto.StoneDetailsLiteDto;
import com.titan.poss.engine.dto.request.StoneSearchRequestDto;
import com.titan.poss.engine.dto.response.ItemLotStoneListDto;
import com.titan.poss.engine.dto.response.ItemTypeDto;
import com.titan.poss.engine.service.ProductService;
import com.titan.poss.product.dto.ComplexityDto;
import com.titan.poss.product.dto.ItemStoneDetailsDto;
import com.titan.poss.product.dto.ItemStoneDto;
import com.titan.poss.product.dto.PurityDto;
import com.titan.poss.product.dto.StoneDto;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("engineProductController")
@RequestMapping(value = "engine/v2/products")
public class ProductController {

	@Autowired
	private ProductService productService;

	private static final String ITEM_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.BOUTIQUE_ITEM_MASTER_VIEW + PreAuthorizeDetails.BIT_OR
			+ ProductMasterACLConstants.PRODUCT_MASTERS_ITEM_VIEW + "' )";

	private static final String STONE_VIEW_PERMISSION = "hasPermission(true,'"
			+ ProductMasterACLConstants.BOUTIQUE_STONE_MASTER_VIEW + PreAuthorizeDetails.BIT_OR
			+ ProductMasterACLConstants.PRODUCT_MASTERS_STONE_VIEW + "' )";
	
	
	private static final String PRODUCT_MASTER_VIEW_PERMISSION = START + ProductMasterACLConstants.PRODUCT_MASTER_VIEW + END;
	private static final String PRODUCT_MASTER_ADD_EDIT_PERMISSION = START + ProductMasterACLConstants.PRODUCT_MASTER_ADD_EDIT
			+ END;

	/**
	 * This method will return the list of Item stone mapping details based on
	 * isActive as true.
	 * 
	 * @param itemCode
	 * @return List<ItemStoneMappingDto>
	 */
	@ApiOperation(value = "View the list of Item stone mapping details", notes = "This API returns the list of Item stone mapping details based on **isActive**.<br>"
			+ "Provide location code for EPOSS users, for store users location code is picked internally.<br>")
	@GetMapping("items/{itemCode}/stones")
	public ListResponse<StoneDetailsLiteDto> listItemStoneMapping(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@ApiParam(value = "location code", required = false) @RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {
		return productService.listItemStoneLiteMapping(itemCode, lotNumber, locationCode);
	}

	/**
	 * This method will return the list of ProductCategory details based on
	 * isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ProductCategoryLiteDto>>
	 */
	@ApiOperation(value = "View the list of ProductCategory details", notes = "This API returns the list of ProductCategory details based on **isPageable**")
	@GetMapping("/product-categories")
	@ApiPageable
	public PagedRestResponse<List<ProductCategoryLiteDto>> listProductCategory(
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return productService.listProductCategoryLite(isPageable, pageable);
	}

	/**
	 * This method will return the list of ProductGroup details based on isPageable.
	 * is also used to get plain, studded, other productGroups list w.r.t
	 * isPlainStudded param
	 * 
	 * @param isPageable
	 * @param pageable
	 * @param plainStudded
	 * @return PagedRestResponse<List<ProductGroupLiteDto>>
	 */
	@ApiOperation(value = "View the list of ProductGroup details", notes = "This API returns the list of ProductGroup details based on **isPageable**"
			+ "</br> is also used to get plain, studded, other productGroups list w.r.t  isPlainStudded param"
			+ "</br>P - Plain" + "</br>S - Studded" + "</br>O - Others" + "</br>M - Mia")
	@GetMapping("/product-groups")
	@ApiPageable
	public PagedRestResponse<List<ProductGroupLiteDto>> listProductGroup(
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@RequestParam(required = false) @ApiParam(value = "Plain Studded Enum", allowableValues = "P,S,O,M", required = false) @ValueOfEnum(enumClass = PlainStuddedEnum.class) String plainStudded,
			@RequestParam(required = false) @ApiParam(value = "Transaction Type Enum", allowableValues = "TEP, GRN, GRF", required = false) @ValueOfEnum(enumClass = ProductGroupTransactionTypeEnum.class) String transactionType,
			@ApiIgnore Pageable pageable) {
		return productService.listProductGroupLite(isPageable, plainStudded, transactionType, pageable);

	}

	/**
	 * This method will return the list of ProductGroup details based on isPageable.
	 * is also used to get plain, studded, other productGroups list w.r.t
	 * isPlainStudded param
	 * 
	 * @param isPageable
	 * @param pageable
	 * @param isPlainStudded
	 * @return PagedRestResponse<List<ProductGroupLiteDto>>
	 */
	@ApiOperation(value = "View the list of ProductGroup details,  this API is Cached w.r.t ", notes = "This API returns the list of ProductGroup details based on **isPageable**"
			+ "</br> is also used to get plain, studded, other productGroups list w.r.t  isPlainStudded param"
			+ "</br>P - Plain" + "</br>S - Studded" + "</br>O - Others" + "</br>M - Mia")
	@GetMapping("/product-groups/cache")
	public Map<String, String> listProductGroups(
			@RequestParam(required = false) @ApiParam(value = "Plain Studded Enum", allowableValues = "P,S,O,M", required = false) @ValueOfEnum(enumClass = PlainStuddedEnum.class) String plainStudded,
			@RequestParam(required = false) @ApiParam(value = "Transaction Type Enum", allowableValues = "TEP, GRN, GRF", required = false) @ValueOfEnum(enumClass = ProductGroupTransactionTypeEnum.class) String transactionType) {
		return productService.listProductGroupLite(plainStudded, transactionType);

	}

	/**
	 * This method will return the list of ProductCategory details based on
	 * isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ProductCategoryLiteDto>>
	 */
	@ApiOperation(value = "View the list of ProductCategory details", notes = "This API returns the list of ProductCategory details based on **isPageable**")
	@GetMapping("/product-categories/cache")
	public Map<String, String> listProductCategory() {
		return productService.listProductCategoryLite();
	}

	@ApiOperation(value = "View the list of Item Types", notes = "This API returns the list of Item Types")
	@GetMapping("/item-types")
	public ListResponse<ItemTypeDto> listItemType(@RequestParam(required = true) List<String> itemGroups) {
		return productService.listItemType(itemGroups);
	}

	@ApiOperation(value = "View Lov details", notes = "This API will give the Lov details based on **lovType**.<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Lov types:</span>" + "<ul>"
			+ "		<li>FINDING</li>" + "		<li>MATERIALTYPE</li>" + "		<li>PRICINGGROUPTYPE</li>"
			+ "		<li>PRICINGTYPE</li>" + "		<li>PRODUCTTYPE</li>" + "		<li>SUPPLYCHAIN</li>"
			+ "		<li>GEPITEMTYPE</li>" + "		<li>WEIGHT_EDIT_REASON_TYPE</li>"
			+ "		<li>REASON_FOR_NOT_GIVING_DISCOUNT</li>" + "		<li>REASON_FOR_CHANGING_DISCOUNT</li>" + "</ul>"
			+ "Please note that if lovType is wrong then empty resopne will be returned.")
	@GetMapping(value = "lovs/{lovType}")
	public LovDto getProductLov(
			@PathVariable @ApiParam(name = "lovType", value = "'lovType' to get details", allowableValues = "FINDING, MATERIALTYPE, PRICINGGROUPTYPE, PRICINGTYPE, PRODUCTTYPE, SUPPLYCHAIN,GEPITEMTYPE,WEIGHT_EDIT_REASON_TYPE, REASON_FOR_NOT_GIVING_DISCOUNT, REASON_FOR_CHANGING_DISCOUNT", required = true) String lovType) {
		return productService.getProductLov(lovType);
	}

	/**
	 * This method will return the Item details based of itemCode passed in the
	 * list.
	 * 
	 * @param itemCode
	 * @return ListResponse<ItemLiteDto>
	 */
	@Deprecated
	@ApiOperation(value = "View the List of Item details", notes = "This API returns the List of Item details for a itemCode")
	@GetMapping("/items")
	public ListResponse<ItemLiteDto> getItemList(
			@RequestParam(name = "itemCodes", required = true) List<@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String> itemCodes) {
		return productService.getItemList(itemCodes);
	}

	//@formatter:off
	@ApiOperation(value = "Create lot number", notes = "This API creates lot number for the below doc type.<br>"
			+ "<ul>"
			+ "<li>OTHERRECPT</li>"
			+ "<li>GEP</li>"
			+ "<li>GRN</li>"
			+ "<li>TEP</li>"
			+ "<li>DOCTYPE_REQUEST_SERVICE</li>"
			+ "</ul>")
	//@formatter:on
	@PostMapping("/lotNumber")
	public CustomLotMasterDto generateLotNumber(
			@RequestParam(required = true) @ApiParam(value = "DOC Type ", required = true, allowableValues = "OTHERRECPT, GEP, GRN, TEP, DOCTYPE_REQUEST_SERVICE") @ValueOfEnum(enumClass = ProductDocTypeEnum.class) String docTypeEnum) {
		return productService.generateLotNumber(docTypeEnum);
	}

	//@formatter:off
	@ApiOperation(value="Search item details",notes="This API is to search item details based on below filters.<br>"
			+ "<ul>"
			+ "<li>itemCode</li>"
			+ "<li>range (fromStdValue-toStdValue)</li>"
			+ "<li>range (fromStoneCharges-toStoneCharges)</li>"
			+ "<li>productGroupCode</li>"
			+ "<li>productCategoryCode</li>"
			+ "<li>pricingType(UCP ,NONUCP)</li>"
			+ "<li>range (fromStdWeight-toStdWeight)</li>"
			+ "</ul>")
	//@formatter:on
	@ApiPageable
	@PostMapping("/items")
	@PreAuthorize(ITEM_VIEW_PERMISSION + PreAuthorizeDetails.OR
			+ "isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	public PagedRestResponse<List<ItemDto>> getItems(
			@ApiParam(name = "body", value = "Item search object to search details of an item", required = true) @RequestBody @Valid ItemSearchRequestDto itemSearchRequestDto,
			@ApiParam(value = "TEP transaction", allowableValues = "TEP") @RequestParam(required = false) String searchType,
			@ApiIgnore Pageable pageable) throws JSONException {
		return productService.getItems(itemSearchRequestDto, searchType, pageable);
	}

	//@formatter:off
	@ApiOperation(value="Search stone details",notes="This API is to search stone details based on below filters.<br>"
			+ "<ul>"
			+ "<li>stoneCode</li>"
			+ "<li>range (fromStdValue-toStdValue)</li>"
			+ "<li>color</li>"
			+ "<li>productCategoryCode</li>"
			+ "<li>stoneTypeCode</li>"
			+ "<li>quality</li>"
			+ "<li>ratePerCarat</li>"
			+ "</ul>")
	//@formatter:on
	@ApiPageable
	@PostMapping("/stones")
	@PreAuthorize(STONE_VIEW_PERMISSION)
	public PagedRestResponse<List<StoneDto>> getStones(
			@ApiParam(name = "body", value = "Stone search object to search details of a stone", required = true) @RequestBody @Valid StoneSearchRequestDto stoneSearchRequestDto,
			@ApiIgnore Pageable pageable) {
		return productService.getStones(stoneSearchRequestDto, pageable);
	}

	@ApiOperation(value = "Get stone details based on item code", notes = "This API is to get the stone details based on item code."
			+ "***(lot stone mapping listing)***")

	@GetMapping("{itemCode}/stones")
	public ListResponse<ItemStoneDto> getItemStones(
			@ApiParam(name = "itemCode", value = "'itemCode' to get Item stone details", required = true) @PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true) String itemCode) {
		return productService.getItemStones(itemCode);
	}

	@ApiOperation(value = "View the list of Item stone mapping details", notes = "This API returns the list of Item stone mapping details based on **isActive**")
	@GetMapping("/items/stones")
	public ItemLotStoneListDto getLotStoneDetails(
			@RequestParam("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@RequestParam(required = false) Boolean isDICheck) {
		return productService.getLotItemStonesWithDICheck(itemCode, lotNumber,isDICheck, true);
	}

	@ApiOperation(value = "View the list of item details ", notes = "This API returns the list of item details based on **itemCodeList** ")
	@GetMapping("/items/details")
	public Map<String, ItemDetailsDto> listItemDetails(
			@RequestParam(name = "itemCodes", required = true) List<@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String> itemCodes) {

		return productService.listItemDetails(itemCodes);

	}

	@ApiOperation(value = "View the list of Complexity details", notes = "This API returns the list of Complexity details based on **isActive**")
	@GetMapping("/complexities")
	@ApiPageable
	public PagedRestResponse<List<ComplexityDto>> listComplexity(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return productService.listComplexity(isActive, pageable);
	}

	@ApiOperation(value = "View the list of Purity details", notes = "This API returns the list of Purity details based on **isActive**")
	@GetMapping("/purities")
	@ApiPageable
	public PagedRestResponse<List<PurityDto>> listPurity(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) BigDecimal purity,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX) String itemTypeCode,
			@ApiIgnore Pageable pageable) {
		return productService.listPurity(isActive, purity, itemTypeCode, pageable);
	}
	
	@ApiOperation(value = "get the item details based on itemCode", notes = "This API returns the item details based on itemCode")
	@GetMapping("/itemDetails")
	public ItemsDto getItemDetails(@RequestParam("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode) {
		return productService.getItemDetails(itemCode);
	}
	
	@GetMapping("{itemCode}/co-stonesdetails")
	public ListResponse<ItemStoneDto> getItemStonesforCO(
			@ApiParam(name = "itemCode", value = "'itemCode' to get Item stone details", required = true) @PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true) String itemCode) {
		return productService.getItemStonesForCO(itemCode);
	}
	
	@GetMapping("/stone-details")
	public ItemStoneDetailsDto getItemandStoneDetails(
			@ApiParam(name = "itemCode", value = "'itemCode' to get Item details", required = true) @RequestParam("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true) String itemCode,
			@ApiParam(name = "lotNumber", value= " 'lotNumber' to get stone details", required = true) @RequestParam("lotNumber") @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX, nullCheck = true) String lotNumber){
		return productService.getItemAndStoneDetails(itemCode,lotNumber);
	}
	
	
	@PostMapping("/stones-details")
	@PreAuthorize(PRODUCT_MASTER_ADD_EDIT_PERMISSION)
	public ItemStoneDetailsDto saveItemAndLotDetails(
			@ApiParam(name = "itemCode", value = "'itemCode' to get Item details", required = true) @RequestParam("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true) String itemCode,
			@ApiParam(name = "lotNumber", value= " 'lotNumber' to get stone details", required = true) @RequestParam("lotNumber") @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX, nullCheck = true) String lotNumber){
		return productService.saveItemAndLotDetails(itemCode,lotNumber);
	}
	
	
}
