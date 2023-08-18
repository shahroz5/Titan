/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.payment.constants.PaymentConstants.LOV_CONTROLLER;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.titan.poss.core.domain.acl.PaymentAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.payment.constants.LovTypeEnum;
import com.titan.poss.payment.dto.LovCreateDto;
import com.titan.poss.payment.dto.request.LovUpdateDto;
import com.titan.poss.payment.dto.response.LovDto;
import com.titan.poss.payment.dto.response.LovTypesDto;
import com.titan.poss.payment.service.LovService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(LOV_CONTROLLER)
@RequestMapping("payment/v2/lovs")
public class LovController {

	// @formatter:off
	private static final String LOV_TYPE_VIEW_PERMISSION = 
			"hasPermission(#lovType,'GIFT_CARD_TYPE')" + AND + START + PaymentAccessControls.GIFT_CARD_TYPE_VIEW + END + OR + 
			"hasPermission(#lovType,'CUSTOMER_TYPE')" + AND + START + PaymentAccessControls.CUSTOMER_TYPE_VIEW + END + OR + 
			"hasPermission(#lovType,'OCCASION_TYPE')" + AND + START + PaymentAccessControls.OCCASSION_TYPE_VIEW + END + OR + 
			"hasPermission(#lovType,'OTHER_CHARGES_REASONS')"+ AND + START + PaymentAccessControls.OTHER_CHARGES_REASONS_VIEW + END + OR + 
			"hasPermission(#lovType,'SALUTATION')"+ AND + START + PaymentAccessControls.SALUTATION_VIEW + END + OR + 
			"hasPermission(#lovType,'PAYMENT_GROUP')"+ AND + START + PaymentAccessControls.PAYMENT_GROUP_VIEW + END + OR + 
			"hasPermission(#lovType,'ID_PROOF')"+ AND + START + PaymentAccessControls.ID_PROOF_VIEW + END + OR + 
			"hasPermission(#lovType,'GRN_REASON_TYPE')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_VIEW + END + OR +
			"hasPermission(#lovType,'TATA_COMPANY')"+  OR +
			"hasPermission(#lovType,'REFUND_PAYMENT_MODE')"+  OR +
			"hasPermission(#lovType,'INVOICE_TYPE')"+  OR +
			"hasPermission(#lovType,'REASON_FOR_CANCELLATION')" + OR +
			"hasPermission(#lovType, 'FULL_VALUE_TEP_REASON')"+ OR +
			"hasPermission(#lovType, 'REASON_FOR_NOT_GIVING_DISCOUNT')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_VIEW + END + OR +
			"hasPermission(#lovType, 'REASON_FOR_CHANGING_DISCOUNT')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_VIEW + END + OR + 
			"hasPermission(#lovType, 'RELATIONSHIP_TYPE')"+ AND + START + PaymentAccessControls.RELATION_TYPE_VIEW + END;
			

	private static final String LOV_TYPE_ADD_EDIT_PERMISSION = 
			"hasPermission(#lovCreateDto.lovType,'GIFT_CARD_TYPE')" + AND + START + PaymentAccessControls.GIFT_CARD_TYPE_ADD_EDIT + END + OR + 
			"hasPermission(#lovCreateDto.lovType,'CUSTOMER_TYPE')" + AND + START + PaymentAccessControls.CUSTOMER_TYPE_ADD_EDIT	+ END + OR + 
			"hasPermission(#lovCreateDto.lovType,'OCCASION_TYPE')"+ AND + START + PaymentAccessControls.OCCASSION_TYPE_ADD_EDIT + END + OR + 
			"hasPermission(#lovCreateDto.lovType,'OTHER_CHARGES_REASONS')" + AND+ START + PaymentAccessControls.OTHER_CHARGES_REASONS_ADD_EDIT + END + OR + 
			"hasPermission(#lovCreateDto.lovType,'SALUTATION')" + AND + START + PaymentAccessControls.SALUTATION_ADD_EDIT + END + OR + 
			"hasPermission(#lovCreateDto.lovType,'PAYMENT_GROUP')" + AND + START + PaymentAccessControls.PAYMENT_GROUP_ADD_EDIT + END + OR + 
			"hasPermission(#lovCreateDto.lovType,'ID_PROOF')" + AND	+ START + PaymentAccessControls.ID_PROOF_ADD_EDIT + END + OR + 
			"hasPermission(#lovCreateDto.lovType,'GRN_REASON_TYPE')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_ADD_EDIT + END + OR +
			"hasPermission(#lovCreateDto.lovType,'TATA_COMPANY')"+ OR +
			"hasPermission(#lovCreateDto.lovType,'REFUND_PAYMENT_MODE')" + OR +
			"hasPermission(#lovCreateDto.lovType,'INVOICE_TYPE')"+  OR +
			"hasPermission(#lovCreateDto.lovType, 'FULL_VALUE_TEP_REASON')"+ OR +
			"hasPermission(#lovCreateDto.lovType,'REASON_FOR_CANCELLATION')"+ OR +
			"hasPermission(#lovCreateDto.lovType, 'REASON_FOR_NOT_GIVING_DISCOUNT')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_ADD_EDIT + END + OR +
			"hasPermission(#lovCreateDto.lovType, 'REASON_FOR_CHANGING_DISCOUNT')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_ADD_EDIT + END + OR +
			"hasPermission(#lovCreateDto.lovType, 'RELATIONSHIP_TYPE')"+ AND + START + PaymentAccessControls.RELATION_TYPE_ADD_EDIT + END;

	private static final String LOV_TYPE_UPDATE_PERMISSION = 
			"hasPermission(#lovType,'GIFT_CARD_TYPE')" + AND + START + PaymentAccessControls.GIFT_CARD_TYPE_ADD_EDIT + END + OR + 
			"hasPermission(#lovType,'CUSTOMER_TYPE')" + AND + START + PaymentAccessControls.CUSTOMER_TYPE_ADD_EDIT + END + OR + 
			"hasPermission(#lovType,'OCCASION_TYPE')" + AND + START + PaymentAccessControls.OCCASSION_TYPE_ADD_EDIT + END + OR + 
			"hasPermission(#lovType,'OTHER_CHARGES_REASONS')" + AND + START + PaymentAccessControls.OTHER_CHARGES_REASONS_ADD_EDIT + END + OR + 
			"hasPermission(#lovType,'SALUTATION')" + AND + START + PaymentAccessControls.SALUTATION_ADD_EDIT + END + OR + 
			"hasPermission(#lovType,'PAYMENT_GROUP')" + AND + START + PaymentAccessControls.PAYMENT_GROUP_ADD_EDIT + END + OR + 
			"hasPermission(#lovType,'ID_PROOF')" + AND + START + PaymentAccessControls.ID_PROOF_ADD_EDIT + END + OR + 
			"hasPermission(#lovType,'GRN_REASON_TYPE')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_ADD_EDIT + END + OR + 
			"hasPermission(#lovType,'TATA_COMPANY')"+ OR +
			"hasPermission(#lovType,'REFUND_PAYMENT_MODE')" + OR +
			"hasPermission(#lovType,'INVOICE_TYPE')"+  OR +
			"hasPermission(#lovType, 'FULL_VALUE_TEP_REASON')"+ OR +
			"hasPermission(#lovType,'REASON_FOR_CANCELLATION')"+ OR +
			"hasPermission(#lovType, 'REASON_FOR_NOT_GIVING_DISCOUNT')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_ADD_EDIT + END + OR +
			"hasPermission(#lovType, 'REASON_FOR_CHANGING_DISCOUNT')"+ AND + START + PaymentAccessControls.GRN_REASON_TYPE_ADD_EDIT + END + OR +
			"hasPermission(#lovType, 'RELATIONSHIP_TYPE')"+ AND + START + PaymentAccessControls.RELATION_TYPE_UPDATE + END;
	// @formatter:on

	@Autowired
	private LovService lovService;

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	@ApiOperation(value = "View the list of lovTypes", notes = "This API returns the list of lovTypes")
	@GetMapping(value = "/lov-types")
//	@PreAuthorize(LOV_TYPE_VIEW_PERMISSION)
	public LovTypesDto getLovTypes() {
		return lovService.getLovTypes();
	}

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@ApiOperation(value = "View the Lov details", notes = "This API returns the Lov details based on **lovType**"
			+ "lovCode should be alphanumeric and size should be <= 50")
	@GetMapping(value = "/{lovType}")
	@PreAuthorize(LOV_TYPE_VIEW_PERMISSION)
	public LovDto getLov(
			@PathVariable("lovType") @ApiParam(required = true, value = "Lov Type", allowableValues = "PAYMENT_GROUP,CUSTOMER_TYPE,OCCASION_TYPE,OTHER_CHARGES_REASONS,SALUTATION,GIFT_CARD_TYPE, GRN_REASON_TYPE, TATA_COMPANY, REFUND_PAYMENT_MODE, INVOICE_TYPE, REASON_FOR_NOT_GIVING_DISCOUNT, REASON_FOR_CHANGING_DISCOUNT, RELATIONSHIP_TYPE") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_SPACE_REGEX_50) String lovCode) {
		return lovService.getLov(lovType, lovCode);
	}

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	@ApiOperation(value = "Create the Lov details", notes = "This API creates the Lov details based on **lovType**</br>"
			+ "lovCode and lovValue should be alphanumeric and size should be <= 50"
			+ "allowed lovType = TRANSACTION_TYPE, PAYMENT_GROUP, TATA_COMPANY, REASON_FOR_NOT_GIVING_DISCOUNT, REASON_FOR_CHANGING_DISCOUNT")
	@PostMapping
	@PreAuthorize(LOV_TYPE_ADD_EDIT_PERMISSION)
	public LovCreateDto createLov(
			@RequestBody @Valid @ApiParam(name = "body", value = "LOV that needs to be created", required = true) LovCreateDto lovCreateDto) {
		return lovService.createLov(lovCreateDto);
	}

	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	@ApiOperation(value = "Update the Lov details", notes = "This API updates the Lov details based on **lovType**"
			+ "lovCode and lovValue should be alphanumeric and size should be <= 50")
	@PatchMapping(value = "/{lovType}")
	@PreAuthorize(LOV_TYPE_UPDATE_PERMISSION)
	public LovDto updateLov(
			@PathVariable("lovType") @ApiParam(required = true, value = "Lov Type", allowableValues = "PAYMENT_GROUP,CUSTOMER_TYPE,OCCASION_TYPE,OTHER_CHARGES_REASONS,SALUTATION,GIFT_CARD_TYPE, GRN_REASON_TYPE, FULL_VALUE_TEP_REASON, TATA_COMPANY, REFUND_PAYMENT_MODE, INVOICE_TYPE, REASON_FOR_NOT_GIVING_DISCOUNT, REASON_FOR_CHANGING_DISCOUNT, RELATIONSHIP_TYPE") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType,
			@RequestBody @Valid @ApiParam(name = "body", value = "LOV that needs to be updated", required = true) LovUpdateDto lovUpdateDto) {
		return lovService.updateLov(lovType, lovUpdateDto);
	}

}
