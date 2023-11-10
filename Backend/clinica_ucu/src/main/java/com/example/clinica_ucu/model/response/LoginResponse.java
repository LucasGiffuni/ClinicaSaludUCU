package com.example.clinica_ucu.model.response;

public class LoginResponse {

    DefaultResponse Response;
    String JWT;
    String Cedula;

    public LoginResponse() {

    }

    public DefaultResponse getResponse() {
        return Response;
    }

    public void setResponse(DefaultResponse response) {
        Response = response;
    }

    public String getJWT() {
        return JWT;
    }

    public void setJWT(String jWT) {
        JWT = jWT;
    }

    public String getCedula() {
        return Cedula;
    }

    public void setCedula(String cedula) {
        Cedula = cedula;
    }

}
