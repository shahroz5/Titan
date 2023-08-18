/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.discount.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.dto.FocSchemeIndividualBaseDto;
import com.titan.poss.core.dto.PurchaseItemRequestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class FocSchemeRequestDto extends FocSchemeIndividualBaseDto {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date businessDate;

	List<PurchaseItemRequestDto> purchaseItems;

	private Boolean isFrozen;
	
	@Override
	public String toString() {
		return "FocSchemeRequestDto [businessDate=" + businessDate + ", purchaseItems=" + purchaseItems
				+ ", schemeDetails=" + getSchemeDetails() + ", schemeProductMapping=" + getSchemeProductMapping()
				+ ", schemeItemMapping=" + getSchemeItemMapping() + "]";
	}

}
