/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class ReturnInvoiceCreateItemsDto {

	@Size(max = 50)
	private List<@Valid InvoiceItem> invoiceItems;
}
