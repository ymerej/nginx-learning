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
            // Now that we have the PartnerName, we make a subrequest
            var partnerName = auditData.SignedData.PartnerName;
            makeSubrequest(r, partnerName);
        } else {
            r.return(400, "Invalid Audit data");
        }
    } catch (e) {
        r.return(500, `Error processing Audit header: ${e.message}`);
        // Add logging
        r.error(`Error: ${e.message}`);
    }
}

function makeSubrequest(r, partnerName) {
    // Construct the URL for the external website
    var url = `/external-service/?q=${partnerName}`;

    // Make the subrequest
    r.subrequest(url, function(res) {
        // Check if the subrequest was successful
        if (res.status === 200) {
            // Return the body of the subrequest response
            r.return(200, res.responseBody);
        } else {
            // Handle errors or non-200 status codes
            r.return(res.status, `Subrequest failed: ${res.responseBody}`);
        }
    });
}

export default {decodeAuditHeader};
