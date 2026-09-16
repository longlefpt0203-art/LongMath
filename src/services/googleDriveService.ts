import { DocumentItem } from '../types';

export interface DriveFolderInfo {
  id: string;
  name: string;
  webViewLink?: string;
  isNewlyCreated?: boolean;
}

export const DRIVE_DEFAULT_FOLDER_NAME = 'Tài Liệu Toán THPT - Lê Ngọc Long';

/**
 * Tự động tìm hoặc tạo mới Thư mục trên Google Drive để lưu trữ tài liệu
 */
export async function autoEnsureDriveFolder(
  accessToken: string,
  folderName: string = DRIVE_DEFAULT_FOLDER_NAME
): Promise<DriveFolderInfo> {
  // 1. Kiểm tra xem thư mục đã tồn tại trong Google Drive hay chưa
  const query = encodeURIComponent(
    `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&spaces=drive`;

  const searchRes = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!searchRes.ok) {
    const errData = await searchRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Lỗi khi kiểm tra thư mục: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    // Thư mục đã tồn tại
    const existing = searchData.files[0];
    return {
      id: existing.id,
      name: existing.name,
      webViewLink: existing.webViewLink || `https://drive.google.com/drive/folders/${existing.id}`,
      isNewlyCreated: false,
    };
  }

  // 2. Tự động tạo mới thư mục trên Google Drive
  const createUrl = 'https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink';
  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Thư mục tự động lưu tài liệu và đề thi Toán THPT - Bản quyền Lê Ngọc Long',
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Không thể tạo thư mục: ${createRes.statusText}`);
  }

  const created = await createRes.json();
  return {
    id: created.id,
    name: created.name,
    webViewLink: created.webViewLink || `https://drive.google.com/drive/folders/${created.id}`,
    isNewlyCreated: true,
  };
}

/**
 * Tự động đồng bộ / lưu 1 tài liệu toán học vào thư mục Google Drive
 */
export async function saveDocumentToDrive(
  accessToken: string,
  folderId: string,
  doc: DocumentItem
): Promise<{ id: string; name: string; webViewLink?: string }> {
  // 1. Nếu có file PDF thực tế (Data URL base64), tải file PDF trực tiếp lên Google Drive
  if (doc.fileDataUrl && doc.fileDataUrl.startsWith('data:')) {
    try {
      const base64Parts = doc.fileDataUrl.split(',');
      if (base64Parts.length > 1) {
        const base64Data = base64Parts[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const pdfFileName = doc.fileName?.endsWith('.pdf')
          ? doc.fileName
          : `${doc.latexExchangeCode} - ${doc.title}.pdf`;

        const metadata = {
          name: pdfFileName,
          parents: [folderId],
          mimeType: 'application/pdf',
          description: `Tài liệu: ${doc.title} • Đơn vị: ${doc.institution || 'Biên soạn Toán THPT'} • Mã trao đổi LaTeX: ${doc.latexExchangeCode} • Tác giả: Lê Ngọc Long`,
        };

        const boundary = '-------toanlongdrivepdfboundary314159';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const metadataPart =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/pdf\r\n\r\n';

        const encoder = new TextEncoder();
        const headerBytes = encoder.encode(metadataPart);
        const footerBytes = encoder.encode(closeDelimiter);

        // Ghép Multipart body: Header (Metadata) + Binary (PDF bytes) + Footer (Close delimiter)
        const combinedBody = new Uint8Array(headerBytes.length + bytes.length + footerBytes.length);
        combinedBody.set(headerBytes, 0);
        combinedBody.set(bytes, headerBytes.length);
        combinedBody.set(footerBytes, headerBytes.length + bytes.length);

        const uploadRes = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': `multipart/related; boundary=${boundary}`,
            },
            body: combinedBody,
          }
        );

        if (uploadRes.ok) {
          const resJson = await uploadRes.json();
          return {
            id: resJson.id,
            name: resJson.name,
            webViewLink: resJson.webViewLink || `https://drive.google.com/file/d/${resJson.id}/view`,
          };
        }
      }
    } catch (err) {
      console.warn('Không thể upload binary PDF trực tiếp, chuyển sang lưu trữ cấu trúc LaTeX:', err);
    }
  }

  // 2. Upload dạng tệp chi tiết kèm Mã trao đổi LaTeX và Mục lục
  const fileName = `${doc.latexExchangeCode} - ${doc.title}.txt`;

  // Nội dung chi tiết của tài liệu kèm mẫu mã nguồn LaTeX
  const fileContent = `===============================================================
TÀI LIỆU TOÁN THPT - BẢN QUYỀN LÊ NGỌC LONG
Mã trao đổi LaTeX: ${doc.latexExchangeCode}
Tiêu đề: ${doc.title}
Phân loại: ${doc.category === 'de-thi-hsg' ? 'Đề thi Học Sinh Giỏi' : doc.category === 'de-thi-tn-thpt' ? 'Đề thi Thử Tốt Nghiệp THPT' : 'Tài Liệu Chuyên Đề'}
Đơn vị ra đề: ${doc.institution || 'Biên soạn Toán THPT'}
Kỳ thi: ${doc.examName || 'Đề khảo sát / thi thử'}
Quy mô đề: ${doc.questionCount || 'Đang cập nhật'}
Khối lớp: ${doc.grade} • Năm học: ${doc.year || '2024 - 2025'}
Chuyên đề: ${doc.topic} • Độ khó: ${doc.difficulty}
Số trang: ${doc.pages} trang • Định dạng: PDF + LaTeX
Tác giả & Bản quyền: Lê Ngọc Long
Liên hệ Zalo nhận source LaTeX: https://zaloapp.com/qr/p/1jw57gmjskxkn
===============================================================

[TÓM TẮT & MÔ TẢ]:
${doc.summary}

[DANH SÁCH CHỦ ĐỀ & THẺ]:
${doc.tags.map((t, idx) => `  ${idx + 1}. ${t}`).join('\n')}

[CẤU TRÚC MỤC LỤC]:
${doc.tableOfContents ? doc.tableOfContents.map((c, idx) => `  - ${c}`).join('\n') : 'Cấu trúc chuyên đề chuẩn GDPT'}

[CÂU HỎI TIÊU BIỂU / MẪU LATEX]:
${doc.sampleQuestions ? doc.sampleQuestions.join('\n') : '% Mã nguồn LaTeX chuẩn GDPT'}
`;

  // Kiểm tra file đã có trong thư mục chưa
  const query = encodeURIComponent(
    `'${folderId}' in parents and name = '${fileName.replace(/'/g, "\\'")}' and trashed = false`
  );
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`;
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0];
    }
  }

  // Tải lên Google Drive bằng multipart upload
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'text/plain',
    description: `Tài liệu: ${doc.title} - Tác giả Lê Ngọc Long`,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!uploadRes.ok) {
    const errData = await uploadRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Lỗi khi lưu tài liệu lên Drive');
  }

  return await uploadRes.json();
}
