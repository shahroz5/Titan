/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.utils;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class URLUtil {

	// @Value("${poss.item-image.url}")
	private String url = "/ProductImages/api/OracleImages/?Type=ProductImages&ImageParameter=2&ImageName=XXXXXXX.JPG";
	public String getImageUrlByItemCode(String itemCode) {
		String imageUrl = "";
		try {
			imageUrl = url.replace("XXXXXXX", itemCode.substring(2, 9));
		} catch (StringIndexOutOfBoundsException e) {
			imageUrl = url.replace("XXXXXXX", itemCode);
		}
		return imageUrl;
	}

}
