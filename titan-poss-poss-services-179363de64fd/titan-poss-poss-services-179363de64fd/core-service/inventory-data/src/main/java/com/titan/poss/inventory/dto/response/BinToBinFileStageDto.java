package com.titan.poss.inventory.dto.response;

import java.math.BigDecimal;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class BinToBinFileStageDto {
	
	private Integer id;
	private String fileName;
}
