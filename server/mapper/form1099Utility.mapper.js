function isValid(value) {
  return value !== null && value !== undefined && value !== "";
}

function clean(obj) {
  if (!obj) return undefined;

  const result = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (Array.isArray(value)) {
      const arr = value
        .map((v) => (v !== null && typeof v === "object" ? clean(v) : v))
        .filter((v) => v !== undefined && isValid(v));

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
 * List1099UtilityRequest mapper
 */
function mapList1099UtilityRequest(body = {}) {
  const mapped = {
    TaxYear: body.TaxYear,
    FormTypes: body.FormTypes,
    Business: body.Business && {
      BusinessId: body.Business.BusinessId,
      PayerRef: body.Business.PayerRef,
      BusinessNm: body.Business.BusinessNm,
      PayerTIN: body.Business.PayerTIN,
      TINType: body.Business.TINType,
    },
    Recipient: body.Recipient && {
      RecipientId: body.Recipient.RecipientId,
      PayeeRef: body.Recipient.PayeeRef,
      RecipientNm: body.Recipient.RecipientNm,
      RecipientTIN: body.Recipient.RecipientTIN,
      TINType: body.Recipient.TINType,
    },
    SubmissionId: body.SubmissionId,
    FederalStatus: body.FederalStatus,
    State: body.State && {
      StateCd: body.State.StateCd,
      Status: body.State.Status,
    },
    Distribution: body.Distribution && {
      OAStatus: body.Distribution.OAStatus,
      PostalStatus: body.Distribution.PostalStatus,
    },
    FromDate: body.FromDate,
    ToDate: body.ToDate,
    Page: body.Page,
    PageSize: body.PageSize,
    Employee: body.Employee && {
      EmployeeId: body.Employee.EmployeeId,
      EmployeeRef: body.Employee.EmployeeRef,
      EmployeeNm: body.Employee.EmployeeNm,
      EmployeeTIN: body.Employee.EmployeeTIN,
      EmployeeTINType: body.Employee.EmployeeTINType,
    },
  };

  return clean(mapped) || {};
}

/**
 * TransmitRequest mapper
 */
function mapTransmitRequest(body = {}) {
  const mapped = {
    SubmissionId: body.SubmissionId,
    RecordIds: body.RecordIds,
  };

  return clean(mapped) || {};
}

module.exports = { mapList1099UtilityRequest, mapTransmitRequest };
