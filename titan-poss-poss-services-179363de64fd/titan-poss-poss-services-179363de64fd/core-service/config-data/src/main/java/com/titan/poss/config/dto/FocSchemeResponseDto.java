/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocSchemeResponseDto {

	private String schemeId;

	private String schemeName;

	private String schemeDetailId;

	private String schemeCategory;

	private List<PurchaseItemDto> purchaseItems;

	private List<FocItemDto> focItems;

}
