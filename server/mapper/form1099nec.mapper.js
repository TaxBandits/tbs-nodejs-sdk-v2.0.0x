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

function mapNecStateDetails(states = []) {
    if (!Array.isArray(states)) return [];

    return states
        .map(s => clean({
            StateCd: s.StateCd,
            StateIdNum: s.StateIdNum,
            StateWH: s.StateWH,
            StateIncome: s.StateIncome
        }))
        .filter(Boolean);
}

function mapNecFormData(fd) {
    if (!fd) return undefined;

    return clean({
        NEC: fd.NEC,
        CashTips: fd.CashTips,
        TTOC1: fd.TTOC1,
        TTOC2: fd.TTOC2,
        OvertimeComp: fd.OvertimeComp,
        IsDirectSales: fd.IsDirectSales,
        EPP: fd.EPP,
        FedTaxWH: fd.FedTaxWH,
        Is2ndTINnot: fd.Is2ndTINnot,
        AccountNum: fd.AccountNum,
        States: mapNecStateDetails(fd.States)
    });
}

/**
 * Form1099NecCreateRequest mapper (also used for Update)
 */
function mapForm1099NecRequest(body = {}) {
    const returnData = Array.isArray(body.ReturnData)
        ? body.ReturnData.map(rd => clean({
            SequenceId: rd.SequenceId,
            ReturnManifest: mapReturnManifest(rd.ReturnManifest),
            RecordId: rd.RecordId,
            Recipient: rd.Recipient,
            NECFormData: mapNecFormData(rd.NECFormData)
        })).filter(Boolean)
        : [];

    return {
        SubmissionManifest: mapSubmissionManifest(body.SubmissionManifest),
        ReturnHeader: body.ReturnHeader && { Business: body.ReturnHeader.Business },
        ReturnData: returnData
    };
}

module.exports = { mapForm1099NecRequest };
