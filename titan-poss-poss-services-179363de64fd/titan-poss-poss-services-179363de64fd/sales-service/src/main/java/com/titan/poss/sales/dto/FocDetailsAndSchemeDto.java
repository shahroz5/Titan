/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import com.titan.poss.sales.dao.FocDetailsDao;
import com.titan.poss.sales.dao.FocSchemesDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FocDetailsAndSchemeDto {

	List<FocDetailsDao> focDetails;
	List<FocSchemesDao> focSchemes;
}
