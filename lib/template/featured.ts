export function getFeaturedMaximTemplate(username: string, quote: string) {
     return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #7C3AED;
            margin-bottom: 10px;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .quote {
            font-style: italic;
            font-size: 18px;
            margin: 20px 0;
            padding: 20px;
            background-color: white;
            border-left: 4px solid #7C3AED;
        }
        .cta {
            text-align: center;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #7C3AED;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            color: #6B7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">ShitFast</div>
        <h1>Your Maxim is Featured Today! 🎉</h1>
    </div>
    
    <div class="content">
        <p>Hey ${username},</p>
        <p>Great news! Your maxim has been selected as today's featured quote on ShitFast!</p>
        
        <div class="quote">
            "${quote}"
        </div>
        
        <p>Your wisdom is now inspiring thousands of builders and makers in our community. Keep sharing your insights!</p>
        
        <div class="cta">
            <a href="https://shitfast.stackforgelabs.icu" class="button">View on ShitFast</a>
        </div>
        
        <p>Keep building and shipping! 🚀</p>
    </div>
    
    <div class="footer">
        <p>© 2025 ShitFast. All rights reserved.</p>
        <p>Made with ❤️ for builders who ship fast</p>
    </div>
</body>
</html>
`;
}
