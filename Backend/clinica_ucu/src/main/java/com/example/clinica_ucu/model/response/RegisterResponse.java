package com.example.clinica_ucu.model.response;

public class RegisterResponse {
    DefaultResponse Response;
    String message;

    public RegisterResponse() {
    }

    public DefaultResponse getResponse() {
        return Response;
    }

    public void setResponse(DefaultResponse response) {
        Response = response;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
