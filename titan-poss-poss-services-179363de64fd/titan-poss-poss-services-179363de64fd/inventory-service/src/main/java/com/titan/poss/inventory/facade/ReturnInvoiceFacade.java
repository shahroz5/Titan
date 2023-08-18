/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.util.List;

import javax.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.request.RemoveStockItemsDto;
import com.titan.poss.inventory.dto.request.ReturnInvoiceConFirmDto;
import com.titan.poss.inventory.dto.request.ReturnInvoiceCreateItemsDto;
import com.titan.poss.inventory.dto.response.ReturnInvoiceDto;
import com.titan.poss.inventory.dto.response.ReturnInvoiceItemDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface ReturnInvoiceFacade {

	ReturnInvoiceDto getReturnInvoiceById(Integer invoiceId, String invoiceType, String returnInvoiceStatus);

	PagedRestResponse<List<ReturnInvoiceItemDto>> listReturnInvoiceItems(Integer invoiceId, String itemCode,
			String lotnum, List<String> binCode, String binGroupCode, String status, String invoiceType,
			List<String> productGroup, List<String> productCategory, Pageable pageable);

	ReturnInvoiceDto addReturnInvoice(String invoiceType);

	void addReturnInvoiceItems(Integer invoiceId, String invoiceType,
			@Valid ReturnInvoiceCreateItemsDto returnInvoiceItemDto);

	void removeReturnInvoiceItems(Integer invoiceId, @Valid RemoveStockItemsDto removeStockItemsDto,
			String invoiceType);

	ReturnInvoiceDto updateReturnInvoice(Integer invoiceId, @Valid ReturnInvoiceConFirmDto invoiceConfirmDto,
			String invoiceType);

	ResponseEntity<Resource> getStockReturnInvoicePDF(Integer id, String invoiceType);

	ReturnInvoiceDto updateReturnInvoiceFilePublish(Integer invoiceId);
	
	ReturnInvoiceDto getReturnInvoiceDetail(Integer invoiceId, String invoiceType, String returnInvoiceStatus);


}
