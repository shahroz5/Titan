package com.titan.poss.report.dto.request.json;

import com.titan.poss.report.dto.request.ReportRequestDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ComplexityReportRequestDto extends ReportRequestDto {
	private ComplexityReportCustomRequestDto complexityReportCustomRequestDto;
}
