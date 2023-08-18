package com.titan.poss.sales.dto.request;

import java.util.List;

import javax.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrintRequestDto {

	
	private List<String> transactionIds;
}
