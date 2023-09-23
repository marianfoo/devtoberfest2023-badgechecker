const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises; // Importing promises API of fs module

async function fetchHtml(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch HTML from ${url}: ${error.message}`);
  }
}

async function parseTable(html) {
  const $ = cheerio.load(html);
  const rows = [];
  $('.lia-message-body-content table tbody tr').each((i, row) => {
    if (i === 0) return; // Skip the first row if it's in the tbody
    
    const $row = $(row);
    const day = $row.find('td:nth-child(1)').text().trim();
    const badgeCode = $row.find('td:nth-child(2)').text().trim();
    const contentWeekLink = $row.find('td:nth-child(3) a').attr('href') || null;
    rows.push({ day, badgeCode, contentWeekLink, week: 1 });
  });
  
  return rows;
}

async function getTableData(urls) {
    try {
      const allTableData = [];
      
      for (const { url, week } of urls) {
        const html = await fetchHtml(url);
        const tableData = await parseTable(html);
        
        // Add week property to each row
        tableData.forEach(row => row.week = week);
        allTableData.push(...tableData);
      }
  
      await fs.writeFile('../de.marianzeis.devtoberfestbadgechecker/webapp/data/tableData.json', JSON.stringify(allTableData, null, 2));
      console.log('Table data has been written to tableData.json');
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

// Specify the URLs and corresponding weeks
const urls = [
    { url: 'https://groups.community.sap.com/t5/devtoberfest-blog-posts/devtoberfest-2023-contest-activities-and-points-week-1/ba-p/286328', week: 1 },
    { url: 'https://groups.community.sap.com/t5/devtoberfest-blog-posts/devtoberfest-2023-contest-activities-and-points-week-2/ba-p/289111', week: 2 },
  ];
  
  getTableData(urls);
