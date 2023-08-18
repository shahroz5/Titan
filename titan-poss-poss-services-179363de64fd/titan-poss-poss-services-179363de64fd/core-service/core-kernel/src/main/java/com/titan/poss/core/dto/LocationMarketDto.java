package com.titan.poss.core.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationMarketDto {

	@NotNull(message = "Please provide the locationCode")
	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid locationCode")
	private String locationCode;

	private String description;

	private String marketCode;

}
