package com.titan.poss.core.dto;
import java.util.Date;



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
public class UserLoginDto {
	
	private String userName;
	
	private String password;
	
	private String employeeCode;
	
	private String salt;
	
	private Long passwordChangedDate;
	
	private Boolean isLocked;
	
	private Boolean isLoginActive;
	
	private String createdBy;
	
	private Long createdDate;
	
	private String lastModifiedBy;
	
	private Long lastModifiedDate;
	
	private Long lastLoginDate;
	
	private String passwordHistory;
	

}
