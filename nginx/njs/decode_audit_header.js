function decodeAuditHeader(r) {
    r.log("Entering the decodeAuditHeader function");
    
    var encodedString = r.headersIn.Audit;
    if (!encodedString) {
        r.return(400, "Audit header missing");
        return;
    }

    try {
        var decodedBuffer = Buffer.from(encodedString, 'base64');
        var decodedString = decodedBuffer.toString('utf8');
        // Add logging
        r.error(`Decoded String: ${decodedString}`);
        var auditData = JSON.parse(decodedString);

        if (auditData && auditData.SignedData && auditData.SignedData.PartnerName) {
            r.return(200, auditData.SignedData.PartnerName);
        } else {
            r.return(400, "Invalid Audit data");
        }
    } catch (e) {
        r.return(500, `Error processing Audit header: ${e.message}`);
        // Add logging
        r.error(`Error: ${e.message}`);
    }
}

export default {decodeAuditHeader};
