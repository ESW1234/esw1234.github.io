package com.salesforce.scrt2.app.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.locks.ReentrantLock;

/**
 * A handler for managing unAuthenticated scenarios.
 */
@Component
public class UnauthenticatedAuthorizationHandler {
    private final static Logger LOGGER = LoggerFactory.getLogger(UnauthenticatedAuthorizationHandler.class.getCanonicalName());
    private ReentrantLock lock;
    private boolean isTokenValid;

    @Autowired
    public UnauthenticatedAuthorizationHandler() {
        this.lock = new ReentrantLock();
        this.isTokenValid = false;
    }

    /**
     * 1. Validates the request
     * 2. Authorizes or sign the JWT.
     ** @return CompletableFuture<String>
     */
    public CompletableFuture<String> handleAccessTokensRequest() {

        // convert the incoming request to IAUnAuthenticatedAuthorizationReques

        return CompletableFuture.completedFuture(this.renewVaultToken());
    }

    private String renewVaultToken() {

        // Current thread tries to get a lock, and is suspended if the lock cannot be acquired.
        LOGGER.info("Thread currently trying to renew the Vault Token: {}", Thread.currentThread().getName());
        this.lock.lock();
        LOGGER.info("Thread currently having the lock: {}", Thread.currentThread().getName());

        try {
            if (isVaultTokenValid()) {
                LOGGER.info("Vault token already renewed by a different thread");
                return String.format("Token was already renewed");
            } else {
                LOGGER.info("Thread currently updating the Vault Token: {}", Thread.currentThread().getName());
                Thread.sleep(10000);
                this.isTokenValid = true;
                LOGGER.info("The vault token update is complete by {}",  Thread.currentThread().getName());
                return String.format("Token Renewed by %s", Thread.currentThread().getName());
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            LOGGER.info("The thread currently unlocking {}", Thread.currentThread().getName());
            this.lock.unlock();
        }

        LOGGER.info("The thread {} was unable to renew", Thread.currentThread().getName());
        return "Unable to renew";
    }

    @Scheduled(fixedDelay = 60000)
    public void setIsTokenValid() {
        this.isTokenValid = false;
    }

    private boolean isVaultTokenValid() {
        return isTokenValid;
    }
}
