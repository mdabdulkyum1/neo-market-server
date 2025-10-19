export const referralBonusTemplate = (
  userName: string,
  creditsEarned: number,
  referralCode?: string,
  referredUserName?: string
) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Referral Bonus - Neo Market</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">
 
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0; padding:0; width:100%;">
<tr>
<td align="center" style="padding:40px 15px;">
<!-- Container -->
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" 
               style="max-width:600px; background:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); overflow:hidden;">
<!-- Header with Gradient Background -->
<tr>
<td align="center" 
                style="padding:50px 20px 40px 20px;
                       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                       color: white;">
<div style="width:80px; height:80px; background:rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px auto;">
<span style="font-size:32px;">🎉</span>
</div>
<h1 style="margin:0 0 10px 0; font-size:28px; font-weight:700; color:#ffffff;">Congratulations!</h1>
<p style="margin:0; font-size:16px; opacity:0.9;">You've earned referral credits!</p>
</td>
</tr>
 
          <!-- Content -->
<tr>
<td style="padding:30px 40px 20px 40px; text-align:left; color:#5a6c7d; font-size:15px; line-height:1.6;">
<p style="margin:0 0 15px 0; font-size:18px; color:#2c3e50;">Hello ${userName},</p>
<p style="margin:0 0 20px 0;">Great news! You've earned <strong style="color:#667eea; font-size:18px;">${creditsEarned} credits</strong> from your referral program on <strong style="color:#2c3e50;">Neo Market</strong>!</p>
${referredUserName ? `<p style="margin:0 0 20px 0;">🎯 <strong>${referredUserName}</strong> made their first purchase using your referral link!</p>` : ''}
<p style="margin:0 0 20px 0;">These credits can be used to purchase digital products on our platform. Keep sharing your referral link to earn more credits!</p>
</td>
</tr>
 
          <!-- Credits Section -->
<tr>
<td align="center" style="padding:20px 40px;">
<div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius:12px; padding:30px; display:inline-block; color:white; text-align:center;">
<p style="margin:0 0 10px 0; font-size:16px; opacity:0.9;">Credits Earned</p>
<p style="margin:0; font-size:48px; font-weight:700; letter-spacing:2px;">
                  +${creditsEarned}
</p>
<p style="margin:10px 0 0 0; font-size:14px; opacity:0.8;">Credits added to your account</p>
</div>
</td>
</tr>

${referralCode ? `
          <!-- Referral Link Section -->
<tr>
<td style="padding:20px 40px;">
<div style="background:#f8f9fa; border-radius:8px; padding:20px; text-align:center;">
<p style="margin:0 0 15px 0; font-size:14px; color:#2c3e50; font-weight:600;">Share your referral link and earn more credits!</p>
<div style="background:#ffffff; border:2px dashed #667eea; border-radius:6px; padding:15px; margin:10px 0;">
<p style="margin:0; font-size:14px; color:#667eea; word-break:break-all; font-family:monospace;">
${process.env.FRONTEND_URL || 'https://neomarket.com'}/register?r=${referralCode}
</p>
</div>
<p style="margin:10px 0 0 0; font-size:12px; color:#7f8c8d;">Each successful referral earns you 2 credits!</p>
</div>
</td>
</tr>
` : ''}
 
          <!-- Action Button -->
<tr>
<td align="center" style="padding:20px 40px;">
<a href="${process.env.FRONTEND_URL || 'https://neomarket.com'}/dashboard" 
   style="display:inline-block; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:25px; font-weight:600; font-size:16px;">
   View Dashboard
</a>
</td>
</tr>
 
          <!-- Footer -->
<tr>
<td align="center" style="padding:30px 20px; background:#f9f9f9; border-top:1px solid #eee;">
<p style="margin:0; font-size:14px; color:#2c3e50;">Best regards,</p>
<p style="margin:0; font-size:13px; color:#7f8c8d;">Team Neo Market</p>
</td>
</tr>
 
        </table>
</td>
</tr>
</table>
 
</body>
</html>`;
