const { getJwt } = require("../services/oauth.service");
const { callPostApi, callGetApi } = require("../services/api.service");
const { fetchDraftPdf } = require("../services/draftPdf.service");
const {
  mapList1099W2Request,
  mapTransmitRequest,
} = require("../mapper/form1099Utility.mapper");
const {
  HTTP_METHODS,
  FORM1099W2_API_ENDPOINTS,
} = require("../utils/constants");

// LIST
async function list(req, res) {
  try {
    let token = await getJwt();
    const payload = mapList1099UtilityRequest(req.body);

    const response = await callPostApi({
      method: HTTP_METHODS.POST,
      url: FORM1099W2_API_ENDPOINTS.LIST,
      token,
      data: payload,
    });

    res.status(response.status).json({ Response: response.data });
  } catch (err) {
    res.status(500).json({ Response: err });
  }
}

// STATUS
async function status(req, res) {
  try {
    let token = await getJwt();

    const params = {
      SubmissionId: req.query.SubmissionId || req.query.submissionid,
      RecordIds: req.query.RecordIds || req.query.recordids,
    };

    const response = await callGetApi({
      method: HTTP_METHODS.GET,
      url: FORM1099W2_API_ENDPOINTS.STATUS,
      token,
      params,
    });

    res.status(response.status).json({ Response: response.data });
  } catch (err) {
    res.status(500).json({ Response: err });
  }
}

// REQUEST DRAFT PDF URL
async function requestDraftPdfUrl(req, res) {
  try {
    let token = await getJwt();

    const params = {
      RecordId: req.query.RecordId || req.query.recordid,
    };

    const response = await callGetApi({
      method: HTTP_METHODS.GET,
      url: FORM1099W2_API_ENDPOINTS.REQUEST_DRAFT_PDF_URL,
      token,
      params,
    });

    res.status(response.status).json({ Response: response.data });
  } catch (err) {
    res.status(500).json({ Response: err });
  }
}

// DRAFT PDF FILE (S3 proxy)
async function draftPdfFile(req, res) {
  try {
    const draftPdfUrl = req.query.draftPdfUrl || req.query.DraftPdfUrl;
    if (!draftPdfUrl) {
      return res.status(404).end();
    }

    const file = await fetchDraftPdf(draftPdfUrl);
    if (file?.bytes?.length === 0) {
      return res.status(404).end();
    }

    res.set("Content-Disposition", `inline; filename=${file.fileName}`);
    res.status(200).type(file.contentType).send(file.bytes);
  } catch (err) {
    console.error(
      `draft pdf fetch failed for "${req.query.draftPdfUrl}":`,
      err,
    );
    res.status(404).end();
  }
}

// REQUEST PDF URLS
async function requestPdfUrls(req, res) {
  try {
    let token = await getJwt();

    const params = {
      SubmissionId: req.query.SubmissionId || req.query.submissionid,
      RecordId: req.query.RecordId || req.query.recordid,
    };

    const response = await callGetApi({
      method: HTTP_METHODS.GET,
      url: FORM1099W2_API_ENDPOINTS.REQUEST_PDF_URLS,
      token,
      params,
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
      SubmissionId: req.query.SubmissionId || req.query.submissionid,
      RecordIds: req.query.RecordIds || req.query.recordids,
    };

    const response = await callGetApi({
      method: HTTP_METHODS.DELETE,
      url: FORM1099W2_API_ENDPOINTS.DELETE,
      token,
      params,
    });

    res.status(response.status).json({ Response: response.data });
  } catch (err) {
    res.status(500).json({ Response: err });
  }
}

// TRANSMIT
async function transmit(req, res) {
  try {
    let token = await getJwt();
    const payload = mapTransmitRequest(req.body);

    const response = await callPostApi({
      method: HTTP_METHODS.POST,
      url: FORM1099W2_API_ENDPOINTS.TRANSMIT,
      token,
      data: payload,
    });

    res.status(response.status).json({ Response: response.data });
  } catch (err) {
    res.status(500).json({ Response: err });
  }
}

// STATUS LOG
async function statusLog(req, res) {
  try {
    let token = await getJwt();

    const params = {
      RecordId: req.query.RecordId || req.query.recordid,
    };

    const response = await callGetApi({
      method: HTTP_METHODS.GET,
      url: FORM1099W2_API_ENDPOINTS.STATUS_LOG,
      token,
      params,
    });

    res.status(response.status).json({ Response: response.data });
  } catch (err) {
    res.status(500).json({ Response: err });
  }
}

module.exports = {
  list,
  status,
  requestDraftPdfUrl,
  draftPdfFile,
  requestPdfUrls,
  remove,
  transmit,
  statusLog,
};
