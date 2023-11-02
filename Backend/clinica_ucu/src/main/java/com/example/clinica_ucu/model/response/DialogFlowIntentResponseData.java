package com.example.clinica_ucu.model.response;

public class DialogFlowIntentResponseData {

    private String queryText;
    private String detectedIntent;
    private String fulFillmentText;
    private float sentimentScore;

    public String getQueryText() {
        return queryText;
    }
    public void setQueryText(String queryText) {
        this.queryText = queryText;
    }
    public String getDetectedIntent() {
        return detectedIntent;
    }
    public void setDetectedIntent(String detectedIntent) {
        this.detectedIntent = detectedIntent;
    }
    public String getFulFillmentText() {
        return fulFillmentText;
    }
    public void setFulFillmentText(String fulFillmentText) {
        this.fulFillmentText = fulFillmentText;
    }
    public float getSentimentScore() {
        return sentimentScore;
    }
    public void setSentimentScore(float sentimentScore) {
        this.sentimentScore = sentimentScore;
    }
    


    
}
