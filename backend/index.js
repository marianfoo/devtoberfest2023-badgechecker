const express = require('express');
const axios = require('axios');
const cors = require('cors');
const tableData = require('./tableData.json'); // Replace with the actual path to tableData.json

const app = express();

// Enable All CORS Requests
app.use(cors());

app.use(express.json()); // To parse JSON body in incoming requests

app.get('/checkBadges', async (req, res) => {
  const scnId = req.query.scnId;

  if (!scnId) {
    return res
      .status(400)
      .json({
        error: 'The function must be called with one argument "scnId".',
      });
  }

  try {
    const results = [];

    const [allBadgesResponse, userBadgesResponse] = await Promise.all([
      axios.get(
        'https://raw.githubusercontent.com/SAP-samples/sap-community-activity-badges/main/srv/util/badges.json'
      ),
      axios.get(
        `https://people-api.services.sap.com/rs/badge/${scnId}?sort=timestamp,desc&size=1000`
      ),
    ]);

    const allBadges = allBadgesResponse.data;
    const userBadges = userBadgesResponse.data.content;

    allBadges.forEach((badge) => {
      const userBadge = userBadges.find((ub) => ub.displayName.includes(badge.displayName));
  
      // Extracting week from tableData based on matching badgeCode with displayName
      const tableBadge = tableData.find((tb) => badge.displayName.includes(tb.badgeCode));
      const week = tableBadge ? tableBadge.week : 0;

      results.push({
        displayName: badge.displayName,
        badgeURL: badge.URL || 'URL not found',
        found: !!userBadge,
        points: badge.points,
        week: "Week " + week,
      });
    });

    res.json(results);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal error occurred.' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
