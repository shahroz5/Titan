
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.util;

import static com.titan.poss.core.utils.FileUtil.FILE_PATH_SEPARATOR;

import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

import com.titan.poss.core.domain.constant.CertificateTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.FileUtil;

/**
 * @author Mindtree
 * @version 1.0
 */
public final class MessageSigner {

	private MessageSigner() {
		throw new IllegalArgumentException("MessageSigner class");
	}

	private static final String PVT_KEY_ALGO = "RSA";
	private static final String SIGN_ALGO = "SHA1withRSA";

	private static final String SIGN_FAILED = "Signing text failed";
	private static final String ERR_INT_002 = "ERR-INT-002";

	private static Signature sig;

	public static String sign(String certFilePath, String toSign, CertificateTypeEnum certificateType) {

		// implementation like reading existing login RSA key or new generate each time
		// https://bitbucket.org/titan-poss/poss-services/commits/6147ff171f1da579f7c1ead278871ce3737d51e3

		byte[] keyData = readPvtKeyFile(certFilePath, certificateType);
		PrivateKey pvtKey = getPvtKey(keyData);

		setSig(pvtKey);
		try {
			return sign(toSign);
		} catch (SignatureException e) {
			throw new ServiceException(SIGN_FAILED, ERR_INT_002, e);
		}
	}

	// PENDING remove approach no later
	private static PrivateKey getPvtKey(byte[] keyData) {

		PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(CryptoUtil.parseKeyData(keyData));

		PrivateKey key = null;

		try {

			KeyFactory kf = KeyFactory.getInstance(PVT_KEY_ALGO);
			key = kf.generatePrivate(keySpec);

		} catch (NoSuchAlgorithmException e) {
			throw new ServiceException(SIGN_FAILED, ERR_INT_002,
					"Algorithm requested is not available in this environment JRE");
		} catch (InvalidKeySpecException e) {
			throw new ServiceException(SIGN_FAILED, ERR_INT_002, "Keyspec is invalid");
		} catch (Exception e) {
			throw new ServiceException(SIGN_FAILED, ERR_INT_002, e);
		}
		return key;
	}

	private static void setSig(PrivateKey key) {

		try {
			sig = Signature.getInstance(SIGN_ALGO);
			sig.initSign(key);

		} catch (NoSuchAlgorithmException e) {
			throw new ServiceException(SIGN_FAILED, ERR_INT_002,
					"Algorithm requested is not available in this environment JRE");
		} catch (Exception e) {
			throw new ServiceException(SIGN_FAILED, ERR_INT_002, e);
		}
	}

	private static byte[] readPvtKeyFile(String certFilePath, CertificateTypeEnum certificateType) {

		String filePath = certFilePath + FILE_PATH_SEPARATOR + certificateType.toString();
		String keyFileName = certificateType.getPrivateKey();

		return FileUtil.getFileContentInByteArrayFormat(filePath, keyFileName);
	}

	/**
	 * Signs the specified data with the provided private key, returning the RSA
	 * SHA1 signature
	 * 
	 * @param data Message to sign
	 * @return Base64 encoded signature
	 * @throws Exception
	 */
	private static String sign(String data) throws SignatureException {
		sig.update(data.getBytes());
		return Base64.getEncoder().encodeToString(sig.sign());
	}

}
