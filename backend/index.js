const express = require('express');
const axios = require('axios');
const cors = require('cors');
const moment = require('moment'); // Importing the moment library
const tableData = require('./tableData.json');

const app = express();
app.use(cors());
app.use(express.json());

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const startDate = new Date('2023-09-18'); // This is the starting Monday of week 1

app.get('/checkBadges', async (req, res) => {
  const scnId = req.query.scnId;
  if (!scnId) {
    return res.status(400).json({ error: 'The function must be called with one argument "scnId".' });
  }

  try {
    const results = [];
    const [allBadgesResponse, userBadgesResponse] = await Promise.all([
      axios.get('https://raw.githubusercontent.com/SAP-samples/sap-community-activity-badges/main/srv/util/badges.json'),
      axios.get(`https://people-api.services.sap.com/rs/badge/${scnId}?sort=timestamp,desc&size=1000`)
    ]);

    const allBadges = allBadgesResponse.data;
    const userBadges = userBadgesResponse.data.content;

    allBadges.forEach((badge) => {
      const userBadge = userBadges.find((ub) => ub.displayName === badge.displayName);
      
      // Extracting week and day from tableData based on matching badgeCode with displayName
      const tableBadge = tableData.find((tb) => badge.displayName.includes(tb.badgeCode));
      const week = tableBadge ? tableBadge.week : 0;
      const dayString = tableBadge ? tableBadge.day : "";
      let date;
  
      // find if the day string contains any weekday and calculate the date
      for (let day of weekdays) {
        if (dayString.includes(day)) {
          const startDateWeekDay = startDate.getDay();
          const targetWeekDay = weekdays.indexOf(day);
          
          // Calculate date using the day and week info
          let dayDifference = targetWeekDay - startDateWeekDay + (7 * (week - 1));
          date = new Date(startDate);
          date.setDate(startDate.getDate() + dayDifference);
          break;
        }
      }
  
      results.push({
        displayName: badge.displayName,
        badgeURL: badge.URL || 'URL not found',
        found: !!userBadge,
        points: badge.points,
        week: "Week " + week,
        date // JS Date object
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
