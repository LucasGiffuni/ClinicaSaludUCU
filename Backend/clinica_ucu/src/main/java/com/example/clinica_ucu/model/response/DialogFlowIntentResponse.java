package com.example.clinica_ucu.model.response;

public class DialogFlowIntentResponse {

    public DialogFlowIntentResponseData DiaglogFlowResponse;

    public DialogFlowIntentResponseData getDiaglogFlowResponse() {
        return DiaglogFlowResponse;
    }

    public void setDiaglogFlowResponse(String queryText, String detectedIntent, String fulFillmentText,
            float sentimentScore) {

        DialogFlowIntentResponseData df = new DialogFlowIntentResponseData();
        df.setDetectedIntent(detectedIntent);
        df.setFulFillmentText(fulFillmentText);
        df.setQueryText(queryText);
        df.setSentimentScore(sentimentScore);
        this.DiaglogFlowResponse = df;

    }

 

    
}
