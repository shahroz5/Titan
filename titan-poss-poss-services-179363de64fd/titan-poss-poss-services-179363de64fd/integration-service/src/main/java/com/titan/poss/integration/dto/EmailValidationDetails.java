package com.titan.poss.integration.dto;

import java.util.Date;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EmailValidationDetails {
	private Date validationTime;
	private Object apiResponse;
}