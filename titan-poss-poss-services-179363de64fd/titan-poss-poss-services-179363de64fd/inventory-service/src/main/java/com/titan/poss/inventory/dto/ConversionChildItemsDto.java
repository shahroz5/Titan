package com.titan.poss.inventory.dto;

import java.util.List;

import com.titan.poss.inventory.dto.request.RequestOtherItemDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversionChildItemsDto {

	List<RequestOtherItemDto> childItems;
	
}
