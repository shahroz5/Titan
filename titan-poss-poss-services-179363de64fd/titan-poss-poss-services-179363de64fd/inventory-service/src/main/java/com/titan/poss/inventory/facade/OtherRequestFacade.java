/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.request.OtherRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.OtherRequestItemsCreateDto;
import com.titan.poss.inventory.dto.request.OtherRequestUpdateDto;
import com.titan.poss.inventory.dto.request.OtherTransactionRequestCreateDto;
import com.titan.poss.inventory.dto.request.RemoveOtherItemsDto;
import com.titan.poss.inventory.dto.response.OtherRequestDto;
import com.titan.poss.inventory.dto.response.OtherRequestItemDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface OtherRequestFacade {

	public PagedRestResponse<List<OtherRequestItemDto>> listOtherRequestItems(Integer requestId, String reqType,
			String itemCode, List<String> productGroup, List<String> productCategory, String lotNumber,
			List<String> binCode, String status, Pageable pageable);

	public OtherRequestDto createOtherTransactionRequest(String reqType);

	public OtherRequestDto createOtherTransactionRequest(String reqType,
			OtherTransactionRequestCreateDto otherRequestCreateDto);

	public OtherRequestItemDto updateOtherRequestItem(Integer otherRequestId, String itemId, String reqType,
			OtherRequestItemUpdateDto itemUpdateDto);

	public OtherRequestDto updateOtherRequest(Integer otherRequestId, String reqType,
			OtherRequestUpdateDto requestUpdateDto);

	public void createItemDetails(Integer id, String reqType, OtherRequestItemsCreateDto otherRequestItemsCreateDto);

	public void removeOtherRequestItems(Integer id, RemoveOtherItemsDto removeOtherItemsDto, String reqType);

	public OtherRequestDto cancelOtherRequest(Integer id, String reqType);

}
