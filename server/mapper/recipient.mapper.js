function isValid(value) {
    return value !== null && value !== undefined && value !== "";
}

/**
 * Safe nested object cleaner
 */
function clean(obj) {
    if (!obj) return undefined;

    const result = {};

    Object.keys(obj).forEach(key => {
        const value = obj[key];

        if (Array.isArray(value)) {
            const arr = value
                .map(v => (v !== null && typeof v === "object") ? clean(v) : v)
                .filter(v => v !== undefined && isValid(v));

            if (arr.length) result[key] = arr;
            return;
        }

        if (typeof value === "object" && value !== null) {
            const cleaned = clean(value);
            if (cleaned && Object.keys(cleaned).length > 0) {
                result[key] = cleaned;
            }
            return;
        }

        if (isValid(value)) {
            result[key] = value;
        }
    });

    return Object.keys(result).length ? result : undefined;
}

/**
 * Address Mapper
 */
function mapAddress(addr) {
    if (!addr) return undefined;

    return clean({
        Address1: addr.Address1,
        Address2: addr.Address2,
        City: addr.City,
        ProvinceOrState: addr.ProvinceOrState,
        ZipCd: addr.ZipCd,
        Country: addr.Country
    });
}

/**
 * FULL Recipient Mapper (safe + complete)
 */
function mapRecipientsRequest(body) {
    if (!body || !Array.isArray(body.Recipients)) {
        return { Recipients: [] };
    }

    const recipients = body.Recipients.map(r => {
        const mapped = {
            SequenceId: r.SequenceId,
            RecipientId: r.RecipientId,
            PayeeRef: r.PayeeRef,

            TINDetails: r.TINDetails && {
                TINType: r.TINDetails.TINType,
                TIN: r.TINDetails.TIN,
                Format: r.TINDetails.Format,
                TINToken: r.TINDetails.TINToken
            },

            IndividualNm: r.IndividualNm && {
                FirstNm: r.IndividualNm.FirstNm,
                MiddleNm: r.IndividualNm.MiddleNm,
                LastNm: r.IndividualNm.LastNm,
                Suffix: r.IndividualNm.Suffix
            },

            BusinessNm: r.BusinessNm,
            NameCtrl: r.NameCtrl,

            DBADetails: r.DBADetails && {
                SequenceId: r.DBADetails.SequenceId,
                DBANm: r.DBADetails.DBANm,
                DBARef: r.DBADetails.DBARef,
                DBAId: r.DBADetails.DBAId,
                Address: mapAddress(r.DBADetails.Address)
            },

            Address: mapAddress(r.Address),

            DOB: r.DOB,
            Email: r.Email,
            Fax: r.Fax,
            Phone: r.Phone,

            W9Details: r.W9Details && {
                FedTaxClassification: r.W9Details.FedTaxClassification,
                ExemptPayeeCd: r.W9Details.ExemptPayeeCd,
                FATCACode: r.W9Details.FATCACode,
                IsBackupWth: r.W9Details.IsBackupWth
            },

            W8BenDetails: r.W8BenDetails && {
                CitizenOfCountry: r.W8BenDetails.CitizenOfCountry,
                FTIN: r.W8BenDetails.FTIN,
                IsFTINNotLegallyRequired: r.W8BenDetails.IsFTINNotLegallyRequired
            },

            Form1042SDetails: r.Form1042SDetails && {
                Ch3Cd: r.Form1042SDetails.Ch3Cd,
                Ch4Cd: r.Form1042SDetails.Ch4Cd,
                GIIN: r.Form1042SDetails.GIIN,
                LOBCode: r.Form1042SDetails.LOBCode
            }
        };

        return clean(mapped);
    });

    return {
        Recipients: recipients.filter(Boolean)
    };
}

/**
 * Assign / Unassign Recipients Mapper
 */
function mapAssignRecipientsRequest(body) {
    if (!body) return {};

    const mapped = {
        BusinessId: body.BusinessId,
        PayerRef: body.PayerRef,
        AssignRecipients: Array.isArray(body.AssignRecipients)
            ? body.AssignRecipients.map(a => clean({
                SequenceId: a.SequenceId,
                RecipientId: a.RecipientId,
                PayeeRef: a.PayeeRef
            })).filter(Boolean)
            : undefined
    };

    return clean(mapped);
}

function mapUnassignRecipientsRequest(body) {
    if (!body) return {};

    const mapped = {
        BusinessId: body.BusinessId,
        PayerRef: body.PayerRef,
        UnAssignRecipients: Array.isArray(body.UnAssignRecipients)
            ? body.UnAssignRecipients.map(a => clean({
                SequenceId: a.SequenceId,
                RecipientId: a.RecipientId,
                PayeeRef: a.PayeeRef
            })).filter(Boolean)
            : undefined
    };

    return clean(mapped);
}

/**
 * Recipient DBA Details Mapper
 */
function mapRecipientDBADetails(details = []) {
    if (!Array.isArray(details)) return [];

    return details
        .map(d => {
            const mapped = {
                SequenceId: d.SequenceId,
                DBANm: d.DBANm,
                DBARef: d.DBARef,
                DBAId: d.DBAId, // keep as-is (UUID string expected)
                Address: mapAddress(d.Address)
            };

            return clean(mapped);
        })
        .filter(Boolean);
}

/**
 * Main Mapper: RecipientAddDBARequest
 */
function mapRecipientAddDBARequest(body) {
    if (!body) return {};

    const mapped = {
        RecipientId: body.RecipientId,
        PayeeRef: body.PayeeRef,
        DBADetails: mapRecipientDBADetails(body.DBADetails)
    };

    return clean(mapped);
}

module.exports = {
    mapRecipientsRequest,
    mapAssignRecipientsRequest,
    mapUnassignRecipientsRequest,
    mapRecipientAddDBARequest
};
