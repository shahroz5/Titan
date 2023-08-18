package com.titan.poss.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PanDocDetailsResponseDto {

	private String ownerName;

	private String message;

	private Boolean verificationStatus;

}
