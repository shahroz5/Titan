/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Date;

import lombok.Data;

/**
 * Controller class for Day Activity.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DayMasterDto {

    private String id;

    private String locationCode;

    private String status;

    private Date businessDate;
    
    private Integer fiscalYear;

    private Boolean skipBanking;

    private String remarks;
    
    private Boolean isGHSBODDone;
    
    private Boolean isGHSEODDone;

	private Short rateFetchAttempts;

}
