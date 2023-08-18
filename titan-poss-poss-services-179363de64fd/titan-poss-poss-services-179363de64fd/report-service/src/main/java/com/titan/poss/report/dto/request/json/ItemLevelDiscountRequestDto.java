package com.titan.poss.report.dto.request.json;

import com.titan.poss.report.dto.request.ReportRequestDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ItemLevelDiscountRequestDto extends ReportRequestDto {
	private ItemLevelDiscountCustomRequestDto itemLevelDiscountCustomRequestDto;
}
