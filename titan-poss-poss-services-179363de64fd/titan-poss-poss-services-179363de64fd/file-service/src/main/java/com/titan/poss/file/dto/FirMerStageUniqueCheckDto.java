package com.titan.poss.file.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class FirMerStageUniqueCheckDto {
	private String type;
	private String itemCode;
	private String lotNumber;
	private BigDecimal unitWeight;
	private String sourceLocationCode;
	private String fileId;
}
