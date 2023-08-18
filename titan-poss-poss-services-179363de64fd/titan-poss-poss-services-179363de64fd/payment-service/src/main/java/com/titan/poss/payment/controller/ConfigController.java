/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CONFIG_CONTROLLER;

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

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.constant.ConfigTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.MappedConfigResponseDto;
import com.titan.poss.core.dto.MappedLocationDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dto.TransactionTypeCountDto;
import com.titan.poss.payment.dto.request.ConfigDetailsUpdate;
import com.titan.poss.payment.dto.request.ConfigRequestDto;
import com.titan.poss.payment.dto.request.CustomerConfigRequestDto;
import com.titan.poss.payment.dto.response.ConfigDetailsDto;
import com.titan.poss.payment.dto.response.ConfigLocationResponseDto;
import com.titan.poss.payment.dto.response.ConfigMasterDto;
import com.titan.poss.payment.dto.response.CustomerConfigDetailsDto;
import com.titan.poss.payment.service.ConfigService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(PAYMENT_CONFIG_CONTROLLER)
@RequestMapping("payment/v2/payment-configs")
public class ConfigController {

	private static final String PAYMENT_CONFIG_DETAILS_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.PAYMENT_CONFIGURATIONS_VIEW + PreAuthorizeDetails.END + PreAuthorizeDetails.OR
			+ PreAuthorizeDetails.START + ConfigAccessControls.CUSTOMER_CONFIGURATIONS_VIEW + PreAuthorizeDetails.END;

	private static final String PAYMENT_CONFIG_DETAILS_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.PAYMENT_CONFIGURATIONS_ADD_EDIT + PreAuthorizeDetails.END + PreAuthorizeDetails.OR
			+ PreAuthorizeDetails.START + ConfigAccessControls.CUSTOMER_CONFIGURATIONS_ADD_EDIT
			+ PreAuthorizeDetails.END;

	private static final String PAYMENT_CONFIGURATIONS_VIEW_PERMISSION = "hasPermission(#configType,'PAYMENT_CONFIG')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.PAYMENT_CONFIGURATIONS_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'CUSTOMER_CONFIG')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.CUSTOMER_CONFIGURATIONS_VIEW
			+ PreAuthorizeDetails.END;

	private static final String PAYMENT_CONFIGURATIONS_ADD_EDIT_PERMISSION = "hasPermission(#configType,'PAYMENT_CONFIG')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.PAYMENT_CONFIGURATIONS_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'CUSTOMER_CONFIG')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START
			+ ConfigAccessControls.CUSTOMER_CONFIGURATIONS_ADD_EDIT + PreAuthorizeDetails.END;

	private static final String PAYMENT_CONFIGURATIONS_CREATE_PERMISSION = "hasPermission(#configRequestDto.configType,'PAYMENT_CONFIG')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.PAYMENT_CONFIGURATIONS_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR
			+ "hasPermission(#configRequestDto.configType,'CUSTOMER_CONFIG')" + PreAuthorizeDetails.AND
			+ PreAuthorizeDetails.START + ConfigAccessControls.CUSTOMER_CONFIGURATIONS_ADD_EDIT
			+ PreAuthorizeDetails.END;

	@Autowired
	private ConfigService paymentConfigService;

	/**
	 * This method will return the list of Configuration Details based on the
	 * configId, isActive.
	 * 
	 * @param isActive
	 * @return ListResponse<ConfigDto>
	 */
	@ApiOperation(value = "View the list of Configuration Details", notes = "This API returns the list of Configuration Details based on filters applied.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(PAYMENT_CONFIGURATIONS_VIEW_PERMISSION)
	public PagedRestResponse<List<ConfigMasterDto>> listConfig(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(message = PaymentConstants.INVALID_DESCRIPTION, regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String description,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId,
			@RequestParam(required = false) @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@ApiIgnore Pageable pageable) {
		return paymentConfigService.listConfig(isActive, pageable, description, configId, configType);
	}

	/**
	 * This method will return the Configuration details based on the configId.
	 * 
	 * @param configId
	 * @return ConfigDto
	 */
	@ApiOperation(value = "View the Configuration Details based on the configId", notes = "This API returns the Configuration Details based on the **configId** and **Description**"
			+ "Description Should be alphanumeric and size is should be less than 100 and allowed Special character:_ space ? \\ % / ( ) [ ] & , - . \" # < = > + ' @ : ")
	@GetMapping(value = "/{config-id}")
	@PreAuthorize(PAYMENT_CONFIG_DETAILS_VIEW_PERMISSION)
	public ConfigMasterDto getConfig(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId) {
		return paymentConfigService.getConfig(configId);
	}

	/**
	 * This method will save the Configuration details.
	 * 
	 * @param configRequestDto
	 * @return ConfigDto
	 */
	// @formatter:off
	@ApiOperation(value = "Save the Configuration Details", notes = "This API saves the Configuration Details<br>"
			+ "configRequestDto:-<br>"
			+ "1. description :- Description about Config Details and Description Should be alphanumeric and size is should be less than 100 and allowed Special character:_ space ? \\\\ % / ( ) [ ] & , - . \\\" # < = > + ' @ : <br>"
			+ "2. configType :- Allowed Values are PAYMENT_CONFIG or CUSTOMER_CONFIG<br>"
			+ "3. isActive :- it should be true or false.<br>"
			)
	// @formatter:on
	@PostMapping
	@PreAuthorize(PAYMENT_CONFIGURATIONS_CREATE_PERMISSION)
	public ConfigMasterDto addConfig(
			@RequestBody @Valid @ApiParam(name = "body", value = "Configuration that needs to be created", required = true) ConfigRequestDto configRequestDto) {
		return paymentConfigService.addConfig(configRequestDto);
	}

	/**
	 * This method will update the Configuration Details.
	 * 
	 * @param configId
	 * @param isActive
	 * @return ConfigDto
	 */
	// @formatter:off
	@ApiOperation(value = "Update the Configuration Details based on configId", notes = "This API updates the Configuration Details <br/> if **isActive** is false, then it will be soft deleted based on the **configId** and description is not editable"
			+ "1. isActive :- it should be true or false.<br>")
	// @formatter:on
	@PatchMapping(value = "/{config-id}")
	@PreAuthorize(PAYMENT_CONFIG_DETAILS_ADD_EDIT_PERMISSION)
	public ConfigMasterDto updateConfig(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId,
			@RequestParam(required = false) Boolean isActive) {
		return paymentConfigService.updateConfig(configId, isActive);
	}

	/**
	 * This method will return the list of Payment Configuration based on the
	 * paymentConfig, isActive.
	 * 
	 * @param transactionTypes
	 * @param paymentCodes
	 * @param configId
	 * @return PagedRestResponse<List<ConfigDetailsDto>>
	 */
	@ApiOperation(value = "View the list of Payment Configuration Details based on transactionTypes,paymentCodes, and configId", notes = "This API returns the list of Payment Configuration Details based on **isActive** and **configId** and **transactionTypes** and **paymentCodes**"
			+ "</br></br>::::In this Api user will be able to filter based on transactionType and paymentCodes for particular configId::::</br>"
			+ "transactionTypes is Enum and allowed values= CM,AB,ADV")
	@GetMapping(value = "/{config-id}/details")
	@PreAuthorize(PAYMENT_CONFIG_DETAILS_VIEW_PERMISSION)
	public ConfigDetailsDto listConfigDetails(
			@RequestParam(required = false) @ApiParam(required = false, value = "Transaction Type", allowableValues = "CM,AB,ADV") List<@ValueOfEnum(message = PaymentConstants.INVALID_TRANSACTION_TYPE, enumClass = TransactionTypeEnum.class) String> transactionTypes,
			@RequestParam(required = false) List<@PatternCheck(message = PaymentConstants.INVALID_PAYMENT_CODE, regexp = RegExConstants.PAYMENT_CODE_REGEX) String> paymentCodes,
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId) {
		return paymentConfigService.listConfigDetails(configId, transactionTypes, paymentCodes);
	}

	/**
	 * This method will update the Payment Configuration Details.
	 * 
	 * @param configId
	 * @param configDetailsUpdate
	 * @return ListResponse<ConfigDetailsDto>
	 */
	@ApiOperation(value = "Update the Payment Configuration Details based on configId", notes = "This API updates the Payment Configuration Details<br/> if **isActive** is false, then it will be hard deleted based on the **configDetailId**"
			+ "</br></br>::::This api will take Remove Config, Update Config and Add Config in request body::::</br>"
			+ "</br></t>::::remove Config will be hard delete based on the configDetailId::::</br>"
			+ "</br></t>::::Update Config will be based on ConfigDetailId  pass in request body::::</br>"
			+ "</br></t>::::In Add Config config details will be save::::</br>"
			+ "</br> Find config details JSON link</br> "
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/payment-service/src/main/resources/com/titan/poss/payment/json/PaymentConfigDetails.json/\">"
			+ "PAYEMENT_CONFIG_DETAILS" + "</a>" + "</br></br>" + "  </li>")
	@PatchMapping(value = "/{config-id}/details")
	@PreAuthorize(PAYMENT_CONFIG_DETAILS_ADD_EDIT_PERMISSION)
	public ConfigDetailsDto updateConfigDetails(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId,
			@RequestBody @Valid @ApiParam(name = "body", value = "Config Details Mapping that needs to be created", required = true) ConfigDetailsUpdate configDetailsUpdate) {
		return paymentConfigService.updateConfigDetails(configId, configDetailsUpdate);
	}

	/**
	 * This API will return the count of transaction type according to payment mode.
	 * 
	 * @param configId
	 * @return TransactionTypeCountDto
	 */
	@GetMapping(value = "/{config-id}/count")
	@PreAuthorize(PAYMENT_CONFIG_DETAILS_VIEW_PERMISSION)
	@ApiOperation(value = "This API will return the count of transaction type according to payment mode.", notes = "This API will return the count of transaction type according to payment mode.")
	public ListResponse<TransactionTypeCountDto> getTransactionTypeCount(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId) {

		return paymentConfigService.getTransactionTypeCount(configId);
	}

	/**
	 * This method will update the Payment Configuration Details.
	 * 
	 * @param configId
	 * @param configDetailsDto
	 * @return ListResponse<ConfigDetailsDto>
	 */
	@ApiOperation(value = "Update the Payment Customer Configuration Details based on configId", notes = "This API creates the Payment Customer Configuration Details<br/> if **isActive** is false, then it will be hard deleted based on the **configDetailId**"
			+ "</br></br>::::This api will take Remove Config, Add Config in request body::::</br>"
			+ "</br></t>::::remove Config will be hard delete based on the configDetailId::::</br>"
			+ "</br></t>::::In Add Config config details will be save::::</br>")
	@PatchMapping(value = "/{config-id}/customer-details")
	@PreAuthorize(PAYMENT_CONFIG_DETAILS_ADD_EDIT_PERMISSION)
	public CustomerConfigDetailsDto createCustomerTypeDetails(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId,
			@RequestBody @Valid @ApiParam(name = "body", value = "Customer Config Details Mapping that needs to be created", required = true) CustomerConfigRequestDto configDetailsDto) {
		return paymentConfigService.createCustomerConfigDetails(configId, configDetailsDto);
	}

	/**
	 * This method will return the list of Payment Customer Configuration based on
	 * the paymentConfig, isActive.
	 * 
	 * @param transactionTypes
	 * @param customerType
	 * @param configId
	 */
	@ApiOperation(value = "View the list of Payment Customer Configuration Details based on configId", notes = "This API returns the list of Payment-Customer Configuration Details based on **isActive** and **configId**")
	@GetMapping(value = "/{config-id}/customer-details")
	@PreAuthorize(PAYMENT_CONFIG_DETAILS_VIEW_PERMISSION)
	public CustomerConfigDetailsDto listCustomerConfigDetails(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId) {
		return paymentConfigService.listCustomerConfigDetails(configId);
	}

	/**
	 * This method will return the list of location codes based on configId,
	 * 
	 * @param configId
	 * @return List<LocationCodeDto>
	 */
	@GetMapping(value = "/{config-id}/locations")
	@ApiOperation(value = "View the list of Mapped location codes based on requested configId", notes = "This API returns the list of Mappped location codes based on **config-id**")
	@PreAuthorize(PAYMENT_CONFIGURATIONS_VIEW_PERMISSION)
	public ListResponse<MappedConfigResponseDto> getLocationCodes(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId,
			@RequestParam("config-type") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType) {
		return paymentConfigService.getLocationCodes(configId, configType);
	}

	/**
	 * This method will return the list of location codes which is already mapped to
	 * configId based on location Codes,
	 * 
	 * @param mappedLocationDto,
	 * @return List<MappedConfigResponseDto>
	 */
	@PostMapping(value = "/locations")
	@ApiOperation(value = "View the list of Unique location codes and configId which is already mapped", notes = "This API returns the list of Unique location codes and configId already mapped"
			+ "</br></br> It takes the following filters:</br>"
			+ "</br></t> 1. includeLocations: list of locationCodes to be included</br>"
			+ "</br></t> 2. excludeConfigId: configId to be excluded</br>")
	@PreAuthorize(PAYMENT_CONFIGURATIONS_VIEW_PERMISSION)
	public ListResponse<MappedConfigResponseDto> getMappedLocationCodes(
			@RequestParam("configType") @ValueOfEnum(enumClass = ConfigTypeEnum.class) @ApiParam(required = true, value = "Config Type", allowableValues = "PAYMENT_CONFIG,CUSTOMER_CONFIG") String configType,
			@Valid @RequestBody MappedLocationDto mappedLocationDto) {

		return paymentConfigService.getMappedLocationCodes(configType, mappedLocationDto);
	}

	/**
	 * This method will create/remove mapping between Payment Configuration Id and
	 * locations.
	 * 
	 * @param configId
	 * @param configLocationDto
	 * @return ConfigLocationDto
	 */
	@PatchMapping(value = "/{config-id}/locations")
	@PreAuthorize(PAYMENT_CONFIGURATIONS_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Create/Remove/Overwrite Mapping between config Id and locations", notes = "This API creates/removes Mapping between configId and locations"
			+ "</br></br>It takes the following inputs:</br>"
			+ "</br></t> addLocations: locationCodes will be mapped to respected config Id</br>"
			+ "</br></t> overwriteLocations : already mapped locations will be overwritten and locationCodes will be mapped to respected configId\r\n"
			+ "</br></t> removeLocations: will delete the locations mapped to configID - hard delete</br>")
	public ConfigLocationResponseDto locationsMappings(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String configId,
			@RequestParam("config-type") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestBody @Valid @ApiParam(name = "body", value = "Config Location Mapping that needs to be created", required = true) ConfigLocationResponseDto configLocationDto) {
		return paymentConfigService.locationsMappings(configId, configType, configLocationDto);
	}

}