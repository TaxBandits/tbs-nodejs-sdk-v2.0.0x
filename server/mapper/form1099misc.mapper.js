function isValid(value) {
    return value !== null && value !== undefined && value !== "";
}

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

function mapSubmissionManifest(sm) {
    if (!sm) return undefined;

    return clean({
        SubmissionId: sm.SubmissionId,
        TaxYear: sm.TaxYear,
        IsScheduleFiling: sm.IsScheduleFiling,
        ScheduleFiling: sm.ScheduleFiling && {
            EfileDate: sm.ScheduleFiling.EfileDate
        }
    });
}

function mapReturnManifest(rm) {
    if (!rm) return undefined;

    return clean({
        IsPostal: rm.IsPostal,
        IsFederal: rm.IsFederal,
        IsState: rm.IsState,
        IsDistribution: rm.IsDistribution,
        DistributionDetails: rm.DistributionDetails && {
            DistributionType: rm.DistributionDetails.DistributionType,
            PostalType: rm.DistributionDetails.PostalType
        },
        IsForced: rm.IsForced
    });
}

function mapMiscStateDetails(states = []) {
    if (!Array.isArray(states)) return [];

    return states
        .map(s => clean({
            StateCd: s.StateCd,
            StateWH: s.StateWH,
            StateIdNum: s.StateIdNum,
            StateIncome: s.StateIncome
        }))
        .filter(Boolean);
}

function mapMiscFormData(fd) {
    if (!fd) return undefined;

    return clean({
        Rents: fd.Rents,
        Royalties: fd.Royalties,
        OtherIncome: fd.OtherIncome,
        FedIncomeTaxWH: fd.FedIncomeTaxWH,
        FishingBoatProceeds: fd.FishingBoatProceeds,
        MedHealthcarePymts: fd.MedHealthcarePymts,
        IsDirectSale: fd.IsDirectSale,
        SubstitutePymts: fd.SubstitutePymts,
        CropInsurance: fd.CropInsurance,
        GrossProceeds: fd.GrossProceeds,
        FishPurForResale: fd.FishPurForResale,
        Sec409ADeferrals: fd.Sec409ADeferrals,
        CashTips: fd.CashTips,
        TTOC1: fd.TTOC1,
        TTOC2: fd.TTOC2,
        OvertimeComp: fd.OvertimeComp,
        IsFATCA: fd.IsFATCA,
        EPP: fd.EPP,
        NonQualDefComp: fd.NonQualDefComp,
        AccountNum: fd.AccountNum,
        Is2ndTINnot: fd.Is2ndTINnot,
        States: mapMiscStateDetails(fd.States)
    });
}

/**
 * Form1099MiscCreateRequest mapper (also used for Update)
 */
function mapForm1099MiscRequest(body = {}) {
    const returnData = Array.isArray(body.ReturnData)
        ? body.ReturnData.map(rd => clean({
            SequenceId: rd.SequenceId,
            ReturnManifest: mapReturnManifest(rd.ReturnManifest),
            Recipient: rd.Recipient,
            RecordId: rd.RecordId,
            MISCFormData: mapMiscFormData(rd.MISCFormData)
        })).filter(Boolean)
        : [];

    return {
        SubmissionManifest: mapSubmissionManifest(body.SubmissionManifest),
        ReturnHeader: body.ReturnHeader && { Business: body.ReturnHeader.Business },
        ReturnData: returnData
    };
}

module.exports = { mapForm1099MiscRequest };
