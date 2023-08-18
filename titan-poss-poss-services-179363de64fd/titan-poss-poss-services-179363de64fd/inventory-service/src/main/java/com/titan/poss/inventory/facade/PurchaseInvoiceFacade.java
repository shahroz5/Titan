/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.ReceivedWeightDto;
import com.titan.poss.inventory.dto.request.PurchaseInvoiceConfirmDto;
import com.titan.poss.inventory.dto.request.PurchaseInvoiceItemUpdateDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemBulkDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.PurchaseInvoiceDto;
import com.titan.poss.inventory.dto.response.PurchaseInvoiceItemDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface PurchaseInvoiceFacade {

	ListResponse<InventoryCountDto> getPurchaseInvoiceCount(String invoiceType, String status);

	PagedRestResponse<List<PurchaseInvoiceDto>> listPurchaseInvoices(Integer srcdocno, String invoiceType,
			Pageable pageable, String status);

	PurchaseInvoiceDto getPurchaseInvoiceById(Integer invoiceId, String invoiceType, String status);

	PurchaseInvoiceItemDto getPurchaseInvoiceItemById(Integer invoiceId, String itemId, String invoiceType);

	PagedRestResponse<List<PurchaseInvoiceItemDto>> listPurchaseInvoiceItems(Integer invoiceId, String itemCode,
			String lotNumber, String binGroupCode, String status, String invoiceType, List<String> binCodeList,
			List<String> productGroupList, List<String> productCategoryList, Pageable pageable);

	public ReceivedWeightDto getTotalReceivedWeight(Integer id, String stockReceiveType, String stockReceiveStatus,
			String itemCode, String binGroupCode, String lotNumber, List<String> binCode, List<String> productGroup,
			List<String> productCategory);

	PurchaseInvoiceItemDto updatePurchaseInvoiceItem(Integer invoiceId, String itemid, String invoiceType,
			PurchaseInvoiceItemUpdateDto invoiceItemVerifyDto);

	void updateAllPurchaseInvoiceItems(Integer invoiceId, String invoiceType,
			ReceiveStockItemBulkDto receiveStockItemBulkDto);

	PurchaseInvoiceDto updatePurchaseInvoice(Integer invoiceId, String purchaseInvoicetype,
			PurchaseInvoiceConfirmDto invoiceConfirmDto);

	public PagedRestResponse<List<PurchaseInvoiceDto>> getInvoiceFromErp(String srcdocno, String transferType);

}
