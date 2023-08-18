package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;


import lombok.Data;

@Data
public class BoutiqueGoldPriceMasterDto {

    protected BigDecimal btqPrice;

    protected String remarks;

    protected boolean isBTQEffective;

    protected String loginID;

    protected Date createdDate;

    protected String lastModifiedID;

    protected Date lastModifiedDate;

    protected Date applicableDate;
}
