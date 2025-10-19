import sentEmailUtility from '../sentEmailUtility';
import { referralBonusTemplate } from './referralBonusHTML';

interface ISendReferralBonusEmail {
  userEmail: string;
  userName: string;
  creditsEarned: number;
  referralCode?: string;
  referredUserName?: string;
}

export const sendReferralBonusEmail = async ({
  userEmail,
  userName,
  creditsEarned,
  referralCode,
  referredUserName,
}: ISendReferralBonusEmail) => {
  try {
    const subject = `🎉 You've earned ${creditsEarned} credits! - Neo Market Referral Bonus`;
    const htmlContent = referralBonusTemplate(
      userName,
      creditsEarned,
      referralCode,
      referredUserName
    );

    await sentEmailUtility(
      userEmail,
      subject,
      htmlContent
    );

    console.log(`Referral bonus email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending referral bonus email:', error);
    return false;
  }
};

// Send email to both referrer and referred user
export const sendReferralBonusEmails = async (
  referrerEmail: string,
  referrerName: string,
  referrerCode: string,
  referredEmail: string,
  referredName: string,
  creditsEarned: number = 2
) => {
  try {
    // Send email to referrer
    const referrerEmailSent = await sendReferralBonusEmail({
      userEmail: referrerEmail,
      userName: referrerName,
      creditsEarned,
      referralCode: referrerCode,
      referredUserName: referredName,
    });

    // Send email to referred user
    const referredEmailSent = await sendReferralBonusEmail({
      userEmail: referredEmail,
      userName: referredName,
      creditsEarned,
      referredUserName: referrerName,
    });

    return {
      referrerEmailSent,
      referredEmailSent,
      success: referrerEmailSent && referredEmailSent,
    };
  } catch (error) {
    console.error('Error sending referral bonus emails:', error);
    return {
      referrerEmailSent: false,
      referredEmailSent: false,
      success: false,
    };
  }
};
