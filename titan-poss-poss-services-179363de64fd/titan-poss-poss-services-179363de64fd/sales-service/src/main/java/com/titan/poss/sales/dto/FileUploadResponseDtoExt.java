/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import com.titan.poss.core.dto.FileUploadErrorDto;
import com.titan.poss.core.dto.FileUploadResponseDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class FileUploadResponseDtoExt extends FileUploadResponseDto {
	
	private List<FileUploadErrorDto> errors;

}
