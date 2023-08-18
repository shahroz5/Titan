/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.CASHBACK_SERVICE;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dao.CashbackCardDetailsDaoExt;
import com.titan.poss.payment.dto.CardDetailsUpdateDto;
import com.titan.poss.payment.dto.CashbackDto;
import com.titan.poss.payment.dto.CashbackOfferDto;
import com.titan.poss.payment.dto.CashbackOfferResponseDto;
import com.titan.poss.payment.dto.request.CashbackRequestDto;
import com.titan.poss.payment.dto.request.CashbackUpdateDto;
import com.titan.poss.payment.dto.response.CardDetailResponseDto;
import com.titan.poss.payment.dto.response.CashbackProductDto;
import com.titan.poss.payment.dto.response.CashbackProductResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(CASHBACK_SERVICE)
public interface CashbackService {

	/**
	 * This method will save the Cashback details.
	 * 
	 * @param cashbackRequestDto
	 * @return CashbackDto
	 */
	public CashbackDto addCashbackDetails(CashbackRequestDto cashbackRequestDto);

	/**
	 * This method will get the Cashback details based on cashbackId
	 * 
	 * @param cashBackId
	 * @return CashbackDto
	 */
	public CashbackDto getCashbackDetails(String cashBackId);

	/**
	 * This method will update the Cashback Details.
	 * 
	 * @param cashBackId
	 * @param cashbackRequestDto
	 * @return CashbackDto
	 */
	public CashbackDto updateCashbackDetails(String cashBackId, CashbackUpdateDto cashbackRequestDto);

	/**
	 * This method will return the list of Cashback Details based on the cashBackId,
	 * isActive.
	 * 
	 * @param isActive
	 * @return ListResponse<CashbackDto>
	 */
	public PagedRestResponse<List<CashbackDto>> listCashbackDetails(String bankName, Boolean isActive,
			Pageable pageable);

	/**
	 * This method will update the Card Details based on cashbackId
	 * 
	 * @param cashbackId
	 */
	public CardDetailsUpdateDto updateCardDetails(String cashBackId, CardDetailsUpdateDto cardDetailsUpdateDto);

	/**
	 * This method will return the list of Cards based on the cashBackId,
	 * 
	 * @param isActive
	 * @return ListResponse<UpdateCardDetailDto>
	 */
	public PagedRestResponse<List<CardDetailResponseDto>> listCardDetails(String cashBackId, Boolean isActive,
			Pageable pageable);

	/**
	 * This method will create or remove product mapping with cashbackId
	 * 
	 * @param cashbackId
	 */
	public CashbackProductDto cashbackProductMapping(String cashBackId,
			@RequestBody CashbackProductDto cashbackProductDto);

	/**
	 * This method will return the list of Cashback Product mapping details based on
	 * cashbackId.
	 * 
	 * @param cashbackId
	 * @return ListResponse<CashbackProductUpdateDto>
	 */
	public ListResponse<CashbackProductResponseDto> listCashbackProductMapping(String cashBackId);

	/**
	 * This method will add/update the CashbackOffer Details based on cashbackId
	 * 
	 * @param cashbackId
	 */
	public CashbackOfferDto updateCashbackOfferDetails(String cashBackId, CashbackOfferDto cashbackOfferDto);

	/**
	 * This method will return the CashBack Offer details based on the cashBackId.
	 * 
	 * @param cashBackId
	 * @return CashbackDto
	 */
	public ListResponse<CashbackOfferResponseDto> getCashbackOfferDetails(String cashBackId);

	/**
	 * This method will insert card details present in file into DB.
	 * 
	 * @return String
	 */
	public void addCardDetails(Set<CashbackCardDetailsDaoExt> cardDetailsFileList);

	/**
	 * This method will bulk delete offerDetails for mapped cashbackID
	 * 
	 * @param cashBackId
	 */
	public void deleteCashbackOfferDetails(String cashBackId);

}
