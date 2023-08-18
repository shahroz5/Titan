package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dto.DepositSummaryRequestDto;
import com.titan.poss.sales.dto.DepositSummaryResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepositAmountResponseDto {
	
	private List<String> transactionIds;
	private BigDecimal Amount;
	private DepositSummaryRequestDto denominationDetails;


}
