/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;
import com.titan.poss.sales.dto.GiftDetailsDto;
import com.titan.poss.sales.dto.request.GiftDetailsCreateDto;
import com.titan.poss.sales.dto.request.GiftDetailsUpdateDto;
import com.titan.poss.sales.dto.response.CashMemoAndGiftDetailsResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CashMemoGiftService {

	/**
	 * This method will add gift item to cash memo on hold or open status.
	 *
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param vendorCode
	 * @param giftType
	 * @param giftDetailsCreateDto
	 * @return CashMemoAndGiftDetailsResponseDto
	 */
	CashMemoAndGiftDetailsResponseDto addGiftToCashMemo(String id, String vendorCode, String giftType, String txnType,
			String subTxnType, GiftDetailsCreateDto giftDetailsCreateDto);

	/**
	 * This method will get item details based on id and itemId.
	 *
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @return GiftDetailsDto
	 */
	GiftDetailsDto getGiftInCashMemo(String id, String itemId, String txnType, String subTxnType);

	/**
	 * This method will delete cashMemo gift item by id and itemId.
	 *
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @return CashMemoResponseDto
	 */
	CashMemoResponseDto deleteCashMemoGift(String id, String itemId, String txnType, String subTxnType);

	/**
	 * This method will partially update cash memo gift item.
	 *
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @param giftDetailsUpdateDto
	 * @return CashMemoAndGiftDetailsResponseDto
	 */
	CashMemoAndGiftDetailsResponseDto partialUpdateCashMemoGift(String id, String itemId, String txnType,
			String subTxnType, GiftDetailsUpdateDto giftDetailsUpdateDto);

	/**
	 * This method will activate all gifts present in Cash Memo
	 * 
	 * @param cashMemoDao
	 */
	void activateGifts(CashMemoDaoExt cashMemoDao);

	/**
	 * This method will de-activate all gifts present in Cash Memo
	 * 
	 * @param cashMemoDao
	 * @return List<GiftDetailsDaoExt>
	 */
	List<GiftDetailsDaoExt> deactivateGifts(CashMemoDaoExt cashMemoDao);

	/**
	 * @param txnId
	 * @return
	 */
	List<GiftDetailsDto> getGiftsInCashMemo(String txnId);
}
