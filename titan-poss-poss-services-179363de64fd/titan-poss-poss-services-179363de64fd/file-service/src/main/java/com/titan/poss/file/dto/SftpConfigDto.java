/*  Copyright 2019. Tanishq
*  All rights reserved.
*/
package com.titan.poss.file.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class SftpConfigDto {

	@JsonProperty("Username")
	private String username;

	@JsonProperty("Password")
	private String password;

	@JsonProperty("host")
	private String host;

	@JsonProperty("port")
	private Integer port;

	@JsonProperty("basePath")
	private String basePath;

}