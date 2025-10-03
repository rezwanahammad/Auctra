# Auction Completion Cron Job Setup

This document explains how to set up automatic auction completion for the Auctra platform.

## Overview

The system provides an API endpoint that automatically completes expired auctions by:

1. Finding all active auctions where `endTime` has passed
2. Determining the highest bidder (if any)
3. Checking if reserve prices are met
4. Setting the winner and updating user statistics
5. Marking auctions as "ended"

## API Endpoint

**POST** `/api/cron/complete-auctions`

### Authentication

The endpoint requires a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_CRON_SECRET
```

Set the `CRON_SECRET` environment variable in your `.env.local` file:

```
CRON_SECRET=your-secure-random-string-here
```

### Response Format

```json
{
  "success": true,
  "message": "Processed 5 auctions. 4 completed successfully, 1 failed.",
  "processedCount": 4,
  "completedAuctions": [
    {
      "auctionId": "507f1f77bcf86cd799439011",
      "title": "Vintage Watch",
      "winner": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "winningBid": 150.0,
      "hadReserve": true,
      "reserveMet": true
    }
  ],
  "errors": []
}
```

## Setup Options

### Option 1: External Cron Service (Recommended)

Use a service like:

- **Vercel Cron Jobs** (if deploying on Vercel)
- **GitHub Actions** (with scheduled workflows)
- **EasyCron.com**
- **cron-job.org**

Example cURL command to run every minute:

```bash
curl -X POST https://your-domain.com/api/cron/complete-auctions \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

### Option 2: Vercel Cron Jobs

If using Vercel, create a `vercel.json` file in your root directory:

```json
{
  "crons": [
    {
      "path": "/api/cron/complete-auctions",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

Note: You'll need to modify the API to handle GET requests for Vercel crons.

### Option 3: GitHub Actions

Create `.github/workflows/complete-auctions.yml`:

```yaml
name: Complete Auctions
on:
  schedule:
    - cron: "*/1 * * * *" # Every minute
jobs:
  complete-auctions:
    runs-on: ubuntu-latest
    steps:
      - name: Call completion endpoint
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/cron/complete-auctions \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

### Option 4: Node.js Cron Job (Development)

For development/testing, you can create a simple Node.js script:

```javascript
// scripts/cron-complete-auctions.js
const cron = require("node-cron");

cron.schedule("*/1 * * * *", async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/cron/complete-auctions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    console.log("[CRON]", result.message);
  } catch (error) {
    console.error("[CRON] Failed to complete auctions:", error);
  }
});

console.log("Auction completion cron job started");
```

Run it with: `node scripts/cron-complete-auctions.js`

## Manual Testing

You can manually test the endpoint using curl or any HTTP client:

```bash
curl -X POST http://localhost:3000/api/cron/complete-auctions \
  -H "Authorization: Bearer your-cron-secret" \
  -H "Content-Type: application/json"
```

## Monitoring

The endpoint logs all activities to the console with `[CRON]` prefix. Monitor your logs to ensure auctions are being completed properly.

## Frequency Recommendations

- **Production**: Every 1-5 minutes
- **Development**: Every 30 seconds for testing
- **High Volume**: Consider every 30 seconds

## Security Notes

1. Keep your `CRON_SECRET` secure and rotate it regularly
2. Monitor the endpoint for unusual activity
3. Consider rate limiting if exposed publicly
4. Use HTTPS in production

## Troubleshooting

1. **Unauthorized errors**: Check your `CRON_SECRET` environment variable
2. **Database connection issues**: Ensure MongoDB is accessible
3. **No auctions processed**: Verify auction `endTime` values are correct
4. **Statistics not updating**: Check User model updates in logs
