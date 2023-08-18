/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.config.swagger;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Target({ ElementType.METHOD, ElementType.ANNOTATION_TYPE, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@ApiImplicitParams({ @ApiImplicitParam(name = "page", dataType = "int", paramType = "query"),
		@ApiImplicitParam(name = "size", dataType = "int", paramType = "query"),
		@ApiImplicitParam(name = "sort", allowMultiple = true, dataType = "string", paramType = "query") })
public @interface ApiPageable {
}