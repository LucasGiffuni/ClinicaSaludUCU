package com.example.clinica_ucu.model;

import com.mysql.cj.jdbc.Blob;

public class CarnetSalud {
    private String Ci;
    private String Fch_Emision;
    private String Fch_Vencimiento;
    private Blob Comprobante;

    public String getCi() {
        return Ci;
    }

    public void setCi(String ci) {
        Ci = ci;
    }

    public String getFch_Emision() {
        return Fch_Emision;
    }

    public void setFch_Emision(String fch_Emision) {
        Fch_Emision = fch_Emision;
    }

    public String getFch_Vencimiento() {
        return Fch_Vencimiento;
    }

    public void setFch_Vencimiento(String fch_Vencimiento) {
        Fch_Vencimiento = fch_Vencimiento;
    }

    public Blob getComprobante() {
        return Comprobante;
    }

    public void setComprobante(Blob comprobante) {
        Comprobante = comprobante;
    }

}
