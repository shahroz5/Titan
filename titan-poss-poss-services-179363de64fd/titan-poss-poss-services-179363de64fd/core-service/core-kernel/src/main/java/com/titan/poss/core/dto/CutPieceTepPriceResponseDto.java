package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CutPieceTepPriceResponseDto {

	
	private String itemCode;
	private String lotNumber;
	private String productGroupCode;
	private BigDecimal cutPieceWeight;
	private BigDecimal netWeight;
	private BigDecimal netWeightAfterCutPiece;
	private BigDecimal itemValue;
	private BigDecimal soldItemValue;
	private BigDecimal TOTValue;
	private BigDecimal cutPieceValue;
	private BigDecimal karat;
	
}
