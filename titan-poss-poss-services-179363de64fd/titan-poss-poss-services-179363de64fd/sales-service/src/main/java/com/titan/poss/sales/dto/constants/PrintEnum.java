/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.constants;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * status Enum for Payment requests / pending payments.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum PrintEnum {

	 CM_PRINT_PRINT(List.of("CM_PRINT_CUSTOMER_COPY","CM_EMAIL_CUSTOMER_COPY")),
	 CM_PRINT_MAIL(List.of("CM_EMAIL_CUSTOMER_COPY")),
	 CM_PRINT_BOTH(List.of("CM_PRINT_CUSTOMER_COPY","CM_EMAIL_CUSTOMER_COPY")),
	 COA_PRINT_PRINT(List.of("COA_PRINT_CUSTOMER_COPY")),
	 COA_PRINT_MAIL(List.of("COA_EMAIL_CUSTOMER_COPY")),
	 COA_PRINT_BOTH(List.of("COA_PRINT_CUSTOMER_COPY","COA_EMAIL_CUSTOMER_COPY")),
	 CM_REPRINT_PRINT(List.of("CM_PRINT_OFFICE_COPY")),
	 CM_REPRINT_MAIL(List.of("CM_EMAIL_OFFICE_COPY")),
	 CM_REPRINT_BOTH(List.of("CM_PRINT_OFFICE_COPY", "CM_EMAIL_OFFICE_COPY")),
	 COA_REPRINT_PRINT(List.of("COA_PRINT_OFFICE_COPY")),
	 CREDIT_NOTE_REPRINT_PRINT(List.of("CREDIT_NOTE_PRINT_CUSTOMER_COPY")),
	 CREDIT_NOTE_PRINT_PRINT(List.of("CREDIT_NOTE_PRINT_OFFICE_COPY")),
	 CREDIT_NOTE_PRINT_BOTH(List.of("CREDIT_NOTE_PRINT_OFFICE_COPY"));
	
	private final List<String> value;

    PrintEnum(List<String> value) {
        this.value = value;
    }
    
    public List<String> getValue() {
    	return value;
    }

}
