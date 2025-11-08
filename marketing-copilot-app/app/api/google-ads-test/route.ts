const response = await fetch(
    `https://googleads.googleapis.com/v16/customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/googleAds:searchStream`,
    {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
            "login-customer-id": process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: "SELECT campaign.id, campaign.name, campaign.status FROM campaign LIMIT 5"
        })
    }
);