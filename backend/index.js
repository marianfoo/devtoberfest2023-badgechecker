const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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
        // `https://people-api.services.sap.com/rs/badge/${scnId}?sort=timestamp,desc&size=1000`
        `https://devrel-tools-prod-scn-badges-srv.cfapps.eu10.hana.ondemand.com/devtoberfest/profile/${scnId}`
      ),
    ]);

    const allBadges = allBadgesResponse.data;
    const userBadges = userBadgesResponse.data.badges.content;
    results

    allBadges.forEach((badge) => {
      const userBadge = userBadges.find(
        (ub) => ub.displayName === badge.displayName
      );

      // Directly get the week and date from the badge.json data
      const week = badge.Week || 'Week 0';
      const date = badge.Date ? new Date(badge.Date) : null; // Convert string to JS Date object

      // determine the type
      let type;
      if (week === 'Week 0') {
        type = 'No type';
      } else if (badge.URL && badge.URL.includes('week')) {
        type = 'Session';
      } else {
        type = 'Tutorial';
      }

      results.push({
        displayName: badge.displayName,
        badgeURL: badge.URL || '',
        found: !!userBadge,
        points: badge.points,
        type,
        week,
        date,
      });
    });

    res.json({results:results,level:userBadgesResponse.data.level, points:userBadgesResponse.data.points, userName:userBadgesResponse.data.userName});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal error occurred.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
