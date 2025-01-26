const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(express.json());

//cPanel credentials (replace with your own)
const CPANEL_USERNAME = "precio71";
const CPANEL_API_TOKEN = "VHUMIT6D3LCT406FG5AB7QH10VESBDL3";
const CPANEL_BASE_URL = "https://precioussproutsacademy.org.ng:2083/execute";


// const CPANEL_USERNAME = process.env.REACT_APP_CPANEL_USER;
// const CPANEL_API_TOKEN = process.env.REACT_APP_CPANEL_TOKEN;
// const CPANEL_BASE_URL = process.env.REACT_APP_CPANEL_DOMAIN;


// Helper function to create cPanel API headers
const getCpanelHeaders = () => ({
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: `cpanel ${CPANEL_USERNAME}:${CPANEL_API_TOKEN}`,
});

// Add a cPanel email account
app.post("/api/add-email", async (req, res) => {
  const { email, domain, password, quota } = req.body;

  try {
    const response = await axios.post(
      `${CPANEL_BASE_URL}/Email/add_pop`,
      new URLSearchParams({ email, domain, password, quota }).toString(),
      { headers: getCpanelHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      data: error.response?.data,
    });
  }
});

// Change cPanel email account password
app.post("/api/change-password", async (req, res) => {
  const { email, domain, newPassword } = req.body;

  try {
    const response = await axios.post(
      `${CPANEL_BASE_URL}/Email/passwd_pop`,
      new URLSearchParams({ email, domain, password: newPassword }).toString(),
      { headers: getCpanelHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      data: error.response?.data,
    });
  }
});

// Delete a cPanel email account
app.post("/api/delete-mail", async (req, res) => {
  const { email, domain } = req.body;

  try {
    const response = await axios.post(
      `${CPANEL_BASE_URL}/Email/del_pop`,
      new URLSearchParams({ email, domain }).toString(),
      { headers: getCpanelHeaders() }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      data: error.response?.data,
    });
  }
});

// Suspend a email account
app.post("/api/suspend-account", async (req, res) => {
    const { email } = req.body;
  
    try {
      const [username, domain] = email.split("@");
      if (!username || !domain) {
        return res.status(400).json({ error: "Invalid email format." });
      }
  
      const response = await axios.post(
        `${CPANEL_BASE_URL}/Email/edit_pop_quota`,
        new URLSearchParams({
          email: username,
          domain: domain,
          quota: 1, // Set quota to 0 MB
        }).toString(),
        { headers: getCpanelHeaders() }
      );
  
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.message,
        data: error.response?.data,
      });
    }
  });
  
  


// Get all emails in the cPanel account
app.get("/api/get-mails", async (req, res) => {
    try {
      const response = await axios.get(
        `${CPANEL_BASE_URL}/Email/list_pops`,
        { headers: getCpanelHeaders() }
      );
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.message,
        data: error.response?.data,
      });
    }
  });

// Unsuspend a email account
app.post("/api/unsuspend-account", async (req, res) => {
    const { email } = req.body;
  
    try {
      // Split email into username and domain
      const [username, domain] = email.split("@");
  
      // Ensure both username and domain are provided
      if (!username || !domain) {
        return res.status(400).json({ error: "Invalid email format." });
      }
  
      const response = await axios.post(
        `${CPANEL_BASE_URL}/Email/unsuspend_pop`,
        new URLSearchParams({
          email: username,
          domain: domain,
        }).toString(),
        { headers: getCpanelHeaders() }
      );
  
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        error: error.message,
        data: error.response?.data,
      });
    }
  });
  

const PORT = 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
