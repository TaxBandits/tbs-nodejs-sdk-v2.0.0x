const { getJwt } = require('../services/oauth.service');
const { callPostApi, callGetApi } = require('../services/api.service');
const { mapForm1099NecRequest } = require('../mapper/form1099nec.mapper');
const { HTTP_METHODS, FORM1099NEC_API_ENDPOINTS } = require('../utils/constants');

// CREATE
async function create(req, res) {
    try {
        let token = await getJwt();
        const payload = mapForm1099NecRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: FORM1099NEC_API_ENDPOINTS.CREATE,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
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
            url: FORM1099NEC_API_ENDPOINTS.GET,
            token,
            params
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
        const payload = mapForm1099NecRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.PUT,
            url: FORM1099NEC_API_ENDPOINTS.UPDATE,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// VALIDATE FORM
async function validateForm(req, res) {
    try {
        let token = await getJwt();
        const payload = mapForm1099NecRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: FORM1099NEC_API_ENDPOINTS.VALIDATE_FORM,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

module.exports = { create, get, update, validateForm };
