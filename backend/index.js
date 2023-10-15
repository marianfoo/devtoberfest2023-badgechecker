const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

function getPacificMidnight(year, month, day) {
  // Create a date in local time for the given year, month, and day at noon
  let date = new Date(Date.UTC(year, month - 1, day, 12));
  
  // Calculate the time difference between UTC and Pacific Time in minutes
  let pacificOffset = (date.getTimezoneOffset() + 8 * 60) % (24 * 60); // 8 hours for PST

  // Adjust for Daylight Saving Time (DST) - This is an approximation and may not be accurate for all years
  if ((month > 3 && month < 11) || (month === 3 && day > 14) || (month === 11 && day < 7)) {
      pacificOffset -= 60; // Adjust by 1 hour for PDT
  }

  // Adjust the date by the Pacific offset
  date.setMinutes(date.getMinutes() - pacificOffset);

  // Reset the hours, minutes, seconds, and milliseconds to get the start of the day
  date.setHours(0, 0, 0, 0);
  
  return date;
}


app.get('/checkBadges', async (req, res) => {
  const scnId = req.query.scnId;
  if (!scnId) {
    return res.status(400).json({
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
    results;

    for (let i = 0; i < allBadges.length; i++) {
      const badge = allBadges[i];
      const userBadge = userBadges.find(
        (ub) => ub.displayName === badge.displayName
      );

      // Directly get the week and date from the badge.json data
      const week = badge.Week || 'Week 0';
      const date = badge.Date ? new Date(badge.Date) : null;

      // determine the type
      let type;
      if (week === 'Week 0') {
        type = 'No type';
      } else if (badge.URL && badge.URL.includes('week')) {
        type = 'Session';
      } else {
        type = 'Tutorial';
      }

      let endDate = getPacificMidnight(2023, 10, 16);

      let found;
      let points;
      if (Date.parse(badge.Date) < endDate) {
        found = !!userBadge;
        points = badge.points;
      } else {
        found = false;
        points = 0;
      }

      results.push({
        displayName: badge.displayName,
        badgeURL: badge.URL || '',
        found: found,
        points: points,
        type,
        week,
        date,
      });
    }

    res.json({
      results: results,
      level: userBadgesResponse.data.level,
      points: userBadgesResponse.data.points,
      userName: userBadgesResponse.data.userName,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal error occurred.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
