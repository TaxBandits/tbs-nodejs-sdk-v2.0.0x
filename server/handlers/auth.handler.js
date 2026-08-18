const { getJwt } = require("../services/oauth.service");

async function getjwttoken(req, res) {
  try {
    const { Scope, Forms } = req.body;

    if (!Scope || !Forms) {
      return res.status(400).json({
        message: "scope and forms are required",
      });
    }

    const token = await getJwt(Scope, Forms);

    res.status(200).json({
      Response: token,
    });
  } catch (err) {
    res.status(500).json({
      Response: err,
    });
  }
}

module.exports = {
  getjwttoken,
};
