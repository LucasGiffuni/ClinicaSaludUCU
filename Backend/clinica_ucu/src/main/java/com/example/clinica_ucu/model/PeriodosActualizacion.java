package com.example.clinica_ucu.model;

import java.sql.Date;

public class PeriodosActualizacion {
    @JsonProperty(value = "Year")
    private Integer Year;

    @JsonProperty(value = "Semestre")
    private String Semestre;

    @JsonProperty(value = "Fch_Inicio")
    private String Fch_Inicio;

    @JsonProperty(value = "Fch_Fin")
    private String Fch_Fin;

    public PeriodosActualizacion(Integer year, String semestre, String fch_Inicio, String fch_Fin) {
        Year = year;
        Semestre = semestre;
        Fch_Inicio = fch_Inicio;
        Fch_Fin = fch_Fin;
    }

    public Integer getAnio() {
        return Year;
    }

    public void setAnio(Integer anio) {
        Year = anio;
    }

    public String getSemestre() {
        return Semestre;
    }

    public void setSemestre(String semestre) {
        Semestre = semestre;
    }

    public String getFch_Inicio() {
        return Fch_Inicio;
    }

    public void setFch_Inicio(String fch_Inicio) {
        Fch_Inicio = fch_Inicio;
    }

    public String getFch_Fin() {
        return Fch_Fin;
    }

    public void setFch_Fin(String fch_Fin) {
        Fch_Fin = fch_Fin;
    }

}
