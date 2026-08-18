const { getJwt } = require('../services/oauth.service');
const { callPostApi, callGetApi } = require('../services/api.service');
const {
    mapRecipientsRequest,
    mapAssignRecipientsRequest,
    mapUnassignRecipientsRequest,
    mapRecipientAddDBARequest
} = require('../mapper/recipient.mapper');
const { HTTP_METHODS, RECIPIENT_API_ENDPOINTS } = require('../utils/constants');

// LIST
async function list(req, res) {
    try {
        let token = await getJwt();

        const BusinessId = req.query.BusinessId || req.query.businessid;
        const PayerRef = req.query.PayerRef || req.query.payerref;
        const Page = req.query.Page || req.query.page;
        const PageSize = req.query.PageSize || req.query.pagesize;
        const FromDate = req.query.FromDate || req.query.fromdate;
        const ToDate = req.query.ToDate || req.query.todate;
        const IsActive = req.query.IsActive || req.query.isactive;

        const params = {
            BusinessId: BusinessId || null,
            PayerRef: PayerRef || null,
            Page: Page || null,
            PageSize: PageSize || null,
            FromDate: FromDate || null,
            ToDate: ToDate || null,
            IsActive: IsActive !== undefined ? IsActive : null
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: RECIPIENT_API_ENDPOINTS.LIST,
            token,
            params
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
            RecipientId: req.query.RecipientId || req.query.recipientid
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: RECIPIENT_API_ENDPOINTS.GET,
            token,
            params
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// CREATE
async function create(req, res) {
    try {
        let token = await getJwt();

        const payload = mapRecipientsRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: RECIPIENT_API_ENDPOINTS.CREATE,
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

        const payload = mapRecipientsRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.PUT,
            url: RECIPIENT_API_ENDPOINTS.UPDATE,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// DELETE
async function remove(req, res) {
    try {
        let token = await getJwt();

        const params = {
            RecipientId: req.query.RecipientId || req.query.recipientid
        };

        const response = await callGetApi({
            method: HTTP_METHODS.DELETE,
            url: RECIPIENT_API_ENDPOINTS.DELETE,
            token,
            params
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// REACTIVATE
async function reactivate(req, res) {
    try {
        let token = await getJwt();

        const params = {
            RecipientIds: req.query.RecipientIds || req.query.recipientids
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: RECIPIENT_API_ENDPOINTS.REACTIVE,
            token,
            params
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// DEACTIVATE
async function deactivate(req, res) {
    try {
        let token = await getJwt();

        const params = {
            RecipientIds: req.query.RecipientIds || req.query.recipientids
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: RECIPIENT_API_ENDPOINTS.DEACTIVE,
            token,
            params
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// ASSIGN RECIPIENTS
async function assignrecipients(req, res) {
    try {
        let token = await getJwt();

        const payload = mapAssignRecipientsRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: RECIPIENT_API_ENDPOINTS.ASSIGN,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// UNASSIGN RECIPIENTS
async function unassignrecipients(req, res) {
    try {
        let token = await getJwt();

        const payload = mapUnassignRecipientsRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: RECIPIENT_API_ENDPOINTS.UNASSIGN,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// ADD DBA
async function adddba(req, res) {
    try {
        let token = await getJwt();

        const payload = mapRecipientAddDBARequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: RECIPIENT_API_ENDPOINTS.CREATEDBA,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// UPDATE DBA
async function updatedba(req, res) {
    try {
        let token = await getJwt();

        const payload = mapRecipientAddDBARequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.PUT,
            url: RECIPIENT_API_ENDPOINTS.UPDATEDBA,
            token,
            data: payload
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// LIST DBA
async function listdba(req, res) {
    try {
        let token = await getJwt();

        const RecipientId = req.query.RecipientId || req.query.recipientid;
        const PayeeRef = req.query.PayeeRef || req.query.payeeref;
        const Page = req.query.Page || req.query.page;
        const PageSize = req.query.PageSize || req.query.pagesize;

        const params = {
            RecipientId: RecipientId || null,
            PayeeRef: PayeeRef || null,
            Page: Page || null,
            PageSize: PageSize || null
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: RECIPIENT_API_ENDPOINTS.LISTDBA,
            token,
            params
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// DELETE DBA
async function deletedba(req, res) {
    try {
        let token = await getJwt();

        const RecipientId = req.query.RecipientId || req.query.recipientid;
        const PayeeRef = req.query.PayeeRef || req.query.payeeref;
        const DBAId = req.query.DBAId || req.query.dbaid;
        const DBARef = req.query.DBARef || req.query.dbaref;
        const IsForcedDelete = req.query.IsForcedDelete || req.query.isforceddelete;

        const params = {
            RecipientId: RecipientId || null,
            PayeeRef: PayeeRef || null,
            DBAId: DBAId || null,
            DBARef: DBARef || null,
            IsForcedDelete: IsForcedDelete !== undefined ? IsForcedDelete : null
        };

        const response = await callGetApi({
            method: HTTP_METHODS.DELETE,
            url: RECIPIENT_API_ENDPOINTS.DELETEDBA,
            token,
            params
        });

        res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

module.exports = {
    list,
    get,
    create,
    update,
    remove,
    reactivate,
    deactivate,
    assignrecipients,
    unassignrecipients,
    adddba,
    updatedba,
    listdba,
    deletedba
};
