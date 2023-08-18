package com.titan.poss.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PanAndForm60ResponseDto {

	private Boolean panVerified;
	private String panHolderName;
	private String panHolderCategory;
	
}
