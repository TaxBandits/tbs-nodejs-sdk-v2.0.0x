const { getJwt } = require('../services/oauth.service');
const { callPostApi, callGetApi } = require('../services/api.service');
const { mapBusinessRequest, mapAddDBARequest } = require('../mapper/business.mapper');
const { HTTP_METHODS, BUSINESS_API_ENDPOINTS } = require('../utils/constants');

// CREATE
async function create(req, res) {
    try {
         // Read token from header
        let token = await getJwt()
        
        const payload = mapBusinessRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: BUSINESS_API_ENDPOINTS.CREATE,
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
        let token = await getJwt()

        const params = {
            BusinessId: req.query.BusinessId || req.query.businessid,
            TINType: req.query.TinType || req.query.tintype,
            TIN: req.query.Tin || req.query.tin,
            PayerRef: req.query.PayerRef || req.query.payerref
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: BUSINESS_API_ENDPOINTS.GET, // keep if API needs path param
            token,
            params // ADD THIS
        });

         res.status(response.status).json({ Response: response.data });

    } catch (err) {
        res.status(500).json({ Response: err });
    }
}


// UPDATE
async function update(req, res) {
    try {

        let token = await getJwt()
        const payload = mapBusinessRequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.PUT,
            url: BUSINESS_API_ENDPOINTS.UPDATE,
            token,
            data: payload
        });

         res.status(response.status).json({ Response: response.data });
    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// LIST
async function list(req, res) {
    try {
        let token = await getJwt()
        // Query params (case-insensitive)
        const Last4Digit = req.query.Last4Digit || req.query.last4digit;
        const ToDate = req.query.ToDate || req.query.todate;
        const FromDate = req.query.FromDate || req.query.fromdate;
        const Page = req.query.Page || req.query.page;
        const PageSize = req.query.PageSize || req.query.pagesize;
        const IsActive = req.query.IsActive || req.query.isactive;
        const PayerName = req.query.PayerName || req.query.payername;

        //boolean → int (same logic as Go)
        let isActive = null;

        if (IsActive !== undefined && IsActive !== null) {
            if (String(IsActive).toLowerCase() === "true") {
                isActive = 1;
            } else if (String(IsActive).toLowerCase() === "false") {
                isActive = 0;
            }
        }

        // Build request object
        const requestPayload = {
            Last4Digit: Last4Digit || null,
            FromDate: FromDate || null,
            ToDate: ToDate || null,
            Page: Page ? parseInt(Page) : 0,
            PageSize: PageSize ? parseInt(PageSize) : 0,
            IsActive: isActive,
            PayerName : PayerName || null
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: BUSINESS_API_ENDPOINTS.LIST, // keep if API needs path param
            token,
            params: requestPayload // ADD THIS
        });

         res.status(response.status).json({ Response: response.data });

    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// DELETE
async function remove(req, res) {
    try {
        let token = await getJwt()

        // Query params (case-insensitive)
        const BusinessId = req.query.BusinessIds || req.query.businessids;
        const PayerRef = req.query.PayerRef || req.query.payerref;
        const IsForceDelete = req.query.IsForceDelete || req.query.isforcedelete;

        //boolean → int (same logic as Go)
        let isForceDelete = null;

        if (IsForceDelete !== undefined && IsForceDelete !== null) {
            if (String(IsForceDelete).toLowerCase() === "true") {
                isForceDelete = 1;
            } else if (String(IsForceDelete).toLowerCase() === "false") {
                isForceDelete = 0;
            }
        }

        // Build request object
        const requestPayload = {
            BusinessIds: BusinessId || null,
            PayerRefs: PayerRef || null,
            IsForceDelete: isForceDelete || null,
        };

        const response = await callGetApi({
            method: HTTP_METHODS.DELETE,
            url: BUSINESS_API_ENDPOINTS.DELETE, // keep if API needs path param
            token,
            params: requestPayload // ADD THIS
        });

         res.status(response.status).json({ Response: response.data });

    } catch (err) {
        res.status(500).json({ Response: err });
    }
}


// ACTIVE
async function reactivate(req, res) {
    try {
        let token = await getJwt()

        const BusinessIds = req.query.BusinessIds || req.query.businessids;
        const PayerRefs = req.query.PayerRefs || req.query.payerrefs;

        const params = {
            BusinessIds: BusinessIds,
            PayerRefs: PayerRefs
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url:BUSINESS_API_ENDPOINTS.REACTIVE, // keep if API needs path param
            token,
            params // ADD THIS
        });

         res.status(response.status).json({ Response: response.data });

    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

// DEACTIVE
async function deactivate(req, res) {
    try {
        let token = await getJwt()

        const BusinessIds = req.query.BusinessIds || req.query.businessids;
        const PayerRefs = req.query.PayerRefs || req.query.payerrefs;

        const params = {
            BusinessIds: BusinessIds,
            PayerRefs: PayerRefs
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: BUSINESS_API_ENDPOINTS.DEACTIVE, // keep if API needs path param
            token,
            params // ADD THIS
        });

         res.status(response.status).json({ Response: response.data });

    } catch (err) {
        res.status(500).json({ Response: err });
    }
}


// CREATE DBA
async function adddba(req, res) {
    try {
        let token = await getJwt()

        const payload = mapAddDBARequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.POST,
            url: BUSINESS_API_ENDPOINTS.CREATEDBA,
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
        let token = await getJwt()
        const payload = mapAddDBARequest(req.body);

        const response = await callPostApi({
            method: HTTP_METHODS.PUT,
            url: BUSINESS_API_ENDPOINTS.UPDATEDBA,
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

        let token = await getJwt()

        // Query params (case-insensitive)
        const BusinessId = req.query.BusinessId || req.query.businessid;
        const PayerRef = req.query.PayerRef || req.query.payerref;
        const Page = req.query.Page || req.query.page;
        const PageSize = req.query.PageSize || req.query.pagesize;

        // Build request object
        const requestPayload = {
            BusinessId: BusinessId || null,
            PayerRef: PayerRef || null,
            Page: Page || null,
            PageSize: PageSize || null
        };

        const response = await callGetApi({
            method: HTTP_METHODS.GET,
            url: BUSINESS_API_ENDPOINTS.LISTDBA, // keep if API needs path param
            token,
            params: requestPayload // ADD THIS
        });

         res.status(response.status).json({ Response: response.data });

    } catch (err) {
        res.status(500).json({ Response: err });
    }
}


// DELETE DBA
async function deletedba(req, res) {
    try {

        let token = await getJwt()

        // Query params (case-insensitive)
        const BusinessId = req.query.BusinessId || req.query.businessid;
        const PayerRef = req.query.PayerRef || req.query.payerref;
        const DBAIds = req.query.DBAIds || req.query.dbaids;
        const DBARefs = req.query.DBARefs || req.query.dbarefs;

        // Build request object
        const requestPayload = {
            BusinessId: BusinessId || null,
            PayerRef: PayerRef || null,
            DBAIds: DBAIds || null,
            DBARefs: DBARefs || null
        };

        const response = await callGetApi({
            method: HTTP_METHODS.DELETE,
            url: BUSINESS_API_ENDPOINTS.DELETEDBA, // keep if API needs path param
            token,
            params: requestPayload // ADD THIS
        });

         res.status(response.status).json({ Response: response.data });

    } catch (err) {
        res.status(500).json({ Response: err });
    }
}

module.exports = {
    create,
    get,
    list,
    update,
    remove,
    reactivate,
    deactivate,
    adddba,
    updatedba,
    listdba,
    deletedba
};