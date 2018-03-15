package com.company;

import java.util.logging.Logger;
import com.example.Test;


public class Main {
	private static final Logger LOGGER = Logger.getLogger("HelloWorld");


	public static void main(String[] args) {
		System.out.println("Starting...");

		if(args != null && args.length > 0 && args[0].equals("runtest=true")) {
			Test.runTest();
		}

		System.out.println("All done");
	}
}
