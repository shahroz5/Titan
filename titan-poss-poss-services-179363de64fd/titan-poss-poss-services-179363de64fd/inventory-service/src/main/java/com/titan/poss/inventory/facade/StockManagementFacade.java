/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dto.request.BinRequestCreateDto;
import com.titan.poss.inventory.dto.request.ConversionApprovalRequestDto;
import com.titan.poss.inventory.dto.request.ConversionRequestDto;
import com.titan.poss.inventory.dto.request.ListInventoryItemsDto;
import com.titan.poss.inventory.dto.request.RequestItemSearchDto;
import com.titan.poss.inventory.dto.response.AvailableBinCode;
import com.titan.poss.inventory.dto.response.BinRequestDto;
import com.titan.poss.inventory.dto.response.ConversionDto;
import com.titan.poss.inventory.dto.response.ConversionRequestItemListDto;
import com.titan.poss.inventory.dto.response.ConversionRequestListDto;
import com.titan.poss.inventory.dto.response.ConversionResponseDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.ItemLocationDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface StockManagementFacade {

	PagedRestResponse<List<ItemLocationDto>> listLocationsWithItems(List<RequestItemSearchDto> reqItem,
			List<String> ownerTypeCodes, String regionType, List<String> locationTypes, Pageable pageable)
			throws IOException;

	BinRequestDto createBinRequest(BinRequestCreateDto binRequestDto);

	PagedRestResponse<List<BinRequestDto>> listBinCreationRequest(Integer reqDocNo, Pageable pageable);

	ListResponse<ConversionResponseDto> listConversionItems(String itemCode, String lotNumber, BigDecimal itemWeight,
			String binCode);

	ConversionDto createConversionItems(ConversionRequestDto conversionRequestDto);

	ListResponse<AvailableBinCode> getAvailableBinCodesByLocation();

	PagedRestResponse<List<ConversionRequestListDto>> listConversionRequest(Integer srcDocNo, Pageable pageable);

	PagedRestResponse<List<ConversionRequestItemListDto>> listConversionRequestItem(Integer id, Pageable pageable);

	ConversionDto updateConversionRequest(Integer id, ConversionApprovalRequestDto conversionApprovalRequestDto);

	ConversionRequestListDto getConversionRequest(Integer id);

	StockTransactionDao addBinStockTransaction();
	
	PagedRestResponse<InventoryItemDtoList> listInventoryItems(List<String> binCode, String itemCode,
			List<String> productCategory, List<String> productGroup, String binGroupCode, String lotNumber,
			String binType, Boolean isPageable, Pageable pageable);
	
	ResponseEntity<Resource> getInventoryItemLotDetails(String itemCode, String lotNumber, Boolean isHallmarking);

}
