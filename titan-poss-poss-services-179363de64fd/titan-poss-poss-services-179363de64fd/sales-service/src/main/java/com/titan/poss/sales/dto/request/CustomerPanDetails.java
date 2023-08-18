package com.titan.poss.sales.dto.request;



import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPanDetails {
	
	private Integer customerId;
	private String id;
	private String pancardNo;
	private String collectedIdProofNumber;
	private CustomerTypeEnum customerType;
	private TransactionTypeEnum txnType;
	private String panHolderName;

}
