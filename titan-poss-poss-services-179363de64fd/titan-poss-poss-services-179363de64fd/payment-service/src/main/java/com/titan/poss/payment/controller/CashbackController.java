/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.controller;

import static com.titan.poss.payment.constants.PaymentConstants.CASHBACK_CONTROLLER;

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
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.payment.dto.CardDetailsUpdateDto;
import com.titan.poss.payment.dto.CashbackDto;
import com.titan.poss.payment.dto.CashbackOfferDto;
import com.titan.poss.payment.dto.CashbackOfferResponseDto;
import com.titan.poss.payment.dto.request.CashbackRequestDto;
import com.titan.poss.payment.dto.request.CashbackUpdateDto;
import com.titan.poss.payment.dto.response.CardDetailResponseDto;
import com.titan.poss.payment.dto.response.CashbackProductDto;
import com.titan.poss.payment.dto.response.CashbackProductResponseDto;
import com.titan.poss.payment.service.CashbackService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController(CASHBACK_CONTROLLER)
@RequestMapping("payment/v2/cash-back-offers")
public class CashbackController {

	@Autowired
	CashbackService cashbackService;

	private static final String CASH_BACK_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.CASH_BACK_VIEW + PreAuthorizeDetails.END;

	private static final String CASH_BACK_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.CASH_BACK_ADD_EDIT + PreAuthorizeDetails.END;

	/**
	 * This method will save the CashBack details.
	 * 
	 * @param configRequestDto
	 * @return CashbackDto
	 */
	// @formatter:off
	@ApiOperation(value = "Save the CashBack Details", notes = "This API saves the CashBack Details<br>")
	@PostMapping
	@PreAuthorize(CASH_BACK_ADD_EDIT_PERMISSION)
	public CashbackDto addCashbackDetails(@ApiParam(name = "body", value = "Cashback Details object that needs to be created", required = true) 
	@RequestBody @Valid CashbackRequestDto cashbackRequestDto) {
		return cashbackService.addCashbackDetails(cashbackRequestDto);
	}

	/**
	 * This method will return the CashBack details based on the cashBackId.
	 * @param cashBackId
	 * @return CashbackDto
	 */
	@ApiOperation(value = "View the Cashback Details based on the cashBackId", notes = "This API returns the Cashback Details based on the **cashBackId**")
	@GetMapping(value = "/{id}")
	@PreAuthorize(CASH_BACK_VIEW_PERMISSION)
	public CashbackDto getCashbackDetails(@PathVariable("id") String cashBackId) {
		return cashbackService.getCashbackDetails(cashBackId);
	}

	/**
	 * This method will return the list of Cashback Details based on the cashBackId,
	 * isActive.
	 * 
	 * @param isActive
	 * @return ListResponse<CashbackDto>
	 */
	@ApiOperation(value = "View the list of Cashback Details", notes = "This API returns the list of Cashback Details based on **isActive** and cashBackId")
	@GetMapping
	@PreAuthorize(CASH_BACK_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<CashbackDto>> listCashbackDetails(@RequestParam(required = false) String bankName,
			@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return cashbackService.listCashbackDetails(bankName,isActive,pageable);
	}

	/**
	 * This method will update the Cashback Details.
	 * 
	 * @param cashbackId
	 * @return CashbackDto
	 */
	// @formatter:off
	@ApiOperation(value = "Update the Cashback Details based on cashbackId", notes = "This API updates the Cashback Details ")
	// @formatter:on
	@PatchMapping(value = "/{id}")
	@PreAuthorize(CASH_BACK_ADD_EDIT_PERMISSION)
	public CashbackDto updateCashbackDetails(@PathVariable("id") String cashBackId,
			@ApiParam(name = "body", value = "Cashback Details object that needs to be Updated", required = true) @RequestBody @Valid CashbackUpdateDto cashbackUpdateDto) {
		return cashbackService.updateCashbackDetails(cashBackId, cashbackUpdateDto);
	}

	/**
	 * This method will update the Card Details based on cashbackId
	 * 
	 * @param cashbackId
	 */
	// @formatter:off
	@ApiOperation(value = "Update the Card Details based on cashbackId", notes = "This API updates the Card Details<br/> "
			+ "</br></br>::::This api will take Update Cards in request body::::</br>"
			+ "</br></t>::::Update Cards will change the isActive status passed in request body::::</br>")
	// @formatter:on
	@PatchMapping(value = "/{id}/card-details")
	@PreAuthorize(CASH_BACK_ADD_EDIT_PERMISSION)
	public CardDetailsUpdateDto updateCardDetails(@PathVariable("id") String cashBackId,
			@ApiParam(name = "body", value = "Card Details object that needs to be created", required = true) @RequestBody @Valid CardDetailsUpdateDto cardDetailsUpdateDto) {
		return cashbackService.updateCardDetails(cashBackId, cardDetailsUpdateDto);
	}

	/**
	 * This method will return the list of Card Details based on the cashBackId,
	 * isActive.
	 * 
	 * @param isActive
	 * @return ListResponse<CashbackDto>
	 */
	@ApiOperation(value = "View the list of Card Details", notes = "This API returns the list of Cash Details based on cashBackId and isActive")
	@GetMapping(value = "{id}/card-details")
	@PreAuthorize(CASH_BACK_ADD_EDIT_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<CardDetailResponseDto>> listCardDetails(@PathVariable("id") String cashBackId,
			@RequestParam(required = false) Boolean isActive, @ApiIgnore Pageable pageable) {
		return cashbackService.listCardDetails(cashBackId, isActive, pageable);
	}

	/**
	 * This method will add/update the CashbackOffer Details based on cashbackId
	 * 
	 * @param cashbackId
	 */
	// @formatter:off
	@ApiOperation(value = "Update the CashbackOffer Details based on cashbackId", notes = "This API add/updates the CashbackOffer Details<br/>"
			+ "</br></br>::::This api will take addOffer,isCashbackAmount,updateOffer, removeOffer in request body::::</br>"
			+ "</br></t> In addOffer, list of offerDetails will get added </br>"
			+ "</br></t> In removeOffer, list of offerDetailsId's passed will get deleted </br>"
			+ "</br></t>In updateOffer, list of offerDetails to be Updated which is updating against passed id </br>"
			+ "</br> 1. if isCashbackAmount is true, discountAmt can be updated.</br>"
			+ "</br> 2. if isCashbackAmount is false,discountPercent and maxDiscountAmt can be updated.</br>")
	// @formatter:on
	@PatchMapping(value = "/{id}/offer-details")
	@PreAuthorize(CASH_BACK_ADD_EDIT_PERMISSION)
	public CashbackOfferDto updateCashbackOfferDetails(@PathVariable("id") String cashBackId,
			@ApiParam(name = "body", value = "Offer Details object that needs to be created", required = true) @RequestBody @Valid CashbackOfferDto cashbackOfferDto) {
		return cashbackService.updateCashbackOfferDetails(cashBackId, cashbackOfferDto);
	}

	/**
	 * This method will return the CashBack Offer details based on the cashBackId.
	 * 
	 * @param cashBackId
	 * @return CashbackDto
	 */
	@ApiOperation(value = "View the CashbackOffer Details based on the cashBackId", notes = "This API returns the Cashback Offer Details based on the **cashBackId**")
	@GetMapping(value = "/{id}/offer-details")
	@PreAuthorize(CASH_BACK_VIEW_PERMISSION)
	public ListResponse<CashbackOfferResponseDto> getCashbackOfferDetails(@PathVariable("id") String cashBackId) {
		return cashbackService.getCashbackOfferDetails(cashBackId);
	}

	/**
	 * This method will create or remove product mapping with cashbackId
	 * 
	 * @param cashbackId
	 */
	// @formatter:off
	@ApiOperation(value = "Cashback and Product Mapping based on cashbackId", notes = "This API creates mapping between Cashback and Product<br/>"
			+ "</br></br>::::This api will take add ProductGroups and remove ProductGroups in request body::::</br>"
			+ "</br></t>::::removeProductGroups will be hard delete based on the cashbackId::::</br>"
			+ "</br></t>::::In Add ProductGroups, product will be mapped for that cashbackId::::</br>")
	// @formatter:on
	@PatchMapping(value = "/{id}/product-groups")
	@PreAuthorize(CASH_BACK_ADD_EDIT_PERMISSION)
	public CashbackProductDto cashbackProductMapping(@PathVariable("id") String cashBackId,
			@ApiParam(name = "body", value = "Product group that needs to be mapped/removed", required = true) @RequestBody CashbackProductDto cashbackProductDto) {
		return cashbackService.cashbackProductMapping(cashBackId, cashbackProductDto);
	}

	/**
	 * This method will return the list of Cashback Product mapping details based on
	 * cashbackId.
	 * 
	 * @param cashbackId
	 * @return ListResponse<CashbackProductUpdateDto>
	 */
	@ApiOperation(value = "API to get the list of Cashback ProductGroup mapping details", notes = "This API returns the list of Cashback Product mapping details based on CashbackId")
	@GetMapping("/{id}/product-groups")
	@PreAuthorize(CASH_BACK_VIEW_PERMISSION)
	public ListResponse<CashbackProductResponseDto> listCashbackProductMapping(@PathVariable("id") String cashBackId) {
		return cashbackService.listCashbackProductMapping(cashBackId);
	}

}
