/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.auth.domain;

import java.util.Date;
import java.util.List;

import javax.persistence.Id;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
  * @author  Mindtree Ltd.
  * @version 1.0
  */
@Data
@EqualsAndHashCode(callSuper = false)
public class Application {
	@Id
	private String id;
	private String applicationCode;
	private String applicationName;
	private String validUpto;
	private String status;
	private boolean isApiKey;
	private String token;
	private List<String> acls;
	private String createdBy;
	private Date createdOn;
	private String lastUpadateBy;
	private Date lastUpdatedOn;
}