package com.salesforce.scrt2.app.handler;

import com.salesforce.scrt2.app.generated.web.api.models.AccessTokensResponse;
import com.salesforce.scrt2.app.generated.web.api.operations.AuthorizationApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

/**
 * Rest Controller for handling the Rest Call pertaining to Authorization.
 */
@RestController
public class AuthorizationHandler implements AuthorizationApi {

    private UnauthenticatedAuthorizationHandler unauthenticatedAuthorizationHandler;
    private final static Logger LOGGER = LoggerFactory.getLogger(AuthorizationHandler.class.getCanonicalName());

    @Autowired
    public AuthorizationHandler(UnauthenticatedAuthorizationHandler unauthenticatedAuthorizationHandler) {
        this.unauthenticatedAuthorizationHandler = unauthenticatedAuthorizationHandler;
    }

    @Override
    @Async
    public CompletableFuture<ResponseEntity<AccessTokensResponse>> unAuthenticatedAccessToken() {
        LOGGER.info("Received the request for accessToken {}", Thread.currentThread().getName());
        return this.unauthenticatedAuthorizationHandler.handleAccessTokensRequest()
            .thenApply(response -> {
                final AccessTokensResponse accessTokensResponse = new AccessTokensResponse().accessToken(response);
                return new ResponseEntity<>(accessTokensResponse, HttpStatus.OK);
            });
    }
}
