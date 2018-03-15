package com.test;

import sun.security.x509.X500Name;


public class Main {
    public static void main(String[] args) {
    	try {
			X500Name name = new X500Name("CN=user");
		}
		catch(Exception ex) {
		}
    }
}
