const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json()); // To parse JSON body in incoming requests

app.get('/checkBadges', async (req, res) => {
    const scnId = req.query.scnId;
    const notFoundOnly = req.query.notFoundOnly || false;
    
    if (!scnId) {
        return res.status(400).json({ error: 'The function must be called with one argument "scnId".' });
    }
    
    try {
        const results = []; // To store the resulting badge object

        const allBadgesResponse = await axios.get('https://raw.githubusercontent.com/SAP-samples/sap-community-activity-badges/main/srv/util/badges.json');
        const allBadges = allBadgesResponse.data;

        const userBadgesResponse = await axios.get(`https://people-api.services.sap.com/rs/badge/${scnId}?sort=timestamp,desc&size=1000`);
        const userBadges = userBadgesResponse.data.content;

        allBadges.forEach((badge) => {
            const userBadge = userBadges.find((ub) =>
                ub.displayName.includes(badge.displayName)
            );

            results.push({
                displayName: badge.displayName,
                badgeURL: badge.URL || 'URL not found',
                found: !!userBadge,
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
