package com.titan.poss.core.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TcsReverseForGRnDate {

	private Boolean sameMonth;
	private Boolean afterCalanderMonth;
}
