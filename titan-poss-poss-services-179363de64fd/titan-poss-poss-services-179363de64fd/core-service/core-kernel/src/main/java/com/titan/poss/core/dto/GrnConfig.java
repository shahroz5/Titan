package com.titan.poss.core.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrnConfig {
	
	private Boolean tcsReverseInCaseOfGRN;
	private TcsReverseForGRnDate tcsReverseForGRnDate;
	private Boolean tcsReverseForInterboutiqueGRN;

}
