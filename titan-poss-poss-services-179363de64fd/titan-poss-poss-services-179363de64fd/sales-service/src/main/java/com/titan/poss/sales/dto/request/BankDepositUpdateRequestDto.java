/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */


package com.titan.poss.sales.dto.request;


import com.titan.poss.sales.dto.BankDepositUpdate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankDepositUpdateRequestDto {

	private List<BankDepositUpdate> bankDeposit;

}
