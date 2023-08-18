/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.enums;

import java.util.List;

/**
 * Enum class for sub transaction type.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum RequestTypeEnum {
	
	IBT, MTR, COM, PROD;
	
	public static List<String> getCoType(String type)
	{
		List<String> typeList = null;
		if(type.equals(COM.name()))
		{
			typeList=List.of(COM.name());
		}else if(type.equals(PROD.name()))
		{
			typeList=List.of(PROD.name());
		}else if(type.equals(IBT.name())||(type.equals(MTR.name())))
		{
			typeList=List.of(IBT.name(),MTR.name());
		}
		return typeList;
		
	}

}
