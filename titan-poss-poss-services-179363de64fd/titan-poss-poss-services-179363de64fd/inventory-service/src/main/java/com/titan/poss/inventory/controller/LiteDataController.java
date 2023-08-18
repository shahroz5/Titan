package com.titan.poss.inventory.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dto.constants.BinRequestType;
import com.titan.poss.inventory.dto.response.BinCodeLiteDto;
import com.titan.poss.inventory.dto.response.BinDetailsDto;
import com.titan.poss.inventory.dto.response.BinGroupDto;
import com.titan.poss.inventory.dto.response.CourierDto;
import com.titan.poss.inventory.dto.response.RequestDocNoDto;
import com.titan.poss.inventory.service.BinGroupService;
import com.titan.poss.inventory.service.BinService;
import com.titan.poss.inventory.service.CourierService;
import com.titan.poss.inventory.service.InventoryDocMasterService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("InventoryLiteDataController")
@RequestMapping("inventory/v2/lite-data")
@Validated
public class LiteDataController {

	@Autowired
	private CourierService courierService;

	@Autowired
	private BinService binService;

	@Autowired
	private BinGroupService binGroupService;

	@Autowired
	private InventoryDocMasterService inventoryDocMasterService;

	public static final String STORE_USER = "isStoreUser()";

	/**
	 * This method will return the list of Courier details for specific store.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CourierDto>>
	 */
	@ApiPageable
	@ApiOperation(value = "API to fetch the list of Courier details for specific store.", notes = "This API will fetch the list of Courier details for specific store.")
	@GetMapping("/couriers")
	@PreAuthorize(STORE_USER)
	public ListResponse<CourierDto> listCourier(@RequestParam(required = false) Boolean isActive) {
		AuthUser p = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		ListResponse<CourierDto> courierList = null;
		if (!StringUtils.isEmpty(p.getLocationCode())) {
			courierList = courierService.listCouriersByLocation(isActive, p.getLocationCode());
		}

		return courierList;
	}

	/**
	 * This method will return the list of Bins based on binType.
	 * 
	 * @param binType
	 * @return ListResponse<BinDetailsDto>
	 */
	@GetMapping("/bins")
	@ApiOperation(value = "View the list of Bins", notes = "This API returns the list of Bins based on **binRequestType**")
	@PreAuthorize(STORE_USER)
	public ListResponse<BinDetailsDto> listBin(
			@RequestParam(required = true) @ApiParam(required = true, allowableValues = "ISSUE_BIN,RECEIVE_BIN", value = "Bin Request Enum") @ValueOfEnum(enumClass = BinRequestType.class) String binType) {

		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		UserTypeEnum userType = Enum.valueOf(UserTypeEnum.class, authUser.getLocType());

		return binService.listBin(binType, userType);

	}

	// need to review this api
	@GetMapping("/doc-no")
	@ApiOperation(value = "", notes = "")
	public RequestDocNoDto createReqDocNo(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(required = true) Short fiscalYear) {

		RequestDocNoDto requestDocNoDto = new RequestDocNoDto();

		requestDocNoDto.setReqDocNo(
				inventoryDocMasterService.getDocNumber(fiscalYear, locationCode, DocTypeEnum.STNREQUEST.toString()));

		return requestDocNoDto;

	}

	/**
	 * This method will return the list of Bin details based on the binGroupCode,
	 * locationCode, isActive and isPageable.
	 * 
	 * @param binGroupCode
	 * @param locationCode
	 * @param isActive
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BinCodeDto>>
	 */
	@GetMapping(value = "/{binGroupCode}/bins")
	@ApiOperation(value = "View the list of Bin details", notes = "This API returns the list of Bin details based on   **binGroupCode**, **locationCode**, **isActive** and **isPageable** <br/> if **isActive** is null, then it will return total list of Bin details based on **binGroupCode** and **locationCode**")
	@ApiPageable
	@PreAuthorize(STORE_USER)
	public PagedRestResponse<List<BinCodeLiteDto>> listBin(
			@PatternCheck(regexp = RegExConstants.BIN_GROUP_REGEX) @PathVariable("binGroupCode") String binGroupCode,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return binGroupService.listBinLite(binGroupCode, isPageable, pageable);
	}

	@GetMapping(value = "/bingroups")
	@ApiPageable
	@ApiOperation(value = "View the list of BinGroup details", notes = "This API returns the list of BinGroup details based on **isActive**, **locationCode** and **isPageable** <br/> if **isActive** is null, then it will return total list of BinGroup details")
	public PagedRestResponse<List<BinGroupDto>> listBinGroup(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return binGroupService.listBinGroup(isActive, locationCode, isPageable, pageable);
	}

}
