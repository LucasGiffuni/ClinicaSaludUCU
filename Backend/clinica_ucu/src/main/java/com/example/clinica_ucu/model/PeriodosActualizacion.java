package com.example.clinica_ucu.model;

public class PeriodosActualizacion {
    @JsonProperty(value = "Year")
    private String Year;

    @JsonProperty(value = "Semestre")
    private String Semestre;

    @JsonProperty(value = "Fch_Inicio")
    private String Fch_Inicio;

    @JsonProperty(value = "Fch_Fin")
    private String Fch_Fin;

    public PeriodosActualizacion() {
    }

    public String getYear() {
        return Year;
    }

    public void setYear(String year) {
        Year = year;
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
