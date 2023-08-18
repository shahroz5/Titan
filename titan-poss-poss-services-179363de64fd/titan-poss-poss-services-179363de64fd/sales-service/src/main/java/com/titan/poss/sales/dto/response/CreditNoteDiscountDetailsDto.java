/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.List;

import com.titan.poss.core.discount.dto.DigiGoldTanishqDiscountDto;
import com.titan.poss.sales.dto.GRNMultipleDiscountDto;
import com.titan.poss.sales.dto.GhsAccountDiscountDetailsDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for all discount details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreditNoteDiscountDetailsDto {

	private List<CoinOfferDiscountDto> coinOfferDiscount;
	private List<KaratExchangeDiscountDto> karatageExchangeDiscount;
	private List<GepPurityDiscountDto> gepPurityDiscount;
	private GhsAccountDiscountDetailsDto ghsAccountDiscount;
	private DigiGoldTanishqDiscountDto digiGoldDiscount;
    private GhsDiscountVoucherDetailDto systemDiscountDv;
    private GRNMultipleDiscountDto grnMultipleDiscount;

	public CreditNoteDiscountDetailsDto(List<GepPurityDiscountDto> gepPurityDiscount) {
		super();
		this.gepPurityDiscount = gepPurityDiscount;
	}

}
