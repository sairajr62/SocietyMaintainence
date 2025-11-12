import Society from '../models/Society.js';
import User from '../models/User.js';

import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// inside your controller: build the html string with template literals
const buildManagerInviteEmail = ({ managerName, managerEmail, managerPassword, societyName, loginUrl }) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Manager Credentials</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;-webkit-font-smoothing:antialiased;font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f4f6f8;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="680" max-width="680" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(23,23,23,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:20px 28px 8px;border-bottom:1px solid #eef2f6;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,#2b9ef7,#6a67f5);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px;">
                  MP
                </div>
                <div>
                  <div style="font-size:16px;font-weight:700;color:#0f1724;">Maintenance PRO</div>
                  <div style="font-size:13px;color:#5b6b78;margin-top:2px;">Society management platform</div>
                </div>
              </div>
            </td>
          </tr>

          <!-- Hero / Intro -->
          <tr>
            <td style="padding:28px;">
              <h1 style="margin:0 0 8px;font-size:20px;color:#0f1724;font-weight:700;">Welcome, ${escapeHtml(managerName)} 👋</h1>
              <p style="margin:0 0 18px;color:#475569;font-size:14px;line-height:1.5;">
                A new society "<strong>${escapeHtml(societyName)}</strong>" has been created and you have been assigned as its manager. Use the credentials below to sign in to the Management Panel.
              </p>

              <!-- Credentials Card -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:10px;border-radius:10px;border:1px solid #edf2f7;background:#fbfdff;">
                <tr>
                  <td style="padding:14px 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="font-size:13px;color:#6b7280;padding-bottom:8px;width:120px;">Manager</td>
                        <td style="font-size:14px;color:#0f1724;font-weight:600;">${escapeHtml(managerName)}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#6b7280;padding-bottom:8px;padding-top:8px;">Email</td>
                        <td style="font-size:14px;color:#0f1724;font-weight:600;padding-top:8px;">${escapeHtml(managerEmail)}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#6b7280;padding-top:8px;">Password</td>
                        <td style="font-size:14px;color:#0f1724;font-weight:600;padding-top:8px;">${escapeHtml(managerPassword)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="margin-top:22px;text-align:left;">
                <a href="${escapeAttr(loginUrl)}" style="display:inline-block;padding:12px 18px;background:linear-gradient(90deg,#2b9ef7,#6a67f5);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
                  Go to Admin Panel
                </a>
              </div>

              <!-- Notes -->
              <p style="margin:18px 0 0;color:#6b7280;font-size:13px;line-height:1.5;">
                <strong>Important:</strong> For security, please change your password after first login. If you didn't expect this email, ignore it or contact your admin.
              </p>

              <!-- Divider -->
              <div style="height:1px;background:#eef2f6;margin:20px 0;border-radius:1px;"></div>

              <!-- Footer / small -->
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div style="font-size:13px;color:#94a3b8;">
                  Maintenance PRO • <span style="color:#607085">Secure society management</span>
                </div>
                <div style="font-size:12px;color:#8b98a6;margin-top:6px;">
                  Need help? Reply to this email or contact support.
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Mobile footer spacing -->
        <div style="max-width:680px;padding:12px 0;font-size:12px;color:#94a3b8;text-align:center;">
          © ${new Date().getFullYear()} Maintenance PRO. All rights reserved.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// simple helper to escape text for HTML insertion
function escapeHtml(unsafe) {
  if (!unsafe && unsafe !== 0) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// helper for escaping attribute values (slightly different handling)
function escapeAttr(unsafe) {
  return escapeHtml(unsafe).replace(/"/g, "&quot;");
}



const buildManagerInviteText = ({ managerName, managerEmail, managerPassword, societyName, loginUrl }) =>
  `Welcome ${managerName},

A society "${societyName}" has been created and you are assigned as manager.

Your credentials:
Email: ${managerEmail}
Password: ${managerPassword}

Login: ${loginUrl}

Please change your password after first login. If you did not request this, contact support.
`;



export const createSociety = async (req, res) => {
  try {
    const { societyName, address, city, state, pinCode, managerName, managerEmail, managerPhone, managerPassword } = req.body;

    if (!societyName || !address || !city || !state || !pinCode || !managerName || !managerEmail || !managerPhone || !managerPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Create Manager User
    const manager = await User.create({
      name: managerName,
      email: managerEmail,
      phone: managerPhone,
      password: managerPassword,
      role: 'admin'
    });

    // Create Society and Assign Manager
    const society = await Society.create({
      name: societyName,
      address,
      city,
      state,
      pinCode,
      manager: manager._id
    });

    // Link Manager to Society
    manager.society = society._id;
    const saved = await manager.save();

    if (saved) {

      const html = buildManagerInviteEmail({
        managerName: manager.name,
        managerEmail: manager.email,
        managerPassword: managerPassword, // consider sending a reset link instead in prod
        societyName: society.name,
        loginUrl: process.env.APP_URL
      });

      const text = buildManagerInviteText({
        managerName: manager.name,
        managerEmail: manager.email,
        managerPassword: managerPassword,
        societyName: society.name,
        loginUrl: process.env.APP_URL
      });

      try {
        const info = await transporter.sendMail({
          from: `"Maintenance PRO" <${process.env.EMAIL_USER}>`,
          to: managerEmail,
          subject: "Manager Credentials",
          html,
          text,
        });

        console.log("Message sent:", info.response);
      } catch (mailError) {
        console.error("❌ Failed to send email:", mailError);
      }
    }

    return res.status(201).json({ message: 'Society and manager created', society, manager });


  } catch (error) {
    console.error('Failed To Create Society And Manager:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}



// export const getSocietyDetails = async (req, res) => {
//     try {
//         const { societyId } = req.params;
//         const society = await Society.findById(societyId).populate('manager', 'name email phone');
//         if (!society) {
//             return res.status(404).json({ message: 'Society not found' });
//         }
//         return res.status(200).json({ society });
//     } catch (error) {
//         console.error('Failed To Get Society Details:', error);
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// }


export const addSocietyMembers = async (req, res) => {
  try {
    const {
      flatNo,
      fullName,
      phone,
      email,
      password,
      societyId,
    } = req.body;

    if (!flatNo || !fullName || !phone || !email || !password || !societyId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    const newMember = await User.create({
      name: fullName,
      email,
      phone,
      password,
      flat: flatNo,
      society: society._id,
    })

    await newMember.save();

    await society.members.push(newMember._id);
    await society.save();

    try {
      const info = await transporter.sendMail({
        from: `"Maintenance PRO" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Member Credentials",
        html: `<p>Welcome ${fullName},</p>
                <p>You have been added as a member to the society "${society.name}".</p>
                <p>Your credentials are as follows:</p> 
                <ul>
                <li>Email: ${email}</li>
                <li>Password: ${password}</li>
                </ul>
                <p>Please log in at ${process.env.APP_URL} and change your password after your first login.</p>
                <p>If you did not expect this email, please contact your society manager.</p>
          `,
        text: `Welcome ${fullName}, 
                You have been added as a member to the society "${society.name}".
                Your credentials are as follows:
                Email: ${email}
                Password: ${password}
                Please log in at ${process.env.APP_URL} and change your password after your first login.
                If you did not expect this email, please contact your society manager.
          `,
      });

      console.log("Message sent:", info.response);
    } catch (mailError) {
      console.error("❌ Failed to send email:", mailError);
    }



    return res.status(201).json({ message: 'Member added successfully', member: newMember });

  } catch (error) {
    console.error('Failed To Add Society Member:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}


export const getSocietyMembers = async (req, res) => {
  try {
    const { managerId } = req.params;

    // 1️⃣ Validate managerId
    if (!managerId) {
      return res.status(400).json({ message: 'Manager ID is required' });
    }

    // 2️⃣ Find manager and validate existence
    const manager = await User.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    // 3️⃣ Find society managed by this manager
    const society = await Society.findOne({ manager: manager._id }).populate({
      path: 'members',
      select: '-password -refreshToken -__v',
    });

    if (!society) {
      return res.status(404).json({ message: 'Society not found for this manager' });
    }

    // 5️⃣ Return members
    res.status(200).json({
      success: true,
      societyName: society.name,
      totalMembers: society.members.length,
      members: society.members,
    });

  } catch (error) {
    console.error('Error fetching society members:', error);
    res.status(500).json({
      message: 'Server error while fetching society members',
      error: error.message,
    });
  }
};

export const getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find().populate('manager', 'name email phone').sort({ createdAt: -1 }).exec()
    if (societies.length === 0) return res.status(204).json({ message: "No Societies Found" })
    return res.status(200).json({ message: "Societies Found Successfully", societies })
  } catch (error) {
    return res.status(400).json({ message: "Error Fetching Societies", error: error.message })
  }
} 
