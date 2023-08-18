/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import java.util.Date;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class FocSchemeHeaderDto {

	private String id;

	private String name;

	private String description;

	private Boolean isActive;

	private Date publishTime;

	private Boolean isPublishPending;

	private Date lastModifiedDate;

}
