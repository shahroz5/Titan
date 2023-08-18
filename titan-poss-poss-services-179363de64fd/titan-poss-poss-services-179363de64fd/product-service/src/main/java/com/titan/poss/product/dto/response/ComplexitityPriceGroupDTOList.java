package com.titan.poss.product.dto.response;

import java.util.HashMap;
import java.util.List;

import com.titan.poss.product.dto.request.ComplexityPriceGroupMappingUploadDto;

import lombok.Data;


@Data
public class ComplexitityPriceGroupDTOList {
	private List<ComplexityPriceGroupMappingUploadDto> items;
	private List<String> notAvailablePriceGroupList;
	private List<String> notAvailableComplexityList;
	private HashMap<String, String> err;

}
