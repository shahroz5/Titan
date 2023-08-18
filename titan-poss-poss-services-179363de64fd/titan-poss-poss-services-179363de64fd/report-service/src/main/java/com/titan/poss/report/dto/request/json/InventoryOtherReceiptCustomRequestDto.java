/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.dto.request.json;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class InventoryOtherReceiptCustomRequestDto {

    private List<String> receiptType;
    
    private List<String> productGroupCode;

    private List<String> productCategoryCode;

    private List<String> binGroupCode;
    
}
