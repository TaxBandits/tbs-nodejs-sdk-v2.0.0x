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
 * FULL Business Mapper (safe + complete)
 */
function mapBusinessRequest(body) {
    if (!body || !Array.isArray(body.Businesses)) {
        return { Businesses: [] };
    }

    const businesses = body.Businesses.map(b => {
        const mapped = {
            SequenceId: b.SequenceId,
            BusinessId: b.BusinessId,
            PayerRef: b.PayerRef,
            IsDefaultBusiness: b.IsDefaultBusiness,
            IsActive: b.IsActive,

            TINDetails: b.TINDetails && {
                Format: b.TINDetails.Format,
                TINType: b.TINDetails.TINType,
                TIN: b.TINDetails.TIN
            },

            IndividualNm: b.IndividualNm && {
                FirstNm: b.IndividualNm.FirstNm,
                MiddleNm: b.IndividualNm.MiddleNm,
                LastNm: b.IndividualNm.LastNm,
                Suffix: b.IndividualNm.Suffix
            },

            BusinessNm: b.BusinessNm,
            NameCtrl: b.NameCtrl,

            DBADetails: b.DBADetails,

            Address: b.Address,

            ContactDetails: b.ContactDetails && {
                FirstNm: b.ContactDetails.FirstNm,
                MiddleNm: b.ContactDetails.MiddleNm,
                LastNm: b.ContactDetails.LastNm,
                Suffix: b.ContactDetails.Suffix,
                Phone: b.ContactDetails.Phone,
                PhoneExtn: b.ContactDetails.PhoneExtn,
                Email: b.ContactDetails.Email,
                Fax: b.ContactDetails.Fax
            },

            W2Specific: b.W2Specific && {
                KindOfEmployer: b.W2Specific.KindOfEmployer,
                KindOfPayer: b.W2Specific.KindOfPayer
            },

            Form1042SSpecific: b.Form1042SSpecific && {
                WHAgtCh3Cd: b.Form1042SSpecific.WHAgtCh3Cd,
                WHAgtCh4Cd: b.Form1042SSpecific.WHAgtCh4Cd,
                WHAgtGIIN: b.Form1042SSpecific.WHAgtGIIN,
                FTIN: b.Form1042SSpecific.FTIN,
                Country: b.Form1042SSpecific.Country
            },

            ACASpecific: b.ACASpecific && {
                IsInsurer: b.ACASpecific.IsInsurer,
                IsGovernmentalUnit: b.ACASpecific.IsGovernmentalUnit
            },

            Form480Specific: b.Form480Specific && {
                TaxPayerType: b.Form480Specific.TaxPayerType
            },

            BusinessType: b.BusinessType,

            SigningAuthority: b.SigningAuthority && {
                FirstNm: b.SigningAuthority.FirstNm,
                MiddleNm: b.SigningAuthority.MiddleNm,
                LastNm: b.SigningAuthority.LastNm,
                Suffix: b.SigningAuthority.Suffix,
                Phone: b.SigningAuthority.Phone,
                PhoneExtn: b.SigningAuthority.PhoneExtn,
                BusinessMemberType: b.SigningAuthority.BusinessMemberType
            }
        };

        return clean(mapped);
    });

    return {
        Businesses: businesses.filter(Boolean)
    };
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
 * DBA Details Mapper
 */
function mapDBADetails(details = []) {
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
 * Main Mapper: AddDBARequest
 */
function mapAddDBARequest(body) {
    if (!body) return {};

    const mapped = {
        BusinessId: body.BusinessId,
        PayerRef: body.PayerRef,
        DBADetails: mapDBADetails(body.DBADetails)
    };

    return clean(mapped);
}

module.exports = {
    mapBusinessRequest, mapAddDBARequest
};