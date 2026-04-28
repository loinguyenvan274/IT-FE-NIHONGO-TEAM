/**
 * CV Download Service
 * Handles downloading candidate profile as PDF
 */

const DEFAULT_API_BASE_URL = '';

function normalizeBaseUrl(baseUrl) {
  const normalizedBaseUrl = baseUrl === undefined || baseUrl === null ? DEFAULT_API_BASE_URL : baseUrl;
  return String(normalizedBaseUrl).replace(/\/$/, '');
}

function getCandidateAuthToken() {
  const envToken = import.meta.env.VITE_CANDIDATE_API_TOKEN;
  if (envToken && String(envToken).trim()) {
    return String(envToken).trim();
  }

  if (typeof window !== 'undefined') {
    const localStorageToken = window.localStorage.getItem('auth_access_token');
    if (localStorageToken && localStorageToken.trim()) {
      return localStorageToken.trim();
    }
  }

  return '';
}

function candidateRequestHeaders() {
  const authToken = getCandidateAuthToken();
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

/**
 * Download candidate CV as PDF from backend
 * @param {string} apiBaseUrl - Optional API base URL
 * @param {string} template - Template name: 'professional' (default), 'modern', 'minimal'
 * @returns {Promise<Blob>} PDF blob
 */
export async function downloadCVFromBackend(apiBaseUrl = '', template = 'professional') {
  try {
    const baseUrl = normalizeBaseUrl(apiBaseUrl);
    const downloadUrl = baseUrl
      ? `${baseUrl}/api/profiles/candidate/download-cv/?template=${template}`
      : `/api/profiles/candidate/download-cv/?template=${template}`;

    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: candidateRequestHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Vui lòng đăng nhập lại để tải CV.');
      }
      if (response.status === 403) {
        throw new Error('Bạn không có quyền tải CV.');
      }
      if (response.status === 404) {
        throw new Error('Không tìm thấy hồ sơ của bạn.');
      }
      throw new Error(`Lỗi tải CV: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading CV from backend:', error);
    throw error;
  }
}

/**
 * Download CV as PDF using file blob and trigger browser download
 * @param {Blob} pdfBlob - PDF blob from backend
 * @param {string} filename - Output filename
 */
export function triggerCVDownload(pdfBlob, filename = 'CV.pdf') {
  try {
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error triggering CV download:', error);
    throw error;
  }
}

/**
 * Main function to download and save CV
 * @param {string} candidateName - Candidate name for filename
 * @param {string} apiBaseUrl - Optional API base URL
 * @param {string} template - Template: 'professional' (default), 'modern', 'minimal'
 */
export async function downloadCVFile(candidateName = 'CV', apiBaseUrl = '', template = 'professional') {
  try {
    const pdfBlob = await downloadCVFromBackend(apiBaseUrl, template);
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `CV_${candidateName}_${timestamp}.pdf`.replace(/\s+/g, '_');
    triggerCVDownload(pdfBlob, filename);
  } catch (error) {
    console.error('Failed to download CV:', error);
    throw error;
  }
}

/**
 * Generate CV HTML string for client-side PDF generation
 * (Alternative approach using html2canvas + jsPDF)
 * @param {Object} profile - Candidate profile data
 * @returns {string} HTML string
 */
export function generateCVHTML(profile) {
  if (!profile) {
    return '';
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const skillsText =
    Array.isArray(profile.skills) && profile.skills.length > 0
      ? profile.skills.join(', ')
      : profile.ky_nang || '';

  const languagesHTML =
    Array.isArray(profile.languages) && profile.languages.length > 0
      ? profile.languages
          .map((lang) => `<li>${lang.name}: <strong>${lang.level}</strong></li>`)
          .join('')
      : '';

  const projectsHTML =
    Array.isArray(profile.projects) && profile.projects.length > 0
      ? profile.projects
          .map(
            (proj) => `
            <div style="margin-bottom: 12px;">
              <h4 style="margin: 0 0 4px 0;">${proj.title}</h4>
              <p style="margin: 0 0 4px 0; font-size: 13px; color: #555;">${proj.description}</p>
              ${
                proj.tags && proj.tags.length > 0
                  ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #777;"><em>Công nghệ: ${proj.tags.join(', ')}</em></p>`
                  : ''
              }
              ${
                proj.link
                  ? `<p style="margin: 0; font-size: 12px;"><a href="${proj.link}" target="_blank">${proj.link}</a></p>`
                  : ''
              }
            </div>
          `,
          )
          .join('')
      : '';

  const educationHTML =
    Array.isArray(profile.education_timeline) && profile.education_timeline.length > 0
      ? profile.education_timeline
          .map(
            (edu) => `
            <div style="margin-bottom: 12px;">
              <h4 style="margin: 0 0 4px 0;">${edu.title}</h4>
              ${edu.subtitle ? `<p style="margin: 0 0 2px 0; font-size: 13px;">${edu.subtitle}</p>` : ''}
              ${edu.period ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #777;">${edu.period}</p>` : ''}
              ${
                edu.certificates && edu.certificates.length > 0
                  ? `
                <ul style="margin: 4px 0; padding-left: 20px;">
                  ${edu.certificates.map((cert) => `<li style="font-size: 12px;">${cert.name} (${cert.year})</li>`).join('')}
                </ul>
              `
                  : ''
              }
            </div>
          `,
          )
          .join('')
      : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>CV - ${profile.full_name || 'Candidate'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #333;
          background: white;
          line-height: 1.5;
        }
        .cv-container {
          max-width: 8.5in;
          height: 11in;
          padding: 0.75in;
          margin: auto;
          background: white;
        }
        .cv-header {
          text-align: center;
          margin-bottom: 0.3in;
          border-bottom: 2px solid #1F4788;
          padding-bottom: 0.15in;
        }
        .cv-header h1 {
          font-size: 24px;
          color: #1F4788;
          margin: 0;
          font-weight: 700;
        }
        .cv-header .headline {
          font-size: 13px;
          color: #555;
          margin: 4px 0;
        }
        .contact-info {
          font-size: 11px;
          color: #666;
          margin: 4px 0;
        }
        .cv-section {
          margin-bottom: 0.2in;
        }
        .cv-section h2 {
          font-size: 13px;
          color: #2C5AA0;
          margin: 0 0 8px 0;
          padding-bottom: 4px;
          border-bottom: 1px solid #2C5AA0;
          font-weight: 700;
        }
        .cv-section p {
          font-size: 11px;
          line-height: 1.4;
          margin: 0 0 6px 0;
          color: #555;
        }
        .cv-section ul {
          margin: 0;
          padding-left: 20px;
        }
        .cv-section li {
          font-size: 11px;
          line-height: 1.4;
          color: #555;
        }
        .skills-list {
          font-size: 11px;
          color: #555;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .cv-container {
            max-width: 100%;
            height: auto;
            page-break-after: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="cv-container">
        <div class="cv-header">
          <h1>${profile.full_name || 'Ứng viên'}</h1>
          <div class="headline">${profile.headline || profile.vi_tri_mong_muon || 'Ứng viên'}</div>
          <div class="contact-info">
            ${profile.phone_number ? `📞 ${profile.phone_number}` : ''}
            ${profile.email ? `| ✉️ ${profile.email}` : ''}
            ${profile.location ? `| 📍 ${profile.location}` : ''}
          </div>
        </div>

        ${
          profile.overview || profile.gioi_thieu
            ? `
            <div class="cv-section">
              <h2>Giới thiệu</h2>
              <p>${profile.overview || profile.gioi_thieu}</p>
            </div>
          `
            : ''
        }

        ${
          skillsText
            ? `
            <div class="cv-section">
              <h2>Kỹ năng</h2>
              <p class="skills-list">${skillsText}</p>
            </div>
          `
            : ''
        }

        ${
          languagesHTML
            ? `
            <div class="cv-section">
              <h2>Ngôn ngữ</h2>
              <ul>${languagesHTML}</ul>
            </div>
          `
            : ''
        }

        ${
          projectsHTML
            ? `
            <div class="cv-section">
              <h2>Dự án</h2>
              ${projectsHTML}
            </div>
          `
            : ''
        }

        ${
          educationHTML
            ? `
            <div class="cv-section">
              <h2>Học vấn & Chứng chỉ</h2>
              ${educationHTML}
            </div>
          `
            : ''
        }
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate PDF from HTML using html2canvas and jsPDF (Client-side approach)
 * @param {Object} profile - Candidate profile data
 * @param {string} candidateName - For filename
 */
export async function generatePDFClientSide(profile, candidateName = 'CV') {
  try {
    // Dynamically import jsPDF and html2canvas
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    // Create temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.innerHTML = generateCVHTML(profile);
    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `CV_${candidateName}_${timestamp}.pdf`.replace(/\s+/g, '_');
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
