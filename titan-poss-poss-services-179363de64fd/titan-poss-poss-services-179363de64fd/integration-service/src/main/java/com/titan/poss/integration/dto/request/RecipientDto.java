/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.dto.request;

import java.util.Set;
import java.util.TreeSet;

import lombok.Data;

/**
 * @author Mindtree
 * @version 1.0
 */
@Data
public class RecipientDto {

	Set<String> to = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
	Set<String> cc = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
	Set<String> bcc = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
}
