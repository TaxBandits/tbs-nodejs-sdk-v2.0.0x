const { getJwt } = require('../services/oauth.service');
const { callPostApi, callGetApi } = require('../services/api.service');
const { mapForm1099MiscRequest } = require('../mapper/form1099misc.mapper');
const { HTTP_METHODS, FORM1099MISC_API_ENDPOINTS } = require('../utils/constants');

// CREATE
async function create(req, res) {
    try {
        let token = await getJwt();
        const payload = mapForm1099MiscRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: FORM1099MISC_API_ENDPOINTS.CREATE,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// UPDATE
async function update(req, res) {
    try {
        let token = await getJwt();
        const payload = mapForm1099MiscRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.PUT,
            url: FORM1099MISC_API_ENDPOINTS.UPDATE,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// The upstream API returns this field as "MiscFormData" for the get
// endpoint, but the frontend expects "MISCFormData" (matching the
// casing used on create/update). Normalize it here so the box values
// aren't silently dropped.
function normalizeMiscFormDataKey(data) {
    const records = data?.Form1099Records;
    if (!Array.isArray(records)) return data;

    for (const record of records) {
        const returnData = record?.ReturnData;
        if (!Array.isArray(returnData)) continue;

        for (const rd of returnData) {
            if (rd && Object.prototype.hasOwnProperty.call(rd, 'MiscFormData')) {
                rd.MISCFormData = rd.MiscFormData;
                delete rd.MiscFormData;
            }
        }
    }

    return data;
}

// GET
async function get(req, res) {
    try {
        let token = await getJwt();

        const params = {
            RecordIds: req.query.RecordIds || req.query.recordids
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: FORM1099MISC_API_ENDPOINTS.GET,
            token,
            params
        });

        res.status(response.status).json({ Response: normalizeMiscFormDataKey(response.data) });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// VALIDATE FORM
async function validateForm(req, res) {
    try {
        let token = await getJwt();
        const payload = mapForm1099MiscRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: FORM1099MISC_API_ENDPOINTS.VALIDATE_FORM,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

module.exports = { create, update, get, validateForm };
