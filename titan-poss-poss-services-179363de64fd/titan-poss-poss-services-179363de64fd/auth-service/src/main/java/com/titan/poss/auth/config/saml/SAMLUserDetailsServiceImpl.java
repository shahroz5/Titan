/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package  com.titan.poss.auth.config.saml;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.saml.SAMLCredential;
import org.springframework.security.saml.userdetails.SAMLUserDetailsService;
import org.springframework.stereotype.Service;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class SAMLUserDetailsServiceImpl implements SAMLUserDetailsService {

	private List<String> roles;





	/**
	 * Setter for roles.
	 * 
	 * @param r
	 *            - user roles.
	 */
	public void setRoles(List<String> r) {
		this.roles = r;
	}





	/**
	 * Getter for roles.
	 * 
	 * @return list of roles.
	 */
	public List<String> getRoles() {
		return this.roles;
	}





	@Override
	public Object loadUserBySAML(SAMLCredential credential) {
		List<GrantedAuthority> authorities = new ArrayList<>();
		String email = credential.getNameID().getValue();
		GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER");
		authorities.add(authority);
		return new User(email, "password", true, true, true, true, authorities);
	}
}
