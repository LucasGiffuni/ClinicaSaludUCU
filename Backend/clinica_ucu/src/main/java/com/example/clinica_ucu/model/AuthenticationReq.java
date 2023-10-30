package com.example.clinica_ucu.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticationReq implements Serializable {

  private static final long serialVersionUID = 1L;
  @JsonProperty("usuario")
  private String usuario;
  
  @JsonProperty("clave")
  private String clave;

  public AuthenticationReq(String usuario, String clave) {
    this.usuario = usuario;
    this.clave = clave;
  }

  public String getUsuario() {
    return usuario;
  }

  public void setUsuario(String username) {
    this.usuario = usuario;
  }

  public String getClave() {
    return clave;
  }

  public void setClave(String clave) {
    this.clave = clave;
  }
}