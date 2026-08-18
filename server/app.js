const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const businessRoutes = require("./routes/business.routes");
const recipientRoutes = require("./routes/recipient.routes");
const authRoutes = require("./routes/auth.routes");
const form1099UtilityRoutes = require("./routes/form1099Utility.routes");
const form1099NecRoutes = require("./routes/form1099nec.routes");
const form1099MiscRoutes = require("./routes/form1099misc.routes");

app.use("/auth", authRoutes);
app.use("/business", businessRoutes);
app.use("/recipient", recipientRoutes);
app.use("/form1099utility", form1099UtilityRoutes);
app.use("/form1099nec", form1099NecRoutes);
app.use("/form1099misc", form1099MiscRoutes);

const PORT = 5062;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
