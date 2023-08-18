/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/

package com.titan.poss.config.controller;

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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.config.dto.FocSchemeDetailDto;
import com.titan.poss.config.dto.FocSchemeDetailsListDto;
import com.titan.poss.config.dto.request.FocItemMappingRequestDto;
import com.titan.poss.config.dto.request.FocLocationRequestDto;
import com.titan.poss.config.dto.request.FocSchemeAddDto;
import com.titan.poss.config.dto.request.FocSchemeUpdateDto;
import com.titan.poss.config.dto.request.FocUpdateProductDto;
import com.titan.poss.config.dto.response.FocItemMappingResponseDto;
import com.titan.poss.config.dto.response.FocLocationResponseDto;
import com.titan.poss.config.dto.response.FocProductDto;
import com.titan.poss.config.dto.response.FocSchemeDetailResponseDto;
import com.titan.poss.config.dto.response.FocSchemeHeaderDto;
import com.titan.poss.config.dto.response.FocSchemeResponseDto;
import com.titan.poss.config.service.FocService;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Validated
@RestController
@RequestMapping("config/v2/foc-schemes")
public class FocController {

	@Autowired FocService focService;
	
	private static final String FOC_ADD_EDIT_PERMISSIONS = PreAuthorizeDetails.START
			+ ConfigAccessControls.FOC_AT_CUST_TRANSACTION_ADD_EDIT + PreAuthorizeDetails.END 
			+ ConfigAccessControls.FOC_AT_LOC_TRANSACTION_ADD_EDIT + PreAuthorizeDetails.END 
			+ ConfigAccessControls.FOC_SCHEME_ADD_EDIT + PreAuthorizeDetails.END;

	private static final String FOC_VIEW_PERMISSIONS = PreAuthorizeDetails.START + ConfigAccessControls.FOC_AT_CUST_TRANSACTION_VIEW + PreAuthorizeDetails.END 
			+ PreAuthorizeDetails.OR + PreAuthorizeDetails.START + ConfigAccessControls.FOC_AT_LOC_TRANSACTION_VIEW + PreAuthorizeDetails.END 
			+ PreAuthorizeDetails.OR + PreAuthorizeDetails.START + ConfigAccessControls.FOC_SCHEME_VIEW + PreAuthorizeDetails.END;

	
	private static final String FOC_SCHEME_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.FOC_SCHEME_VIEW + PreAuthorizeDetails.END;

	private static final String FOC_SCHEME_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.FOC_SCHEME_ADD_EDIT + PreAuthorizeDetails.END;

	/**
	 * This method save FOCScheme definition details
	 * 
	 * @param FocSchemeAddDto
	 * @return FocSchemeResponseDto
	 */
	// @formatter:off
	@ApiOperation(value = "Creates the scheme definition", notes = "This API creates the scheme definition<br>"
			+ "Name :-  Scheme Name should be alphanumeric.<br>"
			+ "Description :- size should be less than 250.<br>"
			+ "isActive :- it should be true or false.\r\n"
			+ "<span style=\"font-size:14px;\">Find Below the HyperLinks of Json Format for the details:</span>\r\n" 
			+ "	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GrnConfig.json/\">"+
				"GRN_CONFIG"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
			+ "	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepConfig.json/\">"+
				"TEP_CONFIG"+
				"</a>"+
				"</br></br>" +
			"  </li>" 	
			 +"	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/OrderConfig.json/\">"+
				"ORDER_CONFIG"+
				"</a>"+
				"</br></br>" +
			"  </li>" 	
			+ "	<li>" +
				"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/FocClubbingConfig.json/\">"+
				"CLUBBING_CONFIG"+
				"</a>"+
				"</br></br>" +
			"  </li>" 
			 )
			
	@PostMapping
	@PreAuthorize(FOC_SCHEME_ADD_EDIT_PERMISSION)
	public FocSchemeResponseDto createScheme(@Valid @RequestBody FocSchemeAddDto focSchemeAddDto) {
		return focService.createScheme(focSchemeAddDto);
	}
	
	/**
	 * This method will return the updated FOCScheme definition details based on the
	 * SchemeId.
	 * 
	 * @param id
	 * @return FocSchemeResponseDto
	 */
	@ApiOperation(value = "updates the scheme definition ", notes = "This API updates the scheme definition based on **SchemeId**<br>"
			+ "</br>Note: we cannot edit the header details if manualFoc = true in DB or for below SchemeNames</br>"
			+ "</br>1. FOC_BLOCKING_FOR_CUSTOMER" 
			+ "</br>2. FOC_BLOCKING_FOR_STORE" )		
	@PatchMapping("/{id}")
	@PreAuthorize(FOC_SCHEME_ADD_EDIT_PERMISSION)
	public FocSchemeResponseDto updateScheme( @PathVariable(value = "id", required = true) String id,
			@RequestBody FocSchemeUpdateDto focSchemeUpdateDto) {
		return focService.updateScheme(id, focSchemeUpdateDto);
	}
	
	/**
	 * This method will return FOCScheme definition 
	 * 
	 * @param id
	 * @param schemeName
	 * @return FocSchemeResponseDto
	 */
	@ApiOperation(value = "API to get FOC Scheme definition based on schemeId or schemeName", notes = "API will return FOC Scheme definition based on filters")
	@GetMapping
	@PreAuthorize(FOC_VIEW_PERMISSIONS)
	public FocSchemeResponseDto getScheme(@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id, @RequestParam(required = false) String schemeName) {
		return focService.getScheme(id, schemeName);
		
	}

	/**
	 * This method will return all FOCScheme definition 
	 * 
	 * @param 
	 * @return List<FocSchemeResponseDto>
	 */
	@ApiOperation(value = "API to get the list of FOC Scheme definition details", notes = "This API returns the FOCScheme definition details"
	 + "Filters Include -schemeId and schemeName " )
	@GetMapping("/list")
	@PreAuthorize(FOC_VIEW_PERMISSIONS)
	@ApiPageable
	public PagedRestResponse<List<FocSchemeHeaderDto>> getAllScheme(@RequestParam(required = false) String schemeName,@ApiIgnore Pageable pageable) {
		return focService.getAllScheme(schemeName,pageable);
	}
	
	/**
	 * This method will return the updated FOCScheme details based on the
	 * SchemeId.
	 * 
	 * @param id
	 * @return FocSchemeDetailDto
	 */
	@ApiOperation(value = "This API will add or update Scheme Details ", notes = "This API add or update Scheme Details based on **schemeId** <br>"
			+ "It takes the following inputs:</br>"
			+ "addSchemeDetails: add scheme details for a scheme</br>"
			+ "updateSchemeDetails : update scheme detail for a given scheme detail id\r\n" 
			+ "Under SchemeDetails :- \r\n"
			+ "1. Category can contain <b>VALUE_BASED or WEIGHT_BASED</b><br> \r\n"
			+ "2. ItemType can contain <b>GOLD_COIN or OTHERS</b><br> \r\n"
			+ "3. OfferType can contain <b>STANDARD or SLAB</b><br> \r\n"
			+ "4. FocEligibility can contain any one among the following fields.<br> \r\n"
			+ "<ul>"
			+ "	<li>PRE_DISCOUNT_TAX</li>"
			+ "	<li>PRE_DISCOUNT_WITHOUT_TAX</li>"
			+ "	<li>POST_DISCOUNT_TAX</li>"
			+ "	<li>POST_DISCOUNT_WITHOUT_TAX</li>"
			+ "	<li>GROSS_WEIGHT</li>"
			+ "	<li>NET_WEIGHT</li>"
			+"</ul>")
	@PatchMapping("/{id}/scheme-details")
	@PreAuthorize(FOC_SCHEME_ADD_EDIT_PERMISSION)
	public ListResponse<FocSchemeDetailResponseDto> updateSchemeDetails( @PathVariable(value = "id", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody @Valid FocSchemeDetailDto focSchemeDetailDto) {
		return focService.updateSchemeDetails(id, focSchemeDetailDto);
	}

	/**
	 * This method will return the FOCScheme details based on the SchemeId.
	 * 
	 * @param id
	 * @return FocSchemeDetailsDto
	 */
	@ApiOperation(value = "API to get FOC Scheme details based on the schemeId", notes = "This API returns the FOCScheme details based on the schemeId and Filters Applied"
			+ "Filters Include -category,itemType,offerType,productGroupCode " )
	
	@GetMapping("/{id}/scheme-details")
	@PreAuthorize(FOC_SCHEME_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<FocSchemeDetailsListDto>> getSchemeDetails( @PathVariable(value = "id", required = true) String id, 
			 @RequestParam(required = false) String category, @RequestParam(required = false) String itemType,
			 @RequestParam(required = false) String offerType,@RequestParam(required = false) String productGroupCode
			 ,@ApiIgnore Pageable pageable) {
		return focService.getSchemeDetails(id, pageable, category, itemType, offerType,productGroupCode);
	}
	
	/**
	 * This method will return the list of locations mapped to a scheme SchemeId.
	 * 
	 * @param id
	 * @return FocLocationMappingDto
	 */
	@ApiOperation(value = "API to do the location mapping for a scheme", notes = "TAPI to do the location mapping for a scheme </br>"
			+ "Find Below the HyperLinks of Json Format for ConfigDetails of FOC_BLOCKING_FOR_STORE and FOC_BLOCKING_FOR_CUSTOMER" 
			+ "	<li>" +
			"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/FocStoreDetails.json/\">"+
			"FOC_BLOCKING_FOR_STORE"+
			"</a>"+
			"</br></br>" +
		"  </li>" 
		+ "	<li>" +
		"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/FocCustomerDetails.json/\">"+
		"FOC_BLOCKING_FOR_CUSTOMER"+
		"</a>"+
		"</br></br>" +
	"  </li>" 
			)
	@PatchMapping("/{id}/locations")
	@PreAuthorize(FOC_SCHEME_ADD_EDIT_PERMISSION)
	public ListResponse<FocLocationResponseDto> updateLocation( @PathVariable(value = "id", required = true) String id, 
			@RequestBody FocLocationRequestDto focLocationRequestDto) {
	
		return focService.updateLocation(id,focLocationRequestDto);
	}
	

	/**
	 * This method will return the list of locations mapped to a scheme SchemeId.
	 * 
	 * @return FocLocationMappingDto
	 */
	@ApiOperation(value = "API returns locations mapped with FOC BLOCKING FOR CUSTOMER or FOC BLOCKING FOR STORE", notes = "API returns locations mapped with FOC BLOCKING FOR CUSTOMER or FOC BLOCKING FOR STORE")
	@GetMapping("/locations")
	@PreAuthorize(FOC_SCHEME_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List< FocLocationResponseDto >> getLocationForManualFoc(
			@RequestParam(required = true)  String schemeName, 
			@RequestParam(value = "locationCode",  required = false) String locationCode,
			@ApiIgnore Pageable pageable) {
	
		return focService.getLocationForManualFoc(schemeName,locationCode, pageable);
	}
	
	/**
	 * This method will return the list of locations mapped to a scheme SchemeId.
	 * 
	 * @param id
	 * @return FocLocationMappingDto
	 */
	@ApiOperation(value = "API to get location mapped with scheme", notes = "This API returns the location based on schemeId")
	@GetMapping("/{id}/locations")
	@PreAuthorize(FOC_SCHEME_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List< FocLocationResponseDto >> getLocationOnScheme( @PathVariable(value = "id", required = true) String id, 
			@RequestParam(value = "locationCode", required = false) String locationCode,
			@ApiIgnore Pageable pageable) {
	
		return focService.getLocationOnScheme(id,locationCode, pageable);
	}
	
	@ApiOperation(value = "API to map list of Item for a FocScheme", notes = "This API returns list of items mapped to a FocScheme")
	@PatchMapping("/{id}/items")
	@PreAuthorize(FOC_SCHEME_ADD_EDIT_PERMISSION)
	public ListResponse <FocItemMappingResponseDto> addFocItem(@PathVariable String id, @RequestBody FocItemMappingRequestDto focItemMappingRequestDto) {
		return focService.addFocItem(id, focItemMappingRequestDto);
		
	}
	
	@ApiOperation(value = "API to get Item list ", notes = "This API returns item list mapped to given schemeId")
	@GetMapping("/{id}/items")
	@PreAuthorize(FOC_SCHEME_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<FocItemMappingResponseDto>> getItems(@PathVariable String id, @RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20) String itemCode, @ApiIgnore Pageable pageable ){
		return focService.getItem(id, itemCode, pageable);
		
	}
	
	@ApiOperation(value = "API to add/remove product for a FocScheme", notes = "This API returns mapped product list</br>"
			+ "It takes the following inputs:</br>"
			+ "1. addProducts: List of productGroupCodes to be added</br>"
			+ "2. removeProducts : List of productGroupCodes to be removed \r\n" 
			+ "3. schemedetailsId: This is Optional field. which will be null for Slab based focSchemeId\r\n" 
			)
	@PatchMapping("/{id}/products")
	@PreAuthorize(FOC_SCHEME_ADD_EDIT_PERMISSION)
	public ListResponse <FocProductDto> updateProducts(@PathVariable String id, @RequestParam(required = false) String schemedetailsId, @RequestBody FocUpdateProductDto updateProductDto) {
		return focService.updateProducts(id, schemedetailsId, updateProductDto);
	
	}
	
	@ApiOperation(value = "API to get products mapped to a FocSchemeId", notes = "This API returns product list mapped to a FocSchemeId"
			+ "Category & scheme_details_id both should not be null "
			+ "1. when category passed, it will give products mapped w.r.t slab based foc scheme for the given category"
			+ "2. when scheme_details_id passed, it will give products mapped to standard based foc of respective category")
	@GetMapping("/{id}/products")
	@PreAuthorize(FOC_SCHEME_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<FocProductDto>> getProducts(@PathVariable String id, 
			@RequestParam(required = false) String schemedetailsId,@RequestParam(required = false) String category,@RequestParam(required = false) String itemType, @ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable){
		return focService.getProducts(id, schemedetailsId,category,itemType, pageable,isPageable);
		
	}
	
	/**
	 * This method will publish the Discount tables.
	 * 
	 * @param discountId
	 */
	@ApiOperation(value = "This Api will publish FOC tables", notes = "This API will publish FOC tables")
	@PostMapping("/publish/{focSchemeId}")
	@PreAuthorize(FOC_SCHEME_ADD_EDIT_PERMISSION)
	public void publishFoc(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String focSchemeId) {

		focService.publishFocScheme(focSchemeId);
	}
}
